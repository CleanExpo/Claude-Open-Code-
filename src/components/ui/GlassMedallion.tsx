import React from "react";
import { cn } from "@/lib/utils";

interface GlassMedallionProps {
    icon: React.ReactNode;
    size?: "sm" | "md" | "lg";
    className?: string;
    gradient?: boolean;
}

export const GlassMedallion: React.FC<GlassMedallionProps> = ({
    icon,
    size = "md",
    className,
    gradient = true
}) => {
    const sizes = {
        sm: "w-10 h-10 text-xl",
        md: "w-16 h-16 text-2xl",
        lg: "w-24 h-24 text-4xl"
    };

    return (
        <div className={cn(
            "relative flex items-center justify-center rounded-2xl transition-transform duration-500 hover:rotate-[10deg]",
            sizes[size],
            className
        )}>
            {/* Main Glass Body */}
            <div className="absolute inset-0 glass-morphism rounded-2xl shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]" />

            {/* 3D Inner Glow / Depth */}
            <div className="absolute inset-0 bg-white/5 rounded-2xl border border-white/20 shadow-inner" />

            {/* Gradient Background (Optional) */}
            {gradient && (
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/20 to-accent-purple/20 rounded-2xl blur-sm" />
            )}

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center">
                {icon}
            </div>
        </div>
    );
};
