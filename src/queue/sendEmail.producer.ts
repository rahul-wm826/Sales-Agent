import { sendEmailQueue } from "./sendEmail.queue";

export async function enqueueSendEmail(
    emailId: string,
    delayMs = 0
) {
    await sendEmailQueue.add(
        "send-email",
        { emailId },
        {
            jobId: `send_email_${emailId}`,
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
