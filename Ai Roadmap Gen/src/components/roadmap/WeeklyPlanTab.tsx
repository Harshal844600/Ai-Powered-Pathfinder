import { WeekPlan } from "@/types/roadmap";
import { CheckCircle2, Code, Lightbulb, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WeeklyPlanTabProps {
  weeks: WeekPlan[];
}

const WeeklyPlanTab = ({ weeks }: WeeklyPlanTabProps) => {
  return (
    <div className="space-y-6">
      {weeks.map((week) => (
        <Card key={week.week} className="overflow-hidden bg-[#1e293b] border-blue-900/50 shadow-sm hover:shadow-md transition-shadow hover:border-blue-700/50">
          <CardHeader className="pb-3 border-b border-blue-900/50 bg-[#0f172a]/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold tracking-tight text-white">
                Week {week.week}: <span className="font-medium text-blue-200">{week.title}</span>
              </CardTitle>
              <Badge variant="outline" className="border-blue-800 text-blue-200 bg-blue-950/50">Week {week.week}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
            {/* Topics */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-300 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Topics to Learn
              </div>
              <ul className="space-y-2">
                {week.topics.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-500/50 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exercises */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-300 uppercase tracking-wider">
                <Code className="w-4 h-4 text-blue-400" />
                Hands-on Exercises
              </div>
              <ul className="space-y-2">
                {week.exercises.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-500/50 shrink-0" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mini Project */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-300 uppercase tracking-wider">
                <Target className="w-4 h-4 text-red-400" />
                Mini Project
              </div>
              <p className="text-sm bg-[#0f172a] border border-blue-900/50 rounded-xl p-4 text-slate-300 shadow-sm">{week.mini_project}</p>
            </div>

            {/* Key Outcomes */}
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-2">
                {week.key_outcomes.map((o, i) => (
                  <Badge key={i} variant="secondary" className="text-xs bg-blue-950/50 hover:bg-blue-900/50 text-blue-200 border border-blue-900/30 px-3 py-1">
                    ✅ {o}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WeeklyPlanTab;
