import { useState } from "react";
import { Roadmap } from "@/types/roadmap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle2,
  Layout,
  HelpCircle,
  MessageCircle,
  Share2,
  Download,
  ArrowLeft,
  Settings2,
  Trophy,
  Sparkles
} from "lucide-react";
import WeeklyPlanTab from "./WeeklyPlanTab";
import ResourcesTab from "./ResourcesTab";
import ProjectsTab from "./ProjectsTab";
import QuizzesTab from "./QuizzesTab";
import ProgressTab from "./ProgressTab";
import MentorChat from "./MentorChat";
import { useToast } from "@/hooks/use-toast";

interface RoadmapViewProps {
  roadmap: Roadmap;
  onBack: () => void;
}

const RoadmapView = ({ roadmap, onBack }: RoadmapViewProps) => {
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`I'm learning "${roadmap.goal}" on AI Roadmap Architect! Check out this ${roadmap.duration} path.`);
    toast({
      title: "Goal Shared",
      description: "Learning path details copied to clipboard!",
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-blue-50 animate-in fade-in duration-700">
      {/* Background decoration - Hidden on print */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none print:hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-blue-900/50 print:relative print:bg-white print:border-slate-200">
          <div className="container max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4 print:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-blue-300 hover:text-white hover:bg-blue-900/30 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                New Roadmap
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="border-blue-900/50 text-blue-300 hover:bg-blue-900/30 rounded-xl"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="border-blue-800 text-blue-200 hover:bg-blue-900/30 rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Live Architecture
                </Badge>
                <Badge variant="outline" className="text-white/40 border-white/5 text-[10px] uppercase font-medium">{roadmap.difficulty || "Expert"}</Badge>
                <Badge variant="outline" className="text-white/40 border-white/5 text-[10px] uppercase font-medium">{roadmap.duration}</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white print:text-slate-900 tracking-tight">
                {roadmap.goal}
              </h1>
              <p className="text-sm text-slate-400 print:text-slate-600 max-w-3xl leading-relaxed">
                {roadmap.summary}
              </p>
              {roadmap.tech_stack_overview && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {roadmap.tech_stack_overview.map((tech, i) => (
                    <span key={i} className="text-[10px] bg-blue-500/5 text-blue-300/60 border border-blue-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles className="w-2 h-2" />
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="container max-w-6xl mx-auto px-4 py-8 flex-1">
          <Tabs defaultValue="plan" className="space-y-8">
            <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide print:hidden">
              <TabsList className="bg-[#1e293b]/50 border border-blue-900/30 p-1 rounded-2xl inline-flex w-auto min-w-full sm:min-w-0">
                <TabsTrigger value="plan" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-6">
                  <Layout className="w-4 h-4" />
                  Weekly Plan
                </TabsTrigger>
                <TabsTrigger value="resources" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-6">
                  <BookOpen className="w-4 h-4" />
                  Resources
                </TabsTrigger>
                <TabsTrigger value="projects" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-6">
                  <Trophy className="w-4 h-4" />
                  Portfolio Projects
                </TabsTrigger>
                <TabsTrigger value="quizzes" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-6">
                  <HelpCircle className="w-4 h-4" />
                  Quizzes
                </TabsTrigger>
                <TabsTrigger value="progress" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-6">
                  <CheckCircle2 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="mentor" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-6">
                  <MessageCircle className="w-4 h-4" />
                  AI Mentor
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="plan" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <WeeklyPlanTab weeks={roadmap.weekly_plan} />
            </TabsContent>

            <TabsContent value="resources" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ResourcesTab resources={roadmap.resources} />
            </TabsContent>

            <TabsContent value="projects" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProjectsTab projects={roadmap.projects} />
            </TabsContent>

            <TabsContent value="quizzes" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <QuizzesTab quizzes={roadmap.quizzes} />
            </TabsContent>

            <TabsContent value="progress" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ProgressTab weeks={roadmap.weekly_plan} goal={roadmap.goal} />
            </TabsContent>

            <TabsContent value="mentor" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <MentorChat roadmapGoal={roadmap.goal} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default RoadmapView;
