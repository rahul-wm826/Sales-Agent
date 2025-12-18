import { generateEmailQueue } from "./generateEmail.queue";

export async function enqueueGenerateEmail(
    personId: string,
    responding: boolean = false,
    delayMs = 0
) {
    await generateEmailQueue.add(
        "generate-email",
        { personId },
        {
            jobId: `gen_email_${personId}`,
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
