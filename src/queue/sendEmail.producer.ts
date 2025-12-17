import { sendEmailQueue } from "./sendEmail.queue";

export async function enqueueSendEmail(
    payload: { emailId: string },
    delayMs = 0
) {
    await sendEmailQueue.add(
        "send-email",
        payload,
        {
            // jobId: `email_${payload.emailId}`,
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
