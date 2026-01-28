import puppeteer from "puppeteer";

export class ScraperAgent {
    /**
     * Scrapes a URL for text content and takes a screenshot.
     */
    async scrape(url: string, screenshotDir: string = "public/screenshots"): Promise<{ text: string; screenshotPath: string }> {
        // Validate URL before navigation
        try {
            new URL(url);
        } catch (e) {
            throw new Error(`Invalid URL provided to scraper: ${url}`);
        }

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 720 });

            // Ensure screenshot directory exists
            const fs = require('fs');
            if (!fs.existsSync(screenshotDir)) {
                fs.mkdirSync(screenshotDir, { recursive: true });
            }

            // Go to the URL with a timeout
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

            // Extract main text content
            const text = await page.evaluate(() => {
                // Remove scripts, styles, and navs for cleaner analysis
                const elementsToRemove = document.querySelectorAll('script, style, nav, footer, iframe');
                elementsToRemove.forEach(el => el.remove());
                return document.body.innerText;
            });

            // Take a high-quality screenshot for the "Demo" scenes
            const filename = `landing-${Date.now()}.png`;
            const path = `${screenshotDir}/${filename}`;

            // Ensure directory exists (handled by write_to_file usually, but puppeteer needs it)
            // For now, assume it exists or use public/screenshots
            await page.screenshot({ path });

            await browser.close();

            return {
                text: text.slice(0, 5000), // Limit text for LLM context
                screenshotPath: `/screenshots/${filename}`
            };
        } catch (error) {
            await browser.close();
            console.error(`[Scraper] Error scraping ${url}:`, error);
            throw error;
        }
    }

    /**
     * Analyses a GitHub repository by fetching README content.
     */
    async analyseRepo(repoUrl: string): Promise<string> {
        console.log(`[Scraper] Analysing Repository: ${repoUrl}`);

        // Convert github.com/owner/repo to raw.githubusercontent.com/owner/repo/main/README.md
        const rawUrl = repoUrl
            .replace("github.com", "raw.githubusercontent.com")
            .concat("/main/README.md");

        try {
            const response = await fetch(rawUrl);
            if (!response.ok) {
                // Try 'master' branch if 'main' fails
                const masterUrl = rawUrl.replace("/main/", "/master/");
                const masterResponse = await fetch(masterUrl);
                if (!masterResponse.ok) throw new Error("Could not fetch README.md from main or master branch.");
                return await masterResponse.text();
            }
            return await response.text();
        } catch (error) {
            console.error(`[Scraper] Error fetching repo README:`, error);
            return "Error: Could not retrieve repository README.";
        }
    }
}
