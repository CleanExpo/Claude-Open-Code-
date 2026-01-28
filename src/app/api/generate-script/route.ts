import { NextRequest, NextResponse } from "next/server";
import { DirectorAgent } from "../../../agents/DirectorAgent";

export async function POST(req: NextRequest) {
    try {
        const { persona, brandVoice } = await req.json();
        if (!persona || !brandVoice) {
            return NextResponse.json({ error: "Persona and Brand Voice are required" }, { status: 400 });
        }

        const director = new DirectorAgent(process.env.GEMINI_API_KEY || "");
        const storyboard = await director.generateScriptAndStoryboard(persona, brandVoice);

        return NextResponse.json(storyboard);
    } catch (error: any) {
        console.error("[API Script] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
