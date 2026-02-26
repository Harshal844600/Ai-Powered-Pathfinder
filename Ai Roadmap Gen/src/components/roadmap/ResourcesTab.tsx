import { Resource } from "@/types/roadmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Youtube, GraduationCap, FileText, Github, ExternalLink } from "lucide-react";

interface ResourcesTabProps {
  resources: {
    youtube: Resource[];
    courses: Resource[];
    documentation: Resource[];
    github_repos: Resource[];
  };
}

const isVerified = (item: Resource) => {
  const trusted = [
    'FreeCodeCamp', 'Traversy Media', 'Fireship', 'The Net Ninja',
    'Academind', 'Programming with Mosh', 'MDN', 'Coursera',
    'edX', 'Udacity', 'Khan Academy'
  ];
  const combined = `${item.title} ${item.description || ''}`.toLowerCase();
  return trusted.some(t => combined.includes(t.toLowerCase()));
};

const Section = ({ icon: Icon, title, items, color }: { icon: any; title: string; items: Resource[]; color: string }) => (
  <Card className="bg-[#1e293b] border-blue-900/50 shadow-sm overflow-hidden">
    <CardHeader className="pb-3 border-b border-blue-900/50 bg-[#0f172a]/50">
      <CardTitle className="text-base flex items-center gap-2 text-white font-bold">
        <Icon className={`w-5 h-5 ${color}`} />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-2 p-0">
      <div className="divide-y divide-blue-900/30">
        {items.map((item, i) => {
          const verified = isVerified(item);
          return (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 hover:bg-blue-900/20 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-blue-100 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </p>
                  {verified && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[9px] px-1.5 py-0 rounded-md font-bold uppercase tracking-tighter">
                      Verified Source
                    </Badge>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.free !== undefined && (
                  <Badge variant={item.free ? "default" : "outline"} className={`text-xs ${item.free ? "bg-emerald-950/50 text-emerald-400 border-emerald-900 hover:bg-emerald-900/50" : "border-blue-800 text-slate-400"}`}>
                    {item.free ? "Free" : "Paid"}
                  </Badge>
                )}
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
              </div>
            </a>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

const ResourcesTab = ({ resources }: ResourcesTabProps) => {
  return (
    <div className="space-y-6">
      {resources.youtube?.length > 0 && (
        <Section icon={Youtube} title="YouTube Playlists" items={resources.youtube} color="text-red-400" />
      )}
      {resources.courses?.length > 0 && (
        <Section icon={GraduationCap} title="Courses" items={resources.courses} color="text-blue-400" />
      )}
      {resources.documentation?.length > 0 && (
        <Section icon={FileText} title="Documentation" items={resources.documentation} color="text-slate-400" />
      )}
      {resources.github_repos?.length > 0 && (
        <Section icon={Github} title="GitHub Repositories" items={resources.github_repos} color="text-white" />
      )}
    </div>
  );
};

export default ResourcesTab;
