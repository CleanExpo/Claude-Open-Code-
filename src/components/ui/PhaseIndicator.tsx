import React from "react";
import { cn } from "@/lib/utils";

interface PhaseIndicatorProps {
    currentStep: number;
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({ currentStep }) => {
    const phases = [
        { title: "Analysis", step: 1 },
        { title: "Personas", step: 2 },
        { title: "Visualise", step: 3 }
    ];

    return (
        <div className="flex items-center gap-4 mb-12">
            {phases.map((phase, i) => (
                <React.Fragment key={phase.step}>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-500",
                            currentStep === phase.step
                                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-110"
                                : currentStep > phase.step
                                    ? "bg-accent-blue/20 text-accent-blue border-accent-blue/30"
                                    : "bg-white/5 text-gray-600 border-white/10"
                        )}>
                            {currentStep > phase.step ? "✓" : phase.step}
                        </div>
                        <span className={cn(
                            "text-xs font-bold uppercase tracking-widest transition-colors duration-500",
                            currentStep === phase.step ? "text-white" : "text-gray-600"
                        )}>
                            {phase.title}
                        </span>
                    </div>
                    {i < phases.length - 1 && (
                        <div className="w-8 h-[1px] bg-white/10" />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};
