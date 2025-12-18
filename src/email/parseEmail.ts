import { ChatOpenAI } from "@langchain/openai";
import { EmailDirection } from "@prisma/client";
import { HumanMessage, SystemMessage } from "langchain";
import z from "zod";

export function getLlm() {
    const OPENROUTER_MODEL = "mistralai/mistral-7b-instruct:free";
    const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

    const llm = new ChatOpenAI({
        model: OPENROUTER_MODEL,
        temperature: 0.1,

        apiKey: process.env.OPENROUTER_API_KEY,

        configuration: {
            baseURL: OPENROUTER_BASE_URL,

            defaultHeaders: {
                "HTTP-Referer": process.env.OPENROUTER_REFERRER,
                "X-Title": "LangGraph Research Agent",
            },
        },
    });

    return llm;
}

export default async function extractInfo(conversation: { direction: EmailDirection, subject: string | undefined, body: string }[]) {
    const llm = getLlm().withStructuredOutput(z.object({
        intent: z.enum(["positive", "negative", "question", "objection", "out_of_office", "referral", "unsubscribe", "spam", "unknown"]),
        confidence: z.number().min(0).max(1),
    }));

    const messages = [
        new SystemMessage(`
            Classify the intent of the LATEST inbound email
            using the provided conversation history.

            Input includes:
            - Subject
            - Recent conversation turns(inbound + outbound)

            Goal:
            Infer the sender’s CURRENT intent from the latest inbound message,
            using prior context only to resolve ambiguity.

            Intents:
            positive, negative, question, objection,
            out_of_office, referral, unsubscribe, spam, unknown

            Rules:
            - Use history to interpret short or ambiguous replies.
            - If reply answers a prior question or confirms next steps → positive.
            - Concerns about price, timing, authority, or trust → objection.
            - Unsubscribe overrides all.
            - Out_of_office overrides all except unsubscribe.
            - Choose the MOST ACTIONABLE intent if multiple appear.
            - Do not infer intent without textual evidence.
            - If confidence < 0.6 → intent = unknown.

            Return ONLY valid JSON matching the schema.
        `),
        new HumanMessage(`
            Subject: ${conversation[conversation.length - 1].subject}

            Conversation (oldest → newest):
            ${conversation.map(
            m => `${m.direction}: ${m.body}`
        ).join("\n")}

            Classify the intent of the latest inbound message.
        `)
    ];
    const response = await llm.invoke(messages);
    return response;
}