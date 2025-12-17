import { generateEmailQueue } from "./generateEmail.queue";

export async function enqueueGenerateEmail(
    payload: { personId: string },
    delayMs = 0
) {
    await generateEmailQueue.add(
        "generate-email",
        payload,
        {
            // jobId: `email_${payload.personId}`,
            delay: delayMs,
            attempts: 2,
            backoff: {
                type: "exponential",
                delay: 30_000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        }
    );
}
