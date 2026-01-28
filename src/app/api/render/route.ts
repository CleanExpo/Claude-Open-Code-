import { NextRequest, NextResponse } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import { COMP_NAME } from "../../../../types/constants";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { inputProps } = body;

        console.log("[Local Render] Starting bundle...");

        // 1. Bundle the video components
        const bundleLocation = await bundle({
            entryPoint: path.join(process.cwd(), "src", "remotion", "index.ts"),
        });

        console.log("[Local Render] Selecting composition...");

        // 2. Select the composition (MyComp)
        const composition = await selectComposition({
            serveUrl: bundleLocation,
            id: COMP_NAME,
            inputProps,
        });

        // 3. Define output path
        const outputDir = path.join(process.cwd(), "public", "renders");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const renderId = `render-${Date.now()}.mp4`;
        const outputPath = path.join(outputDir, renderId);

        console.log("[Local Render] Rendering to:", outputPath);

        // 4. Render the media locally using the server's CPU
        await renderMedia({
            composition,
            serveUrl: bundleLocation,
            codec: "h264",
            outputLocation: outputPath,
            inputProps,
        });

        console.log("[Local Render] Render complete!");

        // Return the URL for the local file
        return NextResponse.json({
            type: "success",
            url: `/renders/${renderId}`,
        });
    } catch (error: any) {
        console.error("[Local Render] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
