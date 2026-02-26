import { useState } from "react";
import { ArrowRight, Sparkles, Target, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import NeuralNetworkHero from "@/components/ui/neural-network-hero";

const exampleGoals = [
  "Become a Machine Learning Engineer in 6 months",
  "Learn Full-Stack Web Development from scratch",
  "Master Data Science with Python",
  "Become a Cloud Architect (AWS)",
];

interface HeroSectionProps {
  onSubmitGoal: (goal: string) => void;
  isLoading: boolean;
}

const HeroSection = ({ onSubmitGoal, isLoading }: HeroSectionProps) => {
  const [goal, setGoal] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [commitment, setCommitment] = useState("Part-time");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      // @ts-ignore
      onSubmitGoal(goal.trim(), difficulty, commitment);
    }
  };

  return (
    <NeuralNetworkHero
      title="Your Personalized Learning Roadmap"
      description="Tell us your goal and our AI will craft a week-by-week learning path with projects, resources, quizzes, and a personal mentor."
      badgeText="AI-Powered Learning"
      badgeLabel="New"
      ctaButtons={[]} // We will inject our own form instead of buttons
      microDetails={["Weekly Milestones", "Real Projects", "AI Mentor"]}
    >
      <div className="w-full max-w-2xl mt-4 relative">
        {/* Ambient background pulse */}
        <div className="absolute -inset-20 bg-blue-500/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />

        {/* Grain overlay for premium feel */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />

        {/* Personalized Options */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider px-1">Difficulty</label>
            <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1">
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${difficulty === level
                    ? "bg-white/10 text-white shadow-lg"
                    : "text-white/40 hover:text-white/60"
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider px-1">Commitment</label>
            <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1">
              {["Part-time", "Full-time"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCommitment(mode)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${commitment === mode
                    ? "bg-white/10 text-white shadow-lg"
                    : "text-white/40 hover:text-white/60"
                    }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Input */}
        <form onSubmit={handleSubmit} className="w-full mb-8">
          <div className="relative flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 transition-all focus-within:bg-white/10 focus-within:border-white/20">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder='e.g. "I want to become a Machine Learning Engineer"'
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-white placeholder:text-white/40 text-base"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!goal.trim() || isLoading}
              className="rounded-xl px-6 py-3 h-auto font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Generate
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        </form>

        {/* Example Goals */}
        <div className="flex flex-wrap gap-2">
          {exampleGoals.map((eg) => (
            <button
              key={eg}
              onClick={() => setGoal(eg)}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 hover:text-white hover:border-white/30 transition-all text-left"
            >
              {eg}
            </button>
          ))}
        </div>
      </div>
    </NeuralNetworkHero>
  );
};

export default HeroSection;
