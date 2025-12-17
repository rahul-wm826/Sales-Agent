import { Request, Response, Router } from "express";
import { mockBulkEnrich, mockEnrich } from "../apollo/peopleEnrichment";
import parse from "../middleware/parse";
import { z } from "zod";
import { prisma } from "../DB/prisma";
import { EnrichDataType } from "../schema/enrichSchema";

const router = Router();

async function upsertPerson(enrichedData: EnrichDataType['person']) {
    try {
        if (!enrichedData?.id) return;

        await prisma.apolloPerson.upsert({
            where: {
                apolloPersonId: enrichedData.id,
            },
            update: {},
            create: {
                apolloPersonId: enrichedData.id,
                email: enrichedData.email,
                firstName: enrichedData.first_name,
                lastName: enrichedData.last_name,
                title: enrichedData.title,
                linkedinUrl: enrichedData.linkedin_url,
                organization: enrichedData.organization.name,
                emailStatus: enrichedData.email_status,
                details: enrichedData,
            },
        });
    }
    catch (error) {
        console.log("Error upserting person", error);
    }
}

async function checkEnriched(id: string) {
    const alreadyEnriched = await prisma.apolloPerson.findUnique({
        where: { apolloPersonId: id }
    });

    if (alreadyEnriched) {
        return true;
    }

    return false;
}

router.post("/single", parse(z.object({ id: z.string() })), async (req: Request, res: Response) => {
    const { id } = req.body;
    const reveal_personal_emails = true;

    const alreadyEnriched = await checkEnriched(id);
    if (alreadyEnriched) {
        return res.status(409).json({ error: "Person already enriched" });
    }

    const enrichedData = await mockEnrich({
        id,
        reveal_personal_emails
    });

    if (!enrichedData.success) {
        res.status(500).json({ error: 'Failed to fetch enriched data' });
        return;
    }
    if (!enrichedData.data?.person) {
        return res.status(404).json({ error: "Person not found" });
    }

    await upsertPerson(enrichedData.data?.person);
    res.status(200).json(enrichedData.data?.person);
});

router.post("/bulk", parse(z.object({ ids: z.array(z.string()) })), async (req: Request, res: Response) => {
    const { ids } = req.body;
    const reveal_personal_emails = true;
    const idsToEnrich: { id: string }[] = [];

    for (const id of ids) {
        const alreadyEnriched = await checkEnriched(id);

        if (!alreadyEnriched) {
            idsToEnrich.push({ id });
        }
    }

    if (idsToEnrich.length === 0) {
        return res.status(400).json({ error: "All persons already enriched" });
    }

    const enrichedData = await mockBulkEnrich(
        {
            reveal_personal_emails,
        },
        idsToEnrich
    );

    if (!enrichedData.success) {
        res.status(500).json({ error: 'Failed to fetch enriched data' });
        return;
    }
    if (enrichedData.data?.matches) {
        await Promise.all(
            enrichedData.data.matches.map((person) =>
                upsertPerson(person)
            )
        );
    }

    res.status(200).json(enrichedData.data);
});

export const enrichRouter = router;