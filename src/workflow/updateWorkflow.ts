import { EmailDirection, EmailStatus, PersonStatus } from "@prisma/client";
import { prisma } from "../DB/prisma";
import { workflowConfig } from "./workflowConfig";
import { enqueueGenerateEmail } from "../queue/generateEmail.producer";
import { enqueueSendEmail } from "../queue/sendEmail.producer";
import { getUnreadMails } from "../email/getEmails";
import extractIntent from "../email/parseEmail";
import { Email } from "../schema/workflowSchema";

export default async function updateWorkflow() {
    await sendFollowUps();
    await checkInboundMails();
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
                direction: EmailDirection.inbound,
                status: EmailStatus.sent,
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
                    direction: EmailDirection.inbound,
                    status: EmailStatus.sent,
                },
                orderBy: {
                    sentAt: "desc",
                },
            });
            if (!latestEmail) continue;
            const clonedEmail = await prisma.email.create({
                data: {
                    personId: person.apolloPersonId,
                    direction: EmailDirection.outbound,
                    subject: latestEmail.subject,
                    htmlContent: latestEmail.htmlContent
                }
            });
            await enqueueSendEmail(clonedEmail.id);
        }
    }
}

async function checkInboundMails() {
    const inboundMails = await getUnreadMails();

    for (const mail of inboundMails) {
        const person = await prisma.apolloPerson.findFirst({
            where: {
                email: mail.from
            }
        });
        if (!person) continue;
        await prisma.email.create({
            data: {
                personId: person.apolloPersonId,
                direction: EmailDirection.inbound,
                subject: mail.subject || "",
                htmlContent: mail.body,
                status: EmailStatus.received
            }
        });
        const allEmails = (await prisma.email.findMany({
            where: {
                personId: person.apolloPersonId,
            },
            orderBy: {
                sentAt: "desc",
            },
        })).map((email) => ({
            direction: email.direction,
            subject: email.subject,
            body: email.htmlContent,
        }));
        const emailInfo = await extractIntent(allEmails);

        resolveNextActions(person.apolloPersonId, mail, emailInfo);
    }
}

async function resolveNextActions(personId: string, mail: Email, emailInfo: { intent: string, confidence: number }) {
    switch (emailInfo.intent) {
        case "positive":
            // create draft
            break;
        case "negative":
            break;
        case "question":
            break;
        case "objection":
            break;
        case "out_of_office":
            break;
        case "referral":
            break;
        case "unsubscribe":
            break;
        case "spam":
            break;
        case "unknown":
            break;
    }
}