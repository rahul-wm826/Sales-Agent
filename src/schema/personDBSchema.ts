import z from "zod";

export const PersonDBSchema = z.object({
    apolloPersonId: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string().optional(),
    title: z.string().optional(),
    linkedinUrl: z.string().optional(),
    organization: z.string().optional(),
    details: z.json().optional(),
    emailStatus: z.string().optional(),
    status: z.string().optional(),
    mailCount: z.number().optional(),
    lastMailedAt: z.date().optional(),
    enrichedAt: z.date().optional(),
});

export enum PersonStatus {
    prospect = "prospect",           // Email available, not contacted yet
    emailQueued = "email_queued",       // Email generation or send job queued
    emailSent = "email_sent",         // At least one email sent
    followupScheduled = "followup_scheduled", // Waiting for next follow-up
    awaitingReply = "awaiting_reply",     // Email sent, waiting for response
    replied = "replied",            // Client replied (positive or neutral)
    qualified = "qualified",          // Conversation going well, real interest
    notInterested = "not_interested",     // Explicit rejection from client
    noReply = "no_reply",           // Follow-ups exhausted, no response
    dealWon = "deal_won",           // Client converted
    dealLost = "deal_lost",          // Conversation happened but failed
    unsubscribed = "unsubscribed",       // Opted out / requested no contact
}

export enum EmailStatus {
    sent = "sent",
    failed = "failed",
    draft = "draft",
}