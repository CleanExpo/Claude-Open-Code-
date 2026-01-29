export class JinaClient {
    private baseUrl = "https://r.jina.ai/";

    /**
     * Reads a URL using Jina Reader to get clean markdown content.
     */
    async readUrl(url: string): Promise<string> {
        console.log(`[Jina] Reading URL: ${url}`);
        try {
            const response = await fetch(`${this.baseUrl}${url}`, {
                headers: {
                    "Accept": "text/event-stream",
                    // Add API key here if needed in future: "Authorization": `Bearer ${process.env.JINA_API_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error(`Jina Reader failed: ${response.statusText}`);
            }

            const text = await response.text();
            return text;
        } catch (error) {
            console.error("[Jina] Error reading URL:", error);
            throw error;
        }
    }
}
