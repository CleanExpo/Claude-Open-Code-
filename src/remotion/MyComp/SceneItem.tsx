import React from "react";
import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    Video,
    Img,
    spring
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadOutfit, fontFamily as outfitFamily } from "@remotion/google-fonts/Outfit";

loadFont("normal", { subsets: ["latin"], weights: ["700"] });
loadOutfit("normal", { subsets: ["latin"], weights: ["800"] });

interface SceneItemProps {
    script: string;
    assetUrl?: string;
    type: string;
}

export const SceneItem: React.FC<SceneItemProps> = ({ script, assetUrl, type }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const [videoError, setVideoError] = React.useState(false);

    // Subtle zoom effect for static images
    const zoom = interpolate(frame, [0, 150], [1, 1.15], {
        extrapolateRight: "clamp",
    });

    // ... (animations logic remains same)
    const opacity = spring({
        frame,
        fps,
        config: { damping: 20 },
        durationInFrames: 30,
    });

    const translateY = interpolate(opacity, [0, 1], [40, 0]);

    const isVideo = assetUrl?.endsWith(".mp4") || assetUrl?.includes("video") || assetUrl?.includes("fal-ai");

    return (
        <AbsoluteFill className="bg-[#050505] overflow-hidden">
            {/* 1. Deep Void Background Layer */}
            <AbsoluteFill className="opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a2e_0%,_#050505_100%)] opacity-50" />
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </AbsoluteFill>

            {/* 2. Visual Asset Layer with Dynamic Zoom & Depth */}
            <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
                {assetUrl ? (
                    (isVideo && !videoError) ? (
                        <Video
                            src={assetUrl}
                            className="w-full h-full object-cover"
                            onError={() => setVideoError(true)}
                        />
                    ) : (
                        <Img src={assetUrl} className="w-full h-full object-cover" />
                    )
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                        <div className="text-white/10 font-bold text-9xl rotate-12 select-none uppercase">{type}</div>
                    </div>
                )}
            </AbsoluteFill>

            {/* 3. Cinematic Overlays & Scanning Light */}
            <AbsoluteFill className="bg-gradient-to-t from-black via-transparent to-black/30" />

            {/* Scanning Light Strip */}
            <div
                className="absolute inset-0 w-full h-32 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent pointer-events-none"
                style={{
                    top: `${interpolate(frame, [0, 150], [-200, 1000])}px`,
                    transform: 'skewY(-5deg)',
                    filter: 'blur(40px)'
                }}
            />

            {/* 4. Aesthetic Accents (v8.1 style) */}
            <div className="absolute top-10 left-10 flex items-center gap-3 z-20">
                <div className="w-8 h-8 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-lg blur-sm opacity-50 animate-pulse" />
                    <div className="relative w-6 h-6 bg-gradient-to-tr from-blue-400 to-purple-600 rounded-md shadow-lg border border-white/20" />
                </div>
                <div className="flex flex-col">
                    <span className="text-white/80 font-bold text-sm tracking-tight leading-none uppercase outfit">AutoStream</span>
                    <span className="text-blue-400 font-mono text-[9px] tracking-[0.3em] uppercase opacity-70 mt-1">Refined v8.1 // {type}</span>
                </div>
            </div>

            {/* 5. Glassmorphism Text Overlay */}
            <AbsoluteFill className="justify-center items-center p-20 z-10">
                <div
                    style={{
                        opacity,
                        transform: `translateY(${translateY}px)`,
                        fontFamily: outfitFamily
                    }}
                    className="relative"
                >
                    {/* Background Soft Glow */}
                    <div className="absolute inset-[-60px] bg-blue-600/20 blur-[100px] rounded-full opacity-40" />

                    <div className="relative glass-morphism px-16 py-14 rounded-[40px] border border-white/10 backdrop-blur-2xl shadow-[0_32px_128px_rgba(0,0,0,0.8)] max-w-5xl">
                        <h2 className="text-7xl font-extrabold text-white leading-tight tracking[-0.02em] text-center drop-shadow-2xl">
                            {script}
                        </h2>

                        {/* Animated Gradient Underline */}
                        <div className="relative h-2 w-32 mx-auto mt-10 rounded-full overflow-hidden bg-white/5">
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
                                style={{
                                    width: '200%',
                                    transform: `translateX(${interpolate(frame, [0, 150], [-50, 0])}%)`
                                }}
                            />
                        </div>
                    </div>
                </div>
            </AbsoluteFill>

            {/* 6. Corner Branding & Metadata */}
            <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2 z-20">
                <div className="h-[1px] w-12 bg-gradient-to-l from-white/30 to-transparent mb-1" />
                <span className="text-white/30 font-mono text-[10px] tracking-[0.4em] uppercase">8K Master Synthesis</span>
                <span className="text-white/10 font-mono text-[8px] tracking-[0.2em] uppercase">Produced in VIC, Australia // Engine Core v16.2</span>
            </div>

            {/* 7. Film Grain & Overlay Texture */}
            <AbsoluteFill className="pointer-events-none opacity-[0.03]" style={{ mixBlendMode: 'overlay' }}>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
