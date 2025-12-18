import { generateEmail } from "./email/generateEmail";
import { PersonDBSchema } from "./schema/personDBSchema";
import z from "zod";
import { Worker } from "bullmq";
import { prisma } from "./DB/prisma";
import { enqueueSendEmail } from "./queue/sendEmail.producer";
import { connection } from "./queue/redis";
import { EmailDirection, EmailStatus } from "@prisma/client";

export const generateEmailWorker = new Worker(
    "generate-email-queue",
    async (job) => {
        try {
            const person = await prisma.apolloPerson.findUnique({
                where: { apolloPersonId: job.data.personId },
            }) as z.infer<typeof PersonDBSchema>;

            if (!person) {
                throw new Error("Person not found");
            }

            const emailData = await prisma.email.findFirst({
                where: {
                    personId: person.apolloPersonId,
                    status: EmailStatus.draft,
                },
            });

            if (emailData) {
                return;
            }

            const emailContent = await generateEmail(person, job.data.responding);
            const email = await prisma.email.create({
                data: {
                    personId: person.apolloPersonId,
                    subject: emailContent.subject,
                    htmlContent: emailContent.htmlContent,
                    direction: EmailDirection.outbound,
                },
            });

            await enqueueSendEmail(email.id);
        }
        catch (error) {
            console.error("Error generating email", error);
            throw error;
        }
    }, {
    connection,
    concurrency: 2
});