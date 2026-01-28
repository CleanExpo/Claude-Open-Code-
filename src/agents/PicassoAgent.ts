import { fal } from "@fal-ai/client";

export class PicassoAgent {
    /**
     * Generates a static asset (thumbnail or B-roll) using Fal.AI (Flux).
     */
    async generateVisual(prompt: string): Promise<string> {
        console.log(`[Picasso] Generating visual for prompt: "${prompt}"`);

        const v81Prompt = `v8.1 refined standard, 8k resolution, cinematic commercial photography, ${prompt}, highly detailed, premium aesthetic, glassmorphism accents, soft professional lighting, vibrant colors.`;

        try {
            const result: any = await fal.subscribe("fal-ai/flux/schnell", {
                input: {
                    prompt: v81Prompt,
                    image_size: "landscape_16_9",
                    num_inference_steps: 4,
                },
            });

            return result.images[0].url;
        } catch (error) {
            console.error("[Picasso] Error generating visual:", error);
            return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1280&h=720";
        }
    }
}
