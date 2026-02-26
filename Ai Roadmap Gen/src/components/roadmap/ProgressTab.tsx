import { useState, useEffect, useMemo } from "react";
import { WeekPlan } from "@/types/roadmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Circle, Trophy, TrendingUp, Calendar, Zap } from "lucide-react";
import { getRoadmapProgress, saveRoadmapProgress, generateRoadmapId } from "@/lib/storage";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface ProgressTabProps {
  weeks: WeekPlan[];
  goal: string;
}

const ProgressTab = ({ weeks, goal }: ProgressTabProps) => {
  const roadmapId = useMemo(() => generateRoadmapId(goal, weeks.length.toString()), [goal, weeks]);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setCompleted(getRoadmapProgress(roadmapId));
  }, [roadmapId]);

  const toggleWeek = (week: number) => {
    const next = { ...completed, [week]: !completed[week] };
    setCompleted(next);
    saveRoadmapProgress(roadmapId, next);
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPercent = weeks.length > 0 ? (completedCount / weeks.length) * 100 : 0;

  // Chart data calculation
  const chartData = useMemo(() => {
    return weeks.map((w, idx) => {
      const isDone = !!completed[w.week];
      const cumulativeCompleted = weeks.slice(0, idx + 1).filter(sw => !!completed[sw.week]).length;
      return {
        name: `W${w.week}`,
        completed: (cumulativeCompleted / weeks.length) * 100,
      };
    });
  }, [weeks, completed]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-[#1e293b]/50 border-blue-900/30 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 flex gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Live Sync</span>
            </div>
            <Trophy className="w-5 h-5 text-yellow-500/50 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-sm font-medium text-slate-400">Total Progress</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-4xl font-bold text-white">{Math.round(progressPercent)}%</p>
            <p className="text-xs text-blue-400">Archived</p>
          </div>
          <Progress value={progressPercent} className="mt-4 h-1.5 bg-blue-950" />
        </Card>

        <Card className="md:col-span-2 bg-[#1e293b] border-blue-900/50">
          <CardHeader className="pb-3 border-b border-blue-900/50 bg-[#0f172a]/50">
            <CardTitle className="text-base flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Progress Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorProg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e3a8a', borderRadius: '8px' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorProg)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1e293b] border-blue-900/50">
          <CardHeader className="pb-3 border-b border-blue-900/50 bg-[#0f172a]/50">
            <CardTitle className="text-base flex items-center gap-2 text-white">
              <Zap className="w-5 h-5 text-green-400" />
              Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-200">Total Progress</span>
                <span className="font-bold text-white">{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2 bg-blue-950" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-blue-400 uppercase font-semibold">Weeks Completed</span>
              <span className="text-2xl font-bold text-white">{completedCount} / {weeks.length}</span>
            </div>
            {completedCount > 0 && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs text-orange-200">
                <Zap className="w-4 h-4 text-orange-400" />
                Learning streak active! 🎉
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Week Checklist */}
      <Card className="bg-[#1e293b] border-blue-900/50">
        <CardHeader className="pb-3 border-b border-blue-900/50 bg-[#0f172a]/50">
          <CardTitle className="text-base text-white">Weekly Roadmap Tracker</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-1">
            {weeks.map((week) => (
              <div
                key={week.week}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-900/20 transition-colors"
              >
                <Checkbox
                  id={`week-${week.week}`}
                  checked={!!completed[week.week]}
                  onCheckedChange={() => toggleWeek(week.week)}
                  className="border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                />
                <label
                  htmlFor={`week-${week.week}`}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <p className={`text-sm font-medium transition-all ${completed[week.week] ? "line-through text-slate-500" : "text-slate-200"}`}>
                    Week {week.week}: {week.title}
                  </p>
                  <p className="text-xs text-slate-500">{week.topics.length} topics · {week.exercises.length} exercises</p>
                </label>
                <Badge variant={completed[week.week] ? "default" : "outline"} className={`text-xs ${completed[week.week] ? "bg-blue-600 hover:bg-blue-500" : "text-slate-400 border-blue-900/50"}`}>
                  {completed[week.week] ? "Done" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTab;
