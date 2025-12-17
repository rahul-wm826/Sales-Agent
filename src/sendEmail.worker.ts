import { Job, Worker } from "bullmq";
import { prisma } from "./DB/prisma";
import { connection } from "./queue/redis";
import { sendEmail } from "./email/sendEmail";
import { EmailStatus, PersonStatus } from "@prisma/client";
import { enqueueGenerateEmail } from "./queue/generateEmail.producer";

export const sendEmailWorker = new Worker(
    "send-email-queue",
    async (job: Job<{ emailId: string }>) => {
        try {
            const data = job.data;
            const email = await prisma.email.findUnique({
                where: { id: data.emailId },
                include: { person: true },
            });

            if (!email) {
                throw new Error("Email not found");
            }

            await sendEmail({
                to: email.person.email,
                subject: email.subject,
                html: email.htmlContent,
            });

            await prisma.$transaction([
                prisma.email.update({
                    where: { id: data.emailId },
                    data: { status: EmailStatus.sent, sentAt: new Date() },
                }),
                prisma.apolloPerson.update({
                    where: { apolloPersonId: email.personId },
                    data: { status: PersonStatus.emailSent }
                })
            ]);
        }
        catch (error) {
            await prisma.email.update({
                where: { id: job.data.emailId },
                data: { status: EmailStatus.failed },
            });
            console.error("Error sending email", error);
            throw error;
        }
    }, {
    connection,
    concurrency: 5,
});
