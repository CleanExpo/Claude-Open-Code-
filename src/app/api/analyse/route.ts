import { NextRequest, NextResponse } from "next/server";
import { ScraperAgent } from "../../../agents/ScraperAgent";
import { DirectorAgent } from "../../../agents/DirectorAgent";

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const scraper = new ScraperAgent();
        const director = new DirectorAgent(process.env.GEMINI_API_KEY || "");

        let analysis;
        let screenshotPath = "";

        const isUrl = (url.startsWith("http://") || url.startsWith("https://")) ||
            (url.includes(".") && !url.includes(" ") && url.length < 255);

        if (isUrl) {
            let content = "";
            let targetUrl = url;
            if (!targetUrl.startsWith("http")) {
                targetUrl = `https://${targetUrl}`;
            }

            if (targetUrl.includes("github.com")) {
                content = await scraper.analyseRepo(targetUrl);
            } else {
                const result = await scraper.scrape(targetUrl);
                content = result.text;
                screenshotPath = result.screenshotPath;
            }
            analysis = await director.analyseContent(content, targetUrl.includes("github.com") ? "repo" : "url");
        } else {
            // Direct Creative Brief Mode
            analysis = await director.creativeDream(url);
        }

        return NextResponse.json({
            ...analysis,
            screenshotPath
        });
    } catch (error: any) {
        console.error("[API Analyse] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
