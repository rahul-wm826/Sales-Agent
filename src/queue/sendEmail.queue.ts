import { Queue } from "bullmq";
import { connection } from "./redis";

export const sendEmailQueue = new Queue("send-email-queue", {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 60_000, // 1 minute
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});