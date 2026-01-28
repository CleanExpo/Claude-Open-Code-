import { NextRequest, NextResponse } from "next/server";
import { PicassoAgent } from "../../../agents/PicassoAgent";
import { DiCaprioAgent } from "../../../agents/DiCaprioAgent";

export async function POST(req: NextRequest) {
    try {
        const { scenes, screenshotPath } = await req.json();
        if (!scenes || !Array.isArray(scenes)) {
            return NextResponse.json({ error: "Scenes array is required" }, { status: 400 });
        }

        const picasso = new PicassoAgent();
        const dicaprio = new DiCaprioAgent();

        const assets = await Promise.all(scenes.map(async (scene: any) => {
            // 1. Determine the base visual asset
            let imageUrl: string;

            // If it's a Demo scene and we have a screenshot, use it!
            if (scene.type === "Demo" && screenshotPath) {
                console.log(`[API Assets] Using screenshot for Demo scene: ${screenshotPath}`);
                imageUrl = screenshotPath;
            } else {
                imageUrl = await picasso.generateVisual(scene.visualPrompt);
            }

            // 2. Animate it if it's not a simple demo scene (which might use screenshots)
            // For now, we only animate Intro/Solution if we have a FAL_KEY
            let finalAssetUrl = imageUrl;
            const hasFalKey = !!process.env.FAL_KEY;

            if (hasFalKey && (scene.type === "Solution" || scene.type === "Intro")) {
                try {
                    finalAssetUrl = await dicaprio.generateMotion(imageUrl, scene.motionInstruction);
                } catch (e) {
                    console.error("[API Assets] Motion generation failed, falling back to static image.");
                }
            }

            return {
                ...scene,
                assetUrl: finalAssetUrl,
            };
        }));

        return NextResponse.json({ scenes: assets });
    } catch (error: any) {
        console.error("[API Assets] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
