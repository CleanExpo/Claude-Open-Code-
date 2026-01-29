import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

const BrandDNASchema = z.object({
    name: z.string().describe("The primary brand name"),
    tagline: z.string().describe("A powerful 3-5 word brand tagline"),
    voice: z.string().describe("Detailed description of the brand's voice and tone (Australian English)"),
    colors: z.array(z.string()).describe("Primary and secondary brand colors in hex"),
    traits: z.array(z.string()).describe("3-5 core brand personality traits"),
    targetAudienceSummary: z.string().describe("A concise summary of the primary target audience"),
});

export class BrandExtractor {
    private model: ChatGoogleGenerativeAI;

    constructor(apiKey: string) {
        this.model = new ChatGoogleGenerativeAI({
            apiKey: apiKey,
            model: "gemini-2.0-flash",
            temperature: 0.2,
        });
    }

    /**
     * Extracts Brand DNA from raw markdown content.
     */
    async extract(content: string): Promise<z.infer<typeof BrandDNASchema>> {
        const parser = StructuredOutputParser.fromZodSchema(BrandDNASchema as any);
        const formatInstructions = parser.getFormatInstructions();

        const prompt = new PromptTemplate({
            template: `
                You are "The Brand Architect", a specialist in deep brand analysis and extraction.
                Your task is to analyse the following raw website content and extract the "Brand DNA".

                Mandatory: Use Australian English spelling (e.g. colour, customise, optimise).

                Content:
                ---
                {content}
                ---

                {formatInstructions}
            `,
            inputVariables: ["content"],
            partialVariables: { formatInstructions },
        });

        const input = await prompt.format({ content: content.slice(0, 10000) });

        console.log("[BrandExtractor] Extracting Brand DNA...");

        try {
            const response = await this.model.invoke(input);
            let contentString = response.content as string;
            if (contentString.includes("```json")) {
                contentString = contentString.split("```json")[1].split("```")[0];
            }
            return await parser.parse(contentString) as any;
        } catch (error) {
            console.error("[BrandExtractor] Error extracting brand DNA:", error);
            throw error;
        }
    }
}
