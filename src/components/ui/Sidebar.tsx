import React from "react";
import { motion } from "framer-motion";
import {
    Home,
    Video,
    Zap,
    Library,
    BarChart3,
    Settings,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: "mission", label: "Home", icon: Home },
        { id: "campaigns", label: "Video Projects", icon: Video, badge: true },
        { id: "automation", label: "Automation", icon: Zap },
        { id: "assets", label: "Library", icon: Library },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
    ];

    return (
        <aside className="w-[280px] h-screen sticky top-0 bg-[#050505] border-r border-white/5 flex flex-col z-50">
            <div className="p-8 pb-12">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#0088FF] to-[#00f2fe] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,136,255,0.3)]">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        AutoStream
                    </h1>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                            "group relative w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300",
                            activeTab === item.id
                                ? "bg-white/5 text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
                                : "text-gray-500 hover:text-white hover:bg-white/[0.02]"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <item.icon className={cn(
                                "w-5 h-5 transition-colors duration-300",
                                activeTab === item.id ? "text-[#0088FF]" : "group-hover:text-white"
                            )} />
                            <span className="text-[15px] font-medium">{item.label}</span>
                        </div>

                        {item.badge && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0088FF] shadow-[0_0_10px_#0088FF]" />
                        )}

                        {activeTab === item.id && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute left-0 w-1 h-6 bg-[#0088FF] rounded-r-full shadow-[2px_0_10px_rgba(0,136,255,0.5)]"
                            />
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-6 space-y-4">
                <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-white transition-colors text-[15px] font-medium">
                    <Settings className="w-5 h-5" />
                    Settings
                </button>

                <div className="glass-panel p-5 rounded-[22px] border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Engine Status</span>
                            <span className="text-xs text-white font-medium mt-0.5">V8.1 Refined</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse shadow-[0_0_10px_#00f2fe]" />
                    </div>

                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#0088FF] to-[#00f2fe]"
                        />
                    </div>

                    <p className="text-[9px] text-gray-600 font-mono tracking-tighter uppercase text-center">
                        NANOBANANA // GEMINI 3 PRO
                    </p>
                </div>
            </div>
        </aside>
    );
};
