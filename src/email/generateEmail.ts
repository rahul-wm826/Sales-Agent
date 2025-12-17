import { ChatOpenAI } from "@langchain/openai";
import { configDotenv } from "dotenv";
import { PersonDBSchema } from "../schema/personDBSchema";
import z from "zod";
import { EnrichDataType } from "../schema/enrichSchema";
import { SystemMessage, HumanMessage } from "langchain";
import { enqueueGenerateEmail } from "../queue/generateEmail.producer";

configDotenv();

export async function processAndSendEmail(people: z.infer<typeof PersonDBSchema>[]) {
    let verifiedCount = 0;
    let totalCount = 0;
    for (const person of people) {
        if (person.emailStatus === "verified") {
            verifiedCount++;
            await enqueueGenerateEmail(person.apolloPersonId);
            // await prisma.apolloPerson.update({
            //     where: { apolloPersonId: person.apolloPersonId },
            //     data: { status: PersonStatus.emailQueued }
            // });
        }
        totalCount++;
    }
    console.log(`${verifiedCount} verified emails out of ${totalCount}.`);
}
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

export async function generateEmail(person: z.infer<typeof PersonDBSchema>): Promise<{
    subject: string;
    htmlContent: string;
}> {
    try {
        let enrichedData: EnrichDataType['person'] | null = null;
        if (person.details) {
            console.log(person.details);
            enrichedData = person.details as EnrichDataType['person'];
        }
        const relevantData = {
            firstName: person.firstName,
            lastName: person.lastName,
            title: person.title,
            email: person.email,
            organizationName: person.organization,
            organizationWebsiteUrl: enrichedData?.organization.website_url,
            organizationIndustry: enrichedData?.organization.industry,
            organizationEmployeeCount: enrichedData?.organization.estimated_num_employees,
            organizationCurrentTechnologies: enrichedData?.organization.current_technologies,
            linkedinUrl: person.linkedinUrl,
            headline: enrichedData?.headline,
        };

        const messages = [
            new SystemMessage(`
                You are a professional email assistant. Your task is to write personalized, professional cold emails for potential clients using available lead data.  

                Input may include:
                - Person: name, title, role  
                - Organization: name, website, industry, size, revenue  
                - Social profiles: LinkedIn, Twitter, etc.  
                - Recent funding, blog posts, news, technologies  
                - Any other enrichment data available  
                
                Email rules:
                1. Address the recipient by name and title if appropriate.  
                2. Reference specific points about the organization, achievements, or initiatives; avoid generic statements.  
                3. Explain how our AI web development services add value.  
                4. Keep it concise: 3–5 short paragraphs, professional and friendly.  
                5. Include a clear call-to-action.  
                6. Correct spelling and grammar.  
                7. Use only the available information; do not invent data.  
                
                Additional instructions:
                - Generate the **email subject line separately** and label it as 'subject'.
                - Generate the **email body separately** and return it in **HTML format**, labeled as 'htmlContent'.
                - The sender of the email is **Rahul Vishwakarma**, CEO of company **XYZ**.
                - Output JSON in the exact format:
                
                {
                  "subject": "<email subject line>",
                  "htmlContent": "<email body in HTML>"
                }
            `),
            new HumanMessage(`
                ${JSON.stringify(relevantData)}
            `)
        ];

        const llm = getLlm().withStructuredOutput(z.object({
            subject: z.string(),
            htmlContent: z.string(),
        }));
        const response = await llm.invoke(messages);

        return response;
    }
    catch (error) {
        console.error("Error generating email", error);
        throw error;
    }
}