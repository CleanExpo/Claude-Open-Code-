import React from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
    className?: string;
    variant?: "primary" | "secondary" | "outline";
    disabled?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
    children,
    onClick,
    loading = false,
    className,
    variant = "primary",
    disabled = false
}) => {
    const baseStyles = "relative group px-8 py-3 font-bold rounded-full overflow-hidden transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]",
        secondary: "bg-transparent text-white border border-white/20 hover:bg-white/5",
        outline: "bg-transparent text-white border-2 border-accent-blue/50 hover:border-accent-blue hover:shadow-[0_0_15px_rgba(0,102,255,0.3)]"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(baseStyles, variants[variant], className)}
        >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

            <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                    </>
                ) : (
                    children
                )}
            </span>
        </button>
    );
};
