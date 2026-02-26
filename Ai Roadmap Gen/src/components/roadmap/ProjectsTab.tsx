import { Project } from "@/types/roadmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Database, ListChecks, Star } from "lucide-react";

interface ProjectsTabProps {
  projects: Project[];
}

const ProjectsTab = ({ projects }: ProjectsTabProps) => {
  return (
    <div className="space-y-6">
      {projects.map((project, idx) => (
        <Card key={idx} className="overflow-hidden bg-[#1e293b] border-blue-900/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="bg-[#0f172a]/50 border-b border-blue-900/50 pb-4">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 border-blue-800 text-blue-300 bg-blue-950/50">Month {project.month}</Badge>
                <CardTitle className="text-xl text-white">{project.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <p className="text-sm font-bold text-blue-200 mb-2 uppercase tracking-wide">Problem Statement</p>
              <p className="text-sm text-slate-300 leading-relaxed">{project.problem_statement}</p>
            </div>

            <div>
              <p className="text-sm font-bold text-blue-200 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <Database className="w-4 h-4 text-indigo-400" /> Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech, i) => (
                  <Badge key={i} variant="secondary" className="bg-blue-950/50 hover:bg-blue-900/50 text-blue-200 border-blue-900/30 border">{tech}</Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-blue-200 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <ListChecks className="w-4 h-4 text-emerald-400" /> Step-by-Step
              </p>
              <ol className="space-y-3">
                {project.steps.map((step, i) => (
                  <li key={i} className="flex gap-4 text-sm text-slate-300">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-950 text-blue-300 text-xs font-bold shrink-0 border border-blue-900">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border border-blue-900/30 rounded-xl p-4 flex items-start gap-3">
              <Star className="w-5 h-5 text-amber-400 mt-0.5 shrink-0 fill-amber-400/20" />
              <div>
                <p className="text-sm font-bold text-white mb-1">Portfolio Impact</p>
                <p className="text-sm text-slate-300">{project.portfolio_impact}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectsTab;
