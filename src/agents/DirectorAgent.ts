import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

/**
 * Persona Schema for marketing targeting.
 */
const PersonaSchema = z.object({
    name: z.string().describe("The name of the persona (e.g., The Tech-Savvy Developer)"),
    description: z.string().describe("Brief description of the persona's role and pain points"),
    goals: z.array(z.string()).describe("Top 3 goals for this persona"),
    valueProps: z.array(z.string()).length(3).describe("3 unique value propositions tailored to this persona"),
});

const AnalysisResultSchema = z.object({
    personas: z.array(PersonaSchema).length(3),
    brandVoice: z.string().describe("Recommended brand voice and tone for the Australian market"),
});

export class DirectorAgent {
    private model: ChatGoogleGenerativeAI;

    constructor(apiKey: string) {
        this.model = new ChatGoogleGenerativeAI({
            apiKey: apiKey,
            model: "gemini-2.0-flash",
            temperature: 0.5,
        });
    }

    /**
     * Analyses the provided content (URL scrape or README text) and identifies personas.
     */
    async analyseContent(content: string, source: "url" | "repo"): Promise<z.infer<typeof AnalysisResultSchema>> {
        const parser = StructuredOutputParser.fromZodSchema(AnalysisResultSchema as any);
        const formatInstructions = parser.getFormatInstructions();

        const prompt = new PromptTemplate({
            template: `
        You are "The Director", a world-class marketing architect specialising in the Australian market.
        Your task is to analyse the following {sourceType} content and define a strategic marketing campaign.
        
        Mandatory: Use Australian English spelling in all your responses (e.g., colour, personalise, optimisation).
        
        Analyse this content:
        ---
        {content}
        ---
        
        Output Requirements:
        1. Identify 3 distinct personas that would most likely purchase or use this product.
        2. For each persona, extract 3 unique value propositions.
        3. Define the brand voice for the Australian audience.
        
        {formatInstructions}
      `,
            inputVariables: ["content", "sourceType"],
            partialVariables: { formatInstructions },
        });

        const input = await prompt.format({
            content,
            sourceType: source === "url" ? "website landing page" : "GitHub repository README",
        });

        console.log("[Director] Analysing content and generating personas...");

        try {
            const response = await this.model.invoke(input);
            // Gemini might return markdown blocks, we need to extract JSON
            let contentString = response.content as string;
            if (contentString.includes("```json")) {
                contentString = contentString.split("```json")[1].split("```")[0];
            }
            return await parser.parse(contentString) as any;
        } catch (error) {
            console.error("[Director] Error during analysis:", error);
            throw error;
        }
    }

    /**
     * Autonomous Vision Discovery: Takes a simple idea/prompt and "dreams" up the target personas,
     * brand voice, and visual direction without needing a URL.
     */
    async creativeDream(prompt: string): Promise<z.infer<typeof AnalysisResultSchema>> {
        const parser = StructuredOutputParser.fromZodSchema(AnalysisResultSchema as any);
        const formatInstructions = parser.getFormatInstructions();

        const creativePrompt = new PromptTemplate({
            template: `
        You are "The Director". A user has provided a simple idea or creative brief:
        "{userIdea}"
        
        Your task is to autonomously "discover" the full marketing potential of this idea.
        1. Dream up the ideal target market and 3 distinct personas.
        2. Define a premium brand voice for the Australian market.
        3. Visualise the aesthetic (Deep Voids, Neon accents, 8K motion).
        
        Mandatory: Use Australian English spelling.
        {formatInstructions}
      `,
            inputVariables: ["userIdea"],
            partialVariables: { formatInstructions },
        });

        const input = await creativePrompt.format({ userIdea: prompt });

        console.log(`[Director] Autonomously dreaming for: ${prompt}...`);

        try {
            const response = await this.model.invoke(input);
            let contentString = response.content as string;
            if (contentString.includes("```json")) {
                contentString = contentString.split("```json")[1].split("```")[0];
            }
            return await parser.parse(contentString) as any;
        } catch (error) {
            console.error("[Director] Dreaming Error:", error);
            throw error;
        }
    }

    /**
     * Generates a script and storyboard for a specific persona.
     */
    async generateScriptAndStoryboard(persona: any, brandVoice: string): Promise<any> {
        const StoryboardSchema = z.object({
            scenes: z.array(z.object({
                type: z.enum(["Intro", "Problem", "Solution", "Demo", "Outro"]),
                script: z.string().describe("The spoken narration or on-screen text for this scene"),
                visualPrompt: z.string().describe("A prompt for Picasso to generate a background image"),
                motionInstruction: z.string().describe("An instruction for DiCaprio to animate the scene"),
                durationFrames: z.number().describe("Duration in frames (30fps)"),
            })),
            musicGenre: z.string().describe("Recommended background music genre"),
        });

        const parser = StructuredOutputParser.fromZodSchema(StoryboardSchema as any);
        const formatInstructions = parser.getFormatInstructions();

        const prompt = new PromptTemplate({
            template: `
        You are "The Director". Create a high-converting 30-60 second marketing video storyboard for this persona.
        
        Persona: {personaName}
        Description: {personaDescription}
        Brand Voice: {brandVoice}
        
        Mandatory: Use Australian English spelling.
        
        Scenes Structure:
        1. Intro: Hook the audience.
        2. Problem: Identify the pain point.
        3. Solution: Present the product.
        4. Demo: Show the product in action (use the provided screenshots).
        5. Outro: Strong Call to Action.
        
        {formatInstructions}
      `,
            inputVariables: ["personaName", "personaDescription", "brandVoice"],
            partialVariables: { formatInstructions },
        });

        const input = await prompt.format({
            personaName: persona.name,
            personaDescription: persona.description,
            brandVoice,
        });

        console.log(`[Director] Generating script for persona: ${persona.name}...`);

        try {
            const response = await this.model.invoke(input);
            let contentString = response.content as string;
            if (contentString.includes("```json")) {
                contentString = contentString.split("```json")[1].split("```")[0];
            }
            return await parser.parse(contentString) as any;
        } catch (error) {
            console.error("[Director] Error during script generation:", error);
            throw error;
        }
    }
}
