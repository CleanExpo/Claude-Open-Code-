#!/usr/bin/env node
/**
 * 🎬 AutoStream Project Video Generator
 *
 * The simplest way to create intro/describer videos for your projects.
 *
 * USAGE:
 *   node scripts/create-project-video.mjs <config-file>
 *   node scripts/create-project-video.mjs --interactive
 *
 * EXAMPLES:
 *   node scripts/create-project-video.mjs projects/my-app.json
 *   node scripts/create-project-video.mjs --interactive
 */

import { execSync } from "child_process";
import { writeFileSync, readFileSync, mkdirSync, existsSync, rmSync } from "fs";
import { join, basename } from "path";
import readline from "readline";

const OUTPUT_DIR = join(process.cwd(), "public", "renders");
const TEMP_DIR = join(process.cwd(), ".temp-video");
const PROJECTS_DIR = join(process.cwd(), "projects");

// Colour palette for different project types
const COLOUR_PALETTES = {
    tech: { primary: "0x0066FF", secondary: "0x00CCFF", accent: "0xCC00FF" },
    saas: { primary: "0x6366F1", secondary: "0x8B5CF6", accent: "0xEC4899" },
    creative: { primary: "0xFF6600", secondary: "0xFFCC00", accent: "0xFF0066" },
    health: { primary: "0x10B981", secondary: "0x06B6D4", accent: "0x3B82F6" },
    finance: { primary: "0x1E3A5F", secondary: "0x0EA5E9", accent: "0x22C55E" },
    education: { primary: "0x7C3AED", secondary: "0x2563EB", accent: "0xF59E0B" },
    dark: { primary: "0x1a1a2e", secondary: "0x16213e", accent: "0x0f3460" },
    default: { primary: "0x0066FF", secondary: "0xCC00FF", accent: "0x00FF66" }
};

/**
 * Generate a 5-scene intro video from project config
 */
function generateScenes(config) {
    const palette = COLOUR_PALETTES[config.palette] || COLOUR_PALETTES.default;

    return [
        {
            type: "Intro",
            text: config.name.toUpperCase(),
            subtext: config.tagline || "",
            duration: 3,
            bgColor: palette.primary
        },
        {
            type: "Problem",
            text: config.problem || "THE OLD WAY IS BROKEN",
            subtext: config.problemDetail || "",
            duration: 2.5,
            bgColor: palette.secondary
        },
        {
            type: "Solution",
            text: config.solution || `INTRODUCING ${config.name.toUpperCase()}`,
            subtext: config.solutionDetail || "",
            duration: 3,
            bgColor: palette.accent
        },
        {
            type: "Features",
            text: config.features?.[0] || "POWERFUL FEATURES",
            subtext: config.features?.slice(1, 3).join(" • ") || "",
            duration: 2.5,
            bgColor: palette.primary
        },
        {
            type: "CTA",
            text: config.cta || "GET STARTED TODAY",
            subtext: config.website || config.name,
            duration: 2.5,
            bgColor: palette.secondary
        }
    ];
}

/**
 * Render video using FFmpeg
 */
