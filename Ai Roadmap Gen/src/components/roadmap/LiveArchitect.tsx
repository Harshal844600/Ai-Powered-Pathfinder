import { useState, useEffect } from "react";
import { Sparkles, Activity, Search, BookOpen, Code, Trophy, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LiveArchitectProps {
    goal: string;
    isStreaming: boolean;
    error?: string | null;
}

const LiveArchitect = ({ goal, isStreaming, error }: LiveArchitectProps) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { icon: Search, label: "Analyzing goal...", detail: goal },
        { icon: Sparkles, label: "Mapping core concepts...", detail: "Identifying key modules" },
        { icon: BookOpen, label: "Curating resources...", detail: "Finding best courses & videos" },
        { icon: Code, label: "Designing projects...", detail: "Structuring hands-on challenges" },
        { icon: Trophy, label: "Finalizing outcomes...", detail: "Defining success metrics" },
    ];

    useEffect(() => {
        if (!isStreaming) return;

        let stepIndex = 0;
        const interval = setInterval(() => {
            if (stepIndex < steps.length) {
                setCurrentStep(stepIndex);
                setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${steps[stepIndex].label}`, ...prev.slice(0, 5)]);
                setProgress((stepIndex + 1) * 20);
                stepIndex++;
            } else {
                clearInterval(interval);
            }
        }, 2500);

        return () => clearInterval(interval);
    }, [isStreaming, goal]);

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="bg-[#0f172a]/80 backdrop-blur-xl border border-blue-500/20 p-8 shadow-2xl shadow-blue-500/10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse" />
                        <div className="relative p-3 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
                            <Activity className="w-6 h-6 text-white animate-pulse" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">AI Architect is Live</h3>
                        <p className="text-blue-300/60 text-sm">Building your custom roadmap with industry-grade precision</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-semibold tracking-wider text-blue-400 uppercase">
                            <span>Construction Progress</span>
                            <span className="text-blue-200">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-blue-950" />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            const isActive = idx === currentStep;
                            const isCompleted = idx < currentStep;

                            return (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${isActive
                                        ? "bg-blue-600/10 border-blue-500/50 scale-102 shadow-lg"
                                        : isCompleted
                                            ? "bg-blue-500/5 border-blue-500/20 opacity-60"
                                            : "bg-[#1e293b]/20 border-white/5 opacity-30"
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${isActive ? "bg-blue-500 text-white" : "bg-blue-900/30 text-blue-300"}`}>
                                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-slate-400"}`}>
                                            {step.label}
                                        </p>
                                        {isActive && (
                                            <p className="text-xs text-blue-300/80 animate-in fade-in slide-in-from-left-2 mt-0.5">
                                                {step.detail}
                                            </p>
                                        )}
                                    </div>
                                    {isActive && (
                                        <div className="flex gap-1">
                                            <div className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <div className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "200ms" }} />
                                            <div className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "400ms" }} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {error ? (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-red-500" />
                                <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Construction Error</span>
                            </div>
                            <p className="text-sm text-red-200 leading-relaxed italic">
                                "{error}"
                            </p>
                        </div>
                    ) : (
                        <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono">
                            <div className="flex items-center gap-2 mb-2 text-[10px] text-white/30 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Direct Architect Logs
                            </div>
                            <div className="space-y-1 h-20 overflow-hidden">
                                {logs.map((log, i) => (
                                    <div key={i} className="text-[11px] text-blue-300/80 animate-in fade-in transition-all">
                                        <span className="text-blue-500/50 mr-2">&gt;</span>
                                        {log}
                                    </div>
                                ))}
                                {logs.length === 0 && <div className="text-[11px] text-white/10 italic">Initializing systems...</div>}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            <p className="text-center text-xs text-slate-500 italic">
                "Quality learning takes a few seconds to architect. Hang tight."
            </p>
        </div>
    );
};

export default LiveArchitect;
