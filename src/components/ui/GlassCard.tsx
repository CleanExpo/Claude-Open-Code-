import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className,
    onClick,
    hoverable = true
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-[20px] transition-all duration-300",
                hoverable && "hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]",
                onClick && "cursor-pointer",
                className
            )}
        >
            {/* Subtle inner glow and 3D depth */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.08] to-transparent opacity-100" />
            <div className="absolute -inset-px rounded-[24px] pointer-events-none border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 font-sans">
                {children}
            </div>
        </div>
    );
};
