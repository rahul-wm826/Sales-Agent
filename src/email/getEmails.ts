import { gmail } from "./gmailClient";
import { Email } from "../schema/workflowSchema";
import { simpleParser } from "mailparser";
import { workflowConfig } from "../workflow/workflowConfig";

function getDateStr(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

function decodeGmailRaw(raw: string): Buffer {
    return Buffer.from(raw.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

export async function getUnreadMails(daysAgo: number = workflowConfig.unreadEmailsDaysAgo) {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
        const afterStr = getDateStr(startDate);

        const tomorrow = new Date();
        tomorrow.setDate(new Date().getDate() + 1);
        const beforeStr = getDateStr(tomorrow);

        const res = await gmail.users.messages.list({
            userId: "me",
            q: `is:unread after:${afterStr} before:${beforeStr}`,
        });

        const messages = res.data.messages || [];
        const emails: Email[] = [];

        for (const message of messages) {
            if (!message.id) continue;
            const msg = await gmail.users.messages.get({
                userId: "me",
                id: message.id,
                format: "raw",
            });

            const emailStr = msg.data.raw;
            if (!emailStr) continue;

            const parsedEmail = await simpleParser(
                decodeGmailRaw(emailStr)
            );

            const fromEmail = parsedEmail.from?.value?.[0]?.address;
            if (!fromEmail || !parsedEmail.text) continue;

            emails.push({
                from: fromEmail,
                subject: parsedEmail.subject,
                body: parsedEmail.text.trim(),
            });
        }

        return emails;
    } catch (error) {
        console.error("Error fetching unread emails:", error);
        return [];
    }
}