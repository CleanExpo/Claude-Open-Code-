"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Sparkles,
  ChevronRight,
  Monitor,
  Video,
  Layers,
} from "lucide-react";
import { Main } from "@/remotion/MyComp/Main";
import { Player } from "@remotion/player";
import {
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { PremiumFooter } from "@/components/ui/PremiumFooter";
import { Sidebar } from "@/components/ui/Sidebar";

export default function Home() {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState(1);
  const [personas, setPersonas] = useState<any[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<any>(null);
  const [brandVoice, setBrandVoice] = useState("");
  const [storyboard, setStoryboard] = useState<any>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingAssets, setIsGeneratingAssets] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [screenshotPath, setScreenshotPath] = useState<string>("");
  const [, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("mission");
  const [brandDNA, setBrandDNA] = useState<any>(null);

  const handleStartAnalysis = async () => {
    if (!url) return;
    setIsAnalysing(true);
    setError(null);
    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setPersonas(data.personas);
      setBrandVoice(data.brandVoice);
      setScreenshotPath(data.screenshotPath || "");
      setBrandDNA(data.brandDNA);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleSelectPersona = async (persona: any) => {
    setSelectedPersona(persona);
    setIsGeneratingScript(true);
    setStep(3);
    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, brandVoice }),
      });
      const data = await response.json();
      setStoryboard(data);
      handleGenerateAssets(data.scenes, screenshotPath);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateAssets = async (scenes: any[], sPath?: string) => {
    setIsGeneratingAssets(true);
    try {
      const response = await fetch("/api/generate-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenes, screenshotPath: sPath || screenshotPath }),
      });
      const data = await response.json();
      setStoryboard({ ...storyboard, scenes: data.scenes });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeneratingAssets(false);
    }
  };

  const handleAutonomousExecution = async () => {
    if (!url) return;
    setIsAnalysing(true);
    setError(null);
    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setPersonas(data.personas);
      setBrandVoice(data.brandVoice);
      setScreenshotPath(data.screenshotPath || "");
      setBrandDNA(data.brandDNA);
      const persona = data.personas[0];
      setSelectedPersona(persona);
      setStep(3);
      setIsGeneratingScript(true);
      const scriptRes = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, brandVoice: data.brandVoice }),
      });
      const scriptData = await scriptRes.json();
      setStoryboard(scriptData);
      setIsGeneratingScript(false);
      handleGenerateAssets(scriptData.scenes, data.screenshotPath);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalysing(false);
    }
  };

  const handleStartRender = async () => {
    if (!storyboard) return;
    setIsRendering(true);
    setError(null);
    setRenderProgress(10);

    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "MyComp",
          inputProps: {
            title: storyboard.scenes[0]?.script || "Marketing Campaign",
            scenes: storyboard.scenes
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Local rendering failed.");
      }

      const data = await response.json();
      setDownloadUrl(data.url);
      setRenderProgress(100);
      setIsRendering(false);
    } catch (err: any) {
      setError(err.message);
      setIsRendering(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "mission":
        return (
          <div className="max-w-6xl mx-auto px-8 py-12 space-y-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-10"
                >
                  <div className="space-y-4">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#0088FF] text-xs font-bold tracking-[0.2em] uppercase"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      G-Pilot Engine Active
                    </motion.div>
                    <h2 className="text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto">
                      Brief your idea or <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0088FF] to-[#00f2fe]">paste a URL...</span>
                    </h2>
                  </div>

                  <div className="w-full max-w-3xl relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#0088FF] to-[#00f2fe] rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <GlassCard className="p-1 min-h-[80px] flex items-center bg-black/40 backdrop-blur-3xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                      <input
                        type="text"
                        placeholder="Describe your marketing mission..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1 bg-transparent px-8 py-4 outline-none text-xl font-medium placeholder:text-gray-600"
                      />
                      <div className="flex gap-2 p-2">
                        <NeonButton
                          onClick={handleAutonomousExecution}
                          loading={isAnalysing}
                          className="bg-[#0088FF] text-white px-8 rounded-2xl h-14 text-sm font-bold shadow-[0_0_20px_rgba(0,136,255,0.4)] hover:shadow-[0_0_30px_rgba(0,136,255,0.6)] transition-all"
                        >
                          Green Light
                        </NeonButton>
                        <button
                          onClick={handleStartAnalysis}
                          className="px-8 h-14 rounded-2xl border border-white/10 hover:bg-white/5 text-sm font-bold transition-all"
                        >
                          Analyse
                        </button>
                      </div>
                    </GlassCard>
                  </div>

                  <div className="grid grid-cols-3 gap-16 pt-12">
                    {[
                      { label: "Product Launch", icon: Video },
                      { label: "Daily News", icon: Monitor },
                      { label: "Social Clips", icon: Layers }
                    ].map((p, i) => (
                      <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#0088FF]/10 group-hover:border-[#0088FF]/40 transition-all duration-500">
                          <p.icon className="w-6 h-6 text-gray-400 group-hover:text-[#0088FF]" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 group-hover:text-white transition-colors">{p.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <header className="flex justify-between items-end">
                    <div className="space-y-2">
                      <span className="text-[#0088FF] font-bold text-xs tracking-widest uppercase">Phase 01: Strategy</span>
                      <h2 className="text-4xl font-bold">Market Intelligence</h2>
                    </div>
                    <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white text-sm font-medium flex items-center gap-2">
                      Reset Mission <ChevronRight className="w-4 h-4" />
                    </button>
                  </header>

                  {brandDNA && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="grid grid-cols-1 md:grid-cols-4 gap-6"
                    >
                      <GlassCard hoverable={false} className="md:col-span-1 p-6 border-[#00f2fe]/20">
                        <div className="flex flex-col h-full justify-between">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-[#00f2fe] uppercase tracking-widest">Brand DNA</span>
                            <h3 className="text-2xl font-bold">{brandDNA.name}</h3>
                            <p className="text-xs text-gray-400 italic">"{brandDNA.tagline}"</p>
                          </div>
                          <div className="flex gap-2 mt-4">
                            {brandDNA.colors?.map((c: string, idx: number) => (
                              <div key={idx} className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: c }} title={c} />
                            ))}
                          </div>
                        </div>
                      </GlassCard>
                      <GlassCard hoverable={false} className="md:col-span-3 p-6 bg-gradient-to-br from-white/[0.02] to-transparent">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Voice & Tone</h4>
                            <p className="text-[13px] leading-relaxed text-gray-300">{brandDNA.voice}</p>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Core Traits</h4>
                            <div className="flex flex-wrap gap-2">
                              {brandDNA.traits?.map((t: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-gray-400">
                                  {t}
                                </span>
                              ))}
                            </div>
                            <div className="pt-4 space-y-2">
                              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Primary Audience</h4>
                              <p className="text-[13px] text-gray-400">{brandDNA.targetAudienceSummary}</p>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )}

                  <div className="pt-8 space-y-6">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Strategic Persona Selection</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {personas.map((p, i) => (
                        <GlassCard
                          key={i}
                          className="p-8 group hover:border-[#0088FF]/30"
                          onClick={() => handleSelectPersona(p)}
                        >
                          <div className="w-12 h-12 rounded-xl bg-[#0088FF]/10 border border-[#0088FF]/20 flex items-center justify-center mb-6">
                            <Sparkles className="w-6 h-6 text-[#0088FF]" />
                          </div>
                          <h3 className="text-xl font-bold mb-3">{p.name}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed mb-8">{p.description}</p>
                          <div className="space-y-3">
                            {p.valueProps.map((v: string, j: number) => (
                              <div key={j} className="flex items-center gap-3 text-[11px] text-gray-400 uppercase tracking-widest font-bold">
                                <div className="w-1 h-1 rounded-full bg-[#0088FF]" />
                                {v}
                              </div>
                            ))}
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <header className="flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-[#00f2fe] font-bold text-xs tracking-widest uppercase">Phase 02: Synthesis</span>
                      <h2 className="text-4xl font-bold">{selectedPersona?.name}</h2>
                    </div>
                    <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-xs font-bold transition-all">
                      Back to Personas
                    </button>
                  </header>

                  <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#0088FF] to-[#00f2fe] rounded-[33px] blur opacity-10"></div>
                      <GlassCard hoverable={false} className="aspect-video bg-black/60 p-1">
                        <div className="w-full h-full rounded-[22px] overflow-hidden relative">
                          {isGeneratingAssets || isGeneratingScript ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                              <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-2 border-[#0088FF]/20 rounded-full" />
                                <div className="absolute inset-0 border-t-2 border-[#0088FF] rounded-full animate-spin" />
                              </div>
                              <p className="text-gray-500 font-mono text-[10px] tracking-[0.3em] uppercase">Synthesising v8.1 assets...</p>
                            </div>
                          ) : (
                            <Player
                              component={Main}
                              inputProps={{
                                title: storyboard?.scenes[0]?.script || "Marketing Campaign",
                                scenes: storyboard?.scenes
                              }}
                              durationInFrames={storyboard?.scenes?.reduce((acc: number, s: any) => acc + (s.durationFrames || 90), 0) || DURATION_IN_FRAMES}
                              fps={VIDEO_FPS}
                              compositionHeight={VIDEO_HEIGHT}
                              compositionWidth={VIDEO_WIDTH}
                              style={{ width: "100%", height: "100%" }}
                              controls
                              autoPlay
                              loop
                            />
                          )}
                        </div>
                      </GlassCard>
                    </div>

                    <div className="space-y-6">
                      <GlassCard className="p-6 h-full flex flex-col justify-between border-white/5">
                        <div className="space-y-6">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Mastering Controls</h4>
                            <p className="text-xs text-gray-600">Configuration for Australian Master export.</p>
                          </div>

                          <div className="space-y-4">
                            {isRendering ? (
                              <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                  <span>Rendering locally...</span>
                                  <span>{Math.round(renderProgress)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-[#0088FF] to-[#00f2fe]"
                                    animate={{ width: `${renderProgress}%` }}
                                  />
                                </div>
                              </div>
                            ) : downloadUrl ? (
                              <div className="space-y-3">
                                <NeonButton onClick={() => window.open(downloadUrl, "_blank")} className="w-full bg-[#0088FF] text-white">
                                  <ExternalLink className="w-4 h-4" /> Download MP4
                                </NeonButton>
                                <button onClick={() => setDownloadUrl(null)} className="w-full py-3 rounded-2xl border border-white/5 hover:bg-white/5 transition-all text-sm font-bold">
                                  Render New Version
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <NeonButton onClick={handleStartRender} className="w-full bg-white text-black">
                                  Export 8K MP4
                                </NeonButton>
                                <button onClick={() => handleGenerateAssets(storyboard?.scenes, screenshotPath)} className="w-full py-3 rounded-2xl border border-white/5 hover:bg-white/5 transition-all text-sm font-bold">
                                  Regenerate Visuals
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 text-center">
                          <p className="text-[10px] text-gray-700 font-mono tracking-tighter uppercase">
                            G-Pilot Local Render Engine // V8.1
                          </p>
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case "campaigns":
        return <div className="p-20 text-center text-gray-500 font-bold uppercase tracking-widest font-mono">Archive Access Restricted</div>;

      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen bg-[#000000] text-white selection:bg-[#0088FF]/30">
      <div className="nebula-glow top-[-10%] left-[-5%] bg-[#0088FF]" />
      <div className="nebula-glow bottom-[-10%] right-[-5%] bg-[#9900FF]" />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 relative z-10 overflow-y-auto">
        <header className="sticky top-0 px-8 py-6 flex justify-end items-center bg-black/20 backdrop-blur-md border-b border-white/5 z-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Safe Mode</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0088FF] to-[#00f2fe] flex items-center justify-center text-[10px] font-bold">
                MY
              </div>
            </div>
          </div>
        </header>

        {renderContent()}

        <PremiumFooter />
      </div>
    </main>
  );
}
