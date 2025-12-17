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