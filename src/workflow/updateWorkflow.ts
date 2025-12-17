import { EmailStatus, PersonStatus } from "@prisma/client";
import { prisma } from "../DB/prisma";
import { workflowConfig } from "./workflowConfig";
import { enqueueGenerateEmail } from "../queue/generateEmail.producer";
import { enqueueSendEmail } from "../queue/sendEmail.producer";

export default function updateWorkflow() {

}

async function sendFollowUps() {
    const people = await prisma.apolloPerson.findMany({
        where: {
            status: {
                in: [PersonStatus.emailSent || PersonStatus.followUpSent]
            }
        }
    });

    for (const person of people) {
        const outboundCount = await prisma.email.count({
            where: {
                personId: person.apolloPersonId,
                direction: "outbound",
                status: "sent",
            },
        });

        if (outboundCount >= workflowConfig.followUps + 1) continue;

        if (
            workflowConfig.changeFollowUpAt == 'everyEmail' ||
            workflowConfig.changeFollowUpAt == outboundCount + 1
        ) {
            await enqueueGenerateEmail(person.apolloPersonId);
        }
        else {
            const latestEmail = await prisma.email.findFirst({
                where: {
                    personId: person.apolloPersonId,
                    direction: "outbound",
                    status: "sent",
                },
                orderBy: {
                    sentAt: "desc",
                },
            });
            if (!latestEmail) continue;
            await enqueueSendEmail(latestEmail.id);
        }
    }
}