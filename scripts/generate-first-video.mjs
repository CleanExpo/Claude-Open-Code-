#!/usr/bin/env node
/**
 * Generate First Video - Direct FFmpeg Pipeline (Offline Mode)
 *
 * This script generates the first AutoStream Marketing video using ffmpeg
 * with synthetic visuals (no external network required).
 */

import { execSync } from "child_process";
import { writeFileSync, mkdirSync, existsSync, rmSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = join(process.cwd(), "public", "renders");
const TEMP_DIR = join(process.cwd(), ".temp-video");
const OUTPUT_FILE = join(OUTPUT_DIR, "first-video.mp4");

// Scene definitions with solid background colours
const scenes = [
    {
        type: "Intro",
        script: "STOP MANUAL CONTENT CREATION",
        durationSeconds: 2.5,
        bgColor: "0x0066FF"
    },
    {
        type: "Problem",
        script: "SCALING AD CONTENT IS SLOW AND COSTLY",
        durationSeconds: 2.5,
        bgColor: "0xCC00FF"
    },
    {
        type: "Solution",
        script: "INTRODUCING AUTOSTREAM ORCHESTRA",
        durationSeconds: 3,
        bgColor: "0x00CCFF"
    },
    {
        type: "Visual",
        script: "8K CINEMATIC ASSETS IN SECONDS",
        durationSeconds: 2.5,
        bgColor: "0xFF6600"
    },
    {
        type: "Outro",
        script: "VISUALISE YOUR VALUE PROP NOW",
        durationSeconds: 2.5,
        bgColor: "0x00FF66"
    }
];

async function main() {
    console.log("🎬 AUTOSTREAM FIRST VIDEO GENERATOR");
    console.log("====================================");
    console.log("   Offline Mode - Synthetic Visuals\n");

    // Create directories
    if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
    if (existsSync(TEMP_DIR)) rmSync(TEMP_DIR, { recursive: true, force: true });
    mkdirSync(TEMP_DIR, { recursive: true });

    console.log("🎨 Generating scenes with FFmpeg...\n");

    const scenePaths = [];

    for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const scenePath = join(TEMP_DIR, `scene_${i}.mp4`);

        // Build FFmpeg command - simple colour background with text
        const cmd = `ffmpeg -y -f lavfi -i "color=c=${scene.bgColor}:s=1280x720:d=${scene.durationSeconds}:r=30" -vf "drawtext=text='${scene.type.toUpperCase()} // v8.1':fontcolor=white:fontsize=24:x=40:y=40,drawtext=text='${scene.script}':fontcolor=white:fontsize=56:x=(w-text_w)/2:y=(h-text_h)/2:borderw=2:bordercolor=black,drawtext=text='AutoStream Marketing':fontcolor=white@0.6:fontsize=18:x=w-text_w-40:y=h-50" -c:v libx264 -pix_fmt yuv420p -preset fast "${scenePath}"`;

        console.log(`  [${i + 1}/${scenes.length}] ${scene.type}: Rendering...`);

        try {
            execSync(cmd, { stdio: "pipe" });
            scenePaths.push(scenePath);
            console.log(`  [${i + 1}/${scenes.length}] ${scene.type}: ✅ Complete (${scene.durationSeconds}s)`);
        } catch (error) {
            console.error(`  [${i + 1}/${scenes.length}] ${scene.type}: ❌ Failed`);
            console.error(`     ${error.stderr?.toString().slice(0, 200) || error.message}`);
        }
    }

    if (scenePaths.length === 0) {
        console.error("\n❌ No scenes were generated. Aborting.");
        process.exit(1);
    }

    console.log("\n🔗 Concatenating scenes...");

    // Create concat file
    const concatPath = join(TEMP_DIR, "concat.txt");
    const concatContent = scenePaths.map(p => `file '${p}'`).join("\n");
    writeFileSync(concatPath, concatContent);

    // Concatenate all scenes
    try {
        execSync(`ffmpeg -y -f concat -safe 0 -i "${concatPath}" -c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 -movflags +faststart "${OUTPUT_FILE}"`, { stdio: "pipe" });
        console.log("✅ Concatenation complete!");
    } catch (error) {
        console.error("❌ Concatenation failed:", error.message);
        process.exit(1);
    }

    // Cleanup temp files
    console.log("\n🧹 Cleaning up temporary files...");
    try {
        rmSync(TEMP_DIR, { recursive: true, force: true });
    } catch {}

    console.log("\n====================================");
    console.log("🎉 FIRST VIDEO GENERATED SUCCESSFULLY!");
    console.log(`📂 Output: ${OUTPUT_FILE}`);
    console.log("====================================\n");

    // Get video info
    try {
        const info = execSync(`ffprobe -v quiet -print_format json -show_format "${OUTPUT_FILE}"`, { encoding: "utf-8" });
        const parsed = JSON.parse(info);
        console.log(`📊 Video Details:`);
        console.log(`   Duration: ${parseFloat(parsed.format.duration).toFixed(2)}s`);
        console.log(`   Size: ${(parseInt(parsed.format.size) / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Format: ${parsed.format.format_name}`);
    } catch {}
}

main().catch(console.error);
