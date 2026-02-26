import { useState, useEffect } from "react";
import { Roadmap } from "@/types/roadmap";
import HeroSection from "@/components/HeroSection";
import RoadmapView from "@/components/roadmap/RoadmapView";
import LiveArchitect from "@/components/roadmap/LiveArchitect";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getRoadmapHistory, saveRoadmapToHistory, generateRoadmapId, RoadmapHistoryItem } from "@/lib/storage";
import { History, ArrowUpRight } from "lucide-react";

const Index = () => {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [currentGoal, setCurrentGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [history, setHistory] = useState<RoadmapHistoryItem[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setHistory(getRoadmapHistory());
  }, [roadmap]);

  const handleGenerateRoadmap = async (goal: string, difficulty: string = "Beginner", commitment: string = "Part-time") => {
    setIsLoading(true);
    setGenerationError(null);
    setCurrentGoal(goal);
    let hadError = false;
    try {
      console.log("--- Architect Connection Diagnostic ---");
      console.log("Endpoint:", "http://localhost:5000/api/generate-roadmap");

      const resp = await fetch(
        "http://localhost:5000/api/generate-roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ goal, difficulty, commitment }),
        }
      ).catch(err => {
        console.error("Fetch failure detected:", err);
        throw new Error(`Architect unreachable: ${err.message || "Is the server running on port 5000?"}`);
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => "Unknown error");
        console.error("Architect Error:", resp.status, errText);
        throw new Error(`Architect unreachable (${resp.status}): ${errText}`);
      }

      if (!resp.body) throw new Error("No response body from server");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "data: [DONE]") continue;

          if (trimmed.startsWith("data: ")) {
            try {
              const dataStr = trimmed.slice(6);
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                fullContent += parsed.text;
                // Periodic log to see if we are getting anything
                if (fullContent.length % 500 < 50) console.log("Incoming content length:", fullContent.length);
              }
              if (parsed.error) throw new Error(parsed.error);
            } catch (e) {
              // Partial line in stream
            }
          }
        }
      }

      console.log("Stream complete. Total length:", fullContent.length);

      try {
        const cleanedContent = fullContent
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        console.log("Final cleaned content (first 100 chars):", cleanedContent.substring(0, 100));

        if (!cleanedContent) {
          throw new Error("The AI architect provided an empty draft. Please try again.");
        }

        const finalRoadmap = JSON.parse(cleanedContent);

        if (!finalRoadmap.weekly_plan || !finalRoadmap.goal) {
          console.error("Invalid roadmap structure:", finalRoadmap);
          throw new Error("The AI drafted a roadmap but it was missing core components. Please try a more specific goal.");
        }

        const id = generateRoadmapId(goal, finalRoadmap.duration || "unspecified");
        saveRoadmapToHistory(id, goal, finalRoadmap);
        setRoadmap(finalRoadmap);
        console.log("Roadmap successfully set and displayed.");
      } catch (e) {
        console.error("Critical Failure in Architect output:", e, fullContent);
        throw new Error(e instanceof Error ? e.message : "The AI architect completed the draft but failed to format the final result.");
      }
    } catch (e: any) {
      hadError = true;
      console.error("Generation error:", e);
      setGenerationError(e.message || "Something went wrong.");
      toast({
        title: "Construction Stopped",
        description: e.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      // If there was an error, keep the LiveArchitect visible for 5s so user can read the error
      setTimeout(() => {
        setIsLoading(false);
      }, hadError ? 5000 : 0);
    }
  };

  if (roadmap) {
    return <RoadmapView roadmap={roadmap} onBack={() => setRoadmap(null)} />;
  }

  return (
    <div className="relative min-h-screen bg-slate-950">
      <header className="absolute top-0 w-full z-50 p-4 flex justify-end gap-4">
        <Button variant="ghost" onClick={() => navigate("/contact")} className="text-white hover:bg-white/10">Contact</Button>
      </header>

      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center px-4">
          <LiveArchitect goal={currentGoal} isStreaming={isLoading} error={generationError} />
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">
            <HeroSection onSubmitGoal={handleGenerateRoadmap} isLoading={isLoading} />
          </div>

          {history.length > 0 && (
            <div className="container max-w-6xl mx-auto px-4 pb-20 animate-in fade-in duration-1000">
              <div className="flex items-center gap-2 mb-6 px-1">
                <History className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-widest">Recent Architectures</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRoadmap(item.roadmap)}
                    className="group relative flex flex-col items-start p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-white font-medium mb-1 line-clamp-1">{item.goal}</p>
                    <div className="flex gap-2">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">{item.roadmap?.difficulty || 'Standard'}</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">•</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">{item.roadmap?.duration || 'Multi-week'}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
