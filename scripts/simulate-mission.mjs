const IDEA = "Build a high-energy Facebook video campaign marketing AutoStream-Marketing to Australian small business owners.";
const BASE_URL = "http://localhost:3000";

async function runMission() {
    console.log("🚀 INITIATING AUTONOMOUS MISSION: 'GREEN LIGHT' MODE");
    console.log(`💡 IDEA: "${IDEA}"`);
    console.log("----------------------------------------------------------------");

    try {
        // STEP 1: ANALYSIS & DREAMING
        console.log("\n📡 STEP 1: ANALYSING TARGET URL & CAPTURING UI...");
        const targetUrl = "http://localhost:3000";
        const analyseRes = await fetch(`${BASE_URL}/api/analyse`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: targetUrl }),
        });

        if (!analyseRes.ok) throw new Error(`Analysis failed with status: ${analyseRes.status}`);
        const analysis = await analyseRes.json();

        console.log(`✅ ANALYSIS COMPLETE`);
        console.log(`👤 PERSONA DISCOVERED: ${analysis.personas[0].name}`);
        console.log(`📸 UI SCREENSHOT CAPTURED: ${analysis.screenshotPath}`);

        // STEP 2: SCRIPT & STORYBOARDING
        console.log("\n🎩 STEP 2: THE DIRECTOR IS COMPOSING THE STORYBOARD...");
        const bestPersona = analysis.personas[0];
        const scriptRes = await fetch(`${BASE_URL}/api/generate-script`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ persona: bestPersona, brandVoice: analysis.brandVoice }),
        });

        if (!scriptRes.ok) throw new Error(`Script generation failed with status: ${scriptRes.status}`);
        const storyboard = await scriptRes.json();

        console.log(`✅ STORYBOARD GENERATED (${storyboard.scenes.length} Scenes)`);

        // STEP 3: ASSET GENERATION
        console.log("\n🎨 STEP 3: PICASSO & DICAPRIO ARE SYNTHESISING ASSETS (WITH UI INJECTION)...");
        const assetsRes = await fetch(`${BASE_URL}/api/generate-assets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                scenes: storyboard.scenes,
                screenshotPath: analysis.screenshotPath
            }),
        });

        if (!assetsRes.ok) throw new Error(`Asset generation failed with status: ${assetsRes.status}`);
        const finalAssets = await assetsRes.json();

        console.log(`✅ ASSET ACQUISITION COMPLETE`);
        console.log(`🎬 TOTAL SCENES READY FOR RENDER: ${finalAssets.scenes.length}`);

        // STEP 4: LOCAL RENDERING
        console.log("\n🎥 STEP 4: TRIGGERING LOCAL RENDERING ENGINE...");
        const renderRes = await fetch(`${BASE_URL}/api/render`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inputProps: {
                    title: storyboard.scenes[0]?.script || "AutoStream Marketing",
                    scenes: finalAssets.scenes
                }
            }),
        });

        if (!renderRes.ok) throw new Error(`Rendering failed with status: ${renderRes.status}`);
        const renderData = await renderRes.json();

        console.log(`✅ RENDER COMPLETE!`);
        console.log(`📂 DOWNLOAD URL: ${BASE_URL}${renderData.url}`);

        console.log("\n----------------------------------------------------------------");
        console.log("🏆 MISSION SUCCESSFUL: THE VIDEO IS RENDERED AND READY");
        console.log(`🔗 VIEW NOW: ${BASE_URL}${renderData.url}`);
        console.log("----------------------------------------------------------------");

    } catch (err) {
        console.error(`\n❌ MISSION ABORTED: ${err.message}`);
    }
}

runMission();