async function renderVideo(config, outputName) {
    const scenes = generateScenes(config);
    const outputFile = join(OUTPUT_DIR, `${outputName}.mp4`);

    console.log(`\n🎬 Generating video for: ${config.name}`);
    console.log(`   Palette: ${config.palette || 'default'}`);
    console.log(`   Scenes: ${scenes.length}`);
    console.log("");

    // Setup directories
    if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
    if (existsSync(TEMP_DIR)) rmSync(TEMP_DIR, { recursive: true, force: true });
    mkdirSync(TEMP_DIR, { recursive: true });

    const scenePaths = [];

    for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const scenePath = join(TEMP_DIR, `scene_${i}.mp4`);

        // Build text - handle multiline if text is too long
        const mainText = scene.text.length > 30
            ? scene.text.replace(/(.{25,}?)\s/g, "$1\\n").trim()
            : scene.text;

        // FFmpeg filter for this scene
        const filters = [
            `drawtext=text='${scene.type.toUpperCase()}':fontcolor=white@0.5:fontsize=20:x=40:y=40`,
            `drawtext=text='${mainText}':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=(h-text_h)/2-30:borderw=2:bordercolor=black`,
        ];

        if (scene.subtext) {
            filters.push(`drawtext=text='${scene.subtext}':fontcolor=white@0.8:fontsize=28:x=(w-text_w)/2:y=(h/2)+60`);
        }

        filters.push(`drawtext=text='${config.name}':fontcolor=white@0.4:fontsize=16:x=w-text_w-40:y=h-40`);

        const cmd = `ffmpeg -y -f lavfi -i "color=c=${scene.bgColor}:s=1280x720:d=${scene.duration}:r=30" -vf "${filters.join(",")}" -c:v libx264 -pix_fmt yuv420p -preset fast "${scenePath}"`;

        process.stdout.write(`   [${i + 1}/${scenes.length}] ${scene.type}...`);

        try {
            execSync(cmd, { stdio: "pipe" });
            scenePaths.push(scenePath);
            console.log(" ✅");
        } catch (error) {
            console.log(" ❌");
        }
    }

    // Concatenate scenes
    console.log("\n   Concatenating scenes...");
    const concatPath = join(TEMP_DIR, "concat.txt");
    writeFileSync(concatPath, scenePaths.map(p => `file '${p}'`).join("\n"));

    execSync(`ffmpeg -y -f concat -safe 0 -i "${concatPath}" -c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 -movflags +faststart "${outputFile}"`, { stdio: "pipe" });

    // Cleanup
    rmSync(TEMP_DIR, { recursive: true, force: true });

    // Get video info
    const info = JSON.parse(execSync(`ffprobe -v quiet -print_format json -show_format "${outputFile}"`, { encoding: "utf-8" }));

    console.log("\n   ════════════════════════════════════════");
    console.log(`   ✅ Video generated successfully!`);
    console.log(`   📂 ${outputFile}`);
    console.log(`   ⏱️  ${parseFloat(info.format.duration).toFixed(1)}s | ${(parseInt(info.format.size) / 1024).toFixed(0)} KB`);
    console.log("   ════════════════════════════════════════\n");

    return outputFile;
}

/**
 * Interactive mode - prompt user for project details
 */
async function interactiveMode() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (q) => new Promise(resolve => rl.question(q, resolve));

    console.log("\n🎬 AutoStream Project Video Generator");
    console.log("═══════════════════════════════════════\n");

    const config = {};

    config.name = await question("Project name: ");
    config.tagline = await question("Tagline (optional): ");
    config.problem = await question("Problem it solves: ");
    config.solution = await question("Your solution (or press Enter): ") || `Introducing ${config.name}`;
    config.cta = await question("Call to action (or press Enter): ") || "Get Started Today";

    console.log("\nAvailable palettes: tech, saas, creative, health, finance, education, dark");
    config.palette = await question("Colour palette (or press Enter for default): ") || "default";

    rl.close();

    const safeName = config.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

    // Save config for reuse
    if (!existsSync(PROJECTS_DIR)) mkdirSync(PROJECTS_DIR, { recursive: true });
    const configPath = join(PROJECTS_DIR, `${safeName}.json`);
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`\n💾 Config saved to: ${configPath}`);

    await renderVideo(config, safeName);
}

/**
 * Main entry point
 */
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
        console.log(`
🎬 AutoStream Project Video Generator
═════════════════════════════════════

USAGE:
  node scripts/create-project-video.mjs <config.json>
  node scripts/create-project-video.mjs --interactive
  node scripts/create-project-video.mjs --batch <directory>

CONFIG FILE FORMAT (JSON):
{
  "name": "My Project",
  "tagline": "The future of X",
  "problem": "Current solutions are slow",
  "solution": "We make it 10x faster",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "cta": "Try it free",
  "website": "myproject.com",
  "palette": "tech"
}

PALETTES: tech, saas, creative, health, finance, education, dark

EXAMPLES:
  node scripts/create-project-video.mjs projects/claude-code.json
  node scripts/create-project-video.mjs --interactive
  node scripts/create-project-video.mjs --batch projects/
`);
        return;
    }

    if (args[0] === "--interactive" || args[0] === "-i") {
        await interactiveMode();
        return;
    }

    if (args[0] === "--batch" || args[0] === "-b") {
        const dir = args[1] || PROJECTS_DIR;
        const { readdirSync } = await import("fs");
        const files = readdirSync(dir).filter(f => f.endsWith(".json"));

        console.log(`\n🎬 Batch processing ${files.length} projects from ${dir}\n`);

        for (const file of files) {
            const configPath = join(dir, file);
            const config = JSON.parse(readFileSync(configPath, "utf-8"));
            const outputName = basename(file, ".json");
            await renderVideo(config, outputName);
        }
        return;
    }

    // Single config file mode
    const configPath = args[0];
    if (!existsSync(configPath)) {
        console.error(`❌ Config file not found: ${configPath}`);
        process.exit(1);
    }

    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    const outputName = basename(configPath, ".json");
    await renderVideo(config, outputName);
}

main().catch(console.error);
