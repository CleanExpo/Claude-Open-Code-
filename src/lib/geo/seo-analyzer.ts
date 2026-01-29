import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

const LocalSEOAnalysisSchema = z.object({
    napConsistency: z.object({
        score: z.number().min(0).max(100),
        status: z.string(),
        issues: z.array(z.string()),
    }),
    localSchema: z.object({
        exists: z.boolean(),
        type: z.string().optional(),
        recommendations: z.array(z.string()),
    }),
    rankingOpportunities: z.array(z.object({
        keyword: z.string(),
        difficulty: z.enum(["Low", "Medium", "High"]),
        potential: z.string(),
    })),
    geographicalFocus: z.array(z.string()).describe("List of target Australian locations identified (suburbs, cities)"),
});

export class LocalSEOAnalyzer {
    private model: ChatGoogleGenerativeAI;

    constructor(apiKey: string) {
        this.model = new ChatGoogleGenerativeAI({
            apiKey: apiKey,
            model: "gemini-2.0-flash",
            temperature: 0.3,
        });
    }

    async analyse(content: string, url: string): Promise<z.infer<typeof LocalSEOAnalysisSchema>> {
        const parser = StructuredOutputParser.fromZodSchema(LocalSEOAnalysisSchema as any);
        const formatInstructions = parser.getFormatInstructions();

        const prompt = new PromptTemplate({
            template: `
                You are "The GEO Strategist", an expert in Australian local SEO and geographical targeting.
                Analyse the website content and URL to assess its local search performance.
                
                Focus specifically on the Australian market context.
                
                Content:
                ---
                {content}
                ---
                URL: {url}

                {formatInstructions}
            `,
            inputVariables: ["content", "url"],
            partialVariables: { formatInstructions },
        });

        const input = await prompt.format({ content: content.slice(0, 8000), url });

        try {
            const response = await this.model.invoke(input);
            let contentString = response.content as string;
            if (contentString.includes("```json")) {
                contentString = contentString.split("```json")[1].split("```")[0];
            }
            return await parser.parse(contentString) as any;
        } catch (error) {
            console.error("[LocalSEOAnalyzer] Analysis Error:", error);
            throw error;
        }
    }
}
