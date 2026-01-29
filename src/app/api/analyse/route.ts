import { NextRequest, NextResponse } from "next/server";
import { ScraperAgent } from "../../../agents/ScraperAgent";
import { DirectorAgent } from "../../../agents/DirectorAgent";
import { BrandExtractor } from "../../../lib/brand/extractor";

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const scraper = new ScraperAgent();
        const director = new DirectorAgent(process.env.GEMINI_API_KEY || "");
        const extractor = new BrandExtractor(process.env.GEMINI_API_KEY || "");

        let analysis;
        let screenshotPath = "";
        let brandDNA;

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
                // Phase 01: Multi-source extraction
                console.log("[API] Starting Multi-Source Extraction...");
                const [jinaText, puppetResult] = await Promise.all([
                    scraper.jinaRead(targetUrl),
                    scraper.scrape(targetUrl)
                ]);

                content = jinaText || puppetResult.text;
                screenshotPath = puppetResult.screenshotPath;
            }

            // Phase 02: Brand DNA Extraction (UNI-203)
            brandDNA = await extractor.extract(content);
            console.log("[API] Brand DNA Extracted:", brandDNA.name);

            // Phase 03: Strategic Analysis
            analysis = await director.analyseContent(content, targetUrl.includes("github.com") ? "repo" : "url");

            // Override brand voice with extracted DNA if available
            if (brandDNA) {
                analysis.brandVoice = brandDNA.voice;
            }
        } else {
            // Direct Creative Brief Mode
            analysis = await director.creativeDream(url);
        }

        return NextResponse.json({
            ...analysis,
            brandDNA: brandDNA || null,
            screenshotPath
        });
    } catch (error: any) {
        console.error("[API Analyse] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
