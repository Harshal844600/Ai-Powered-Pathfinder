import { useState } from "react";
import { Quiz } from "@/types/roadmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Code, Zap, CheckCircle2, XCircle } from "lucide-react";

interface QuizzesTabProps {
  quizzes: Quiz[];
}

const QuizzesTab = ({ quizzes }: QuizzesTabProps) => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const quiz = quizzes[selectedWeek];
  if (!quiz) return <p className="text-muted-foreground">No quizzes available.</p>;

  const handleAnswer = (qIdx: number, optIdx: number) => {
    if (answers[qIdx] !== undefined) return; // Prevent changing answer for immediate feedback
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const score = quiz.mcqs.filter((q, i) => answers[i] === q.correct).length;

  return (
    <div className="space-y-6">
      {/* Week selector */}
      {/* Week selector */}
      <div className="flex flex-wrap gap-2">
        {quizzes.map((_, i) => (
          <Button
            key={i}
            variant={selectedWeek === i ? "default" : "outline"}
            size="sm"
            className={selectedWeek === i ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-transparent text-slate-400 border-blue-900/50 hover:bg-blue-900/30 hover:text-white"}
            onClick={() => { setSelectedWeek(i); setAnswers({}); setShowResults(false); }}
          >
            Week {quizzes[i].week}
          </Button>
        ))}
      </div>

      {/* MCQs */}
      <Card className="bg-[#1e293b] border-blue-900/50 shadow-sm">
        <CardHeader className="pb-3 border-b border-blue-900/50 bg-[#0f172a]/50">
          <CardTitle className="text-base flex items-center gap-2 text-white">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            Multiple Choice Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {quiz.mcqs.map((mcq, qIdx) => (
            <div key={qIdx} className="space-y-3">
              <p className="text-sm font-semibold text-blue-100">
                {qIdx + 1}. {mcq.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mcq.options.map((opt, oIdx) => {
                  const selected = answers[qIdx] === oIdx;
                  const answered = answers[qIdx] !== undefined;
                  const isCorrect = mcq.correct === oIdx;

                  let variantClass = "bg-blue-950/30 border-blue-900/30 text-slate-300 hover:bg-blue-900/50 hover:text-white";

                  if (answered) {
                    if (isCorrect) {
                      variantClass = "bg-green-950/30 border-green-900/50 text-green-400 hover:bg-green-900/50 ring-1 ring-green-500/20";
                    } else if (selected) {
                      variantClass = "bg-red-950/30 border-red-900/50 text-red-400 hover:bg-red-900/50 ring-1 ring-red-500/20";
                    } else {
                      variantClass = "opacity-40 bg-blue-950/10 border-blue-900/10 text-slate-500 pointer-events-none";
                    }
                  } else if (selected) {
                    variantClass = "bg-blue-600 text-white hover:bg-blue-500 border-blue-600";
                  }

                  return (
                    <Button
                      key={oIdx}
                      variant="outline"
                      size="sm"
                      className={`justify-start text-left h-auto py-3 px-4 rounded-xl transition-all duration-300 ${variantClass}`}
                      onClick={() => handleAnswer(qIdx, oIdx)}
                    >
                      <span className="font-mono mr-2 text-xs opacity-70">{String.fromCharCode(65 + oIdx)}.</span>
                      {opt}
                      {answered && isCorrect && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0 text-green-400 animate-in zoom-in duration-300" />}
                      {answered && selected && !isCorrect && <XCircle className="w-4 h-4 ml-auto shrink-0 text-red-400 animate-in shake duration-300" />}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-4 border-t border-blue-900/50 mt-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(quiz.mcqs.length)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full border border-slate-900 ${answers[i] === undefined ? "bg-slate-700" :
                        answers[i] === quiz.mcqs[i].correct ? "bg-green-500 shadow-sm shadow-green-500/50" : "bg-red-500 shadow-sm shadow-red-500/50"
                      }`}
                  />
                ))}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Live Feedback</span>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1 bg-blue-900/50 text-blue-100 hover:bg-blue-900/50 border border-blue-800">
              Session Score: {score}/{quiz.mcqs.length}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Coding Questions */}
      <Card className="bg-[#1e293b] border-blue-900/50 shadow-sm">
        <CardHeader className="pb-3 border-b border-blue-900/50 bg-[#0f172a]/50">
          <CardTitle className="text-base flex items-center gap-2 text-white">
            <Code className="w-5 h-5 text-blue-400" />
            Coding Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {quiz.coding_questions.map((cq, i) => (
            <div key={i} className="bg-[#0f172a] rounded-xl p-5 space-y-3 shadow-inner border border-blue-900/20">
              <p className="text-sm font-medium text-slate-300 font-mono">{cq.question}</p>
              <p className="text-xs text-slate-400 border-t border-blue-900/30 pt-3 flex items-center gap-2">
                <span className="text-yellow-400">💡 Hint:</span> {cq.hint}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Mini Challenge */}
      <Card className="bg-gradient-to-br from-blue-950 to-[#0f172a] border-blue-900/50 shadow-sm">
        <CardHeader className="pb-3 border-b border-blue-900/50">
          <CardTitle className="text-base flex items-center gap-2 text-white">
            <Zap className="w-5 h-5 text-yellow-400" />
            Mini Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm bg-[#1e293b] border border-blue-900 text-blue-100 rounded-xl p-4 shadow-sm">{quiz.mini_challenge}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizzesTab;
