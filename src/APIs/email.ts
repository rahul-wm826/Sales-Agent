import { Request, Response, Router } from "express";
import { prisma } from "../DB/prisma";
import { processAndSendEmail } from "../email/generateEmail";
import { PersonDBSchema, PersonStatus } from "../schema/personDBSchema";
import z from "zod";

const router = Router();

router.post("/send", async (req: Request, res: Response) => {
    try {
        const prospects = await prisma.apolloPerson.findMany({
            where: {
                status: PersonStatus.prospect,
            },
        }) as z.infer<typeof PersonDBSchema>[];

        await processAndSendEmail(prospects);

        res.status(200).json({
            message: "Started email sending process",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

export const emailRouter = router;