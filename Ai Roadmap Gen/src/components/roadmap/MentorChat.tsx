import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

interface MentorChatProps {
  roadmapGoal?: string;
}

const MentorChat = ({ roadmapGoal }: MentorChatProps) => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: `Hi! 👋 I'm your AI Learning Mentor. ${roadmapGoal ? `I see you're working on: **${roadmapGoal}**. ` : ""}Ask me anything about your learning journey — I'm here to help, motivate, and guide you!` },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      console.log("--- Mentor Connection Diagnostic ---");
      console.log("Endpoint:", "http://localhost:5000/api/ai-mentor");

      const resp = await fetch(
        "http://localhost:5000/api/ai-mentor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
            roadmapContext: roadmapGoal,
          }),
        }
      ).catch(err => {
        console.error("Mentor Network Error:", err);
        throw new Error(`Mentor Connection failed: ${err.message || "Failed to reach backend server"}`);
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => "Unknown error");
        console.error("Mentor Function Error:", resp.status, errText);
        throw new Error(`Mentor unreachable (${resp.status}): ${errText}`);
      }

      if (!resp.body) throw new Error("No response body from mentor");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
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
              const jsonStr = trimmed.slice(6);
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantSoFar += content;
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  const last = newMsgs[newMsgs.length - 1];
                  if (last?.role === "assistant" && newMsgs.length > allMessages.length) {
                    last.content = assistantSoFar;
                    return newMsgs;
                  }
                  return [...prev, { role: "assistant", content: assistantSoFar }];
                });
              }
            } catch (e) {
              // Partial JSON, skip
            }
          }
        }
      }
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Sorry, I encountered an error: ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] bg-[#1e293b] border-blue-900/50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-blue-900/50 bg-[#0f172a]/50">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Sparkles className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="font-semibold text-sm text-white">AI Learning Mentor</p>
          <p className="text-xs text-slate-400">Ask anything about your roadmap</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f172a]/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-800">
                <Bot className="w-4 h-4 text-blue-300" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm shadow-sm ${msg.role === "user"
              ? "bg-blue-600 text-white"
              : "bg-[#1e293b] text-slate-200 border border-blue-900/30"
              }`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none prose-invert [&>p]:m-0 [&>ul]:m-0 text-slate-200">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-800">
              <Bot className="w-4 h-4 text-blue-300" />
            </div>
            <div className="bg-[#1e293b] rounded-2xl px-5 py-4 border border-blue-900/30">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-blue-900/50 bg-[#1e293b]">
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your mentor anything..."
            className="flex-1 bg-[#0f172a] rounded-xl px-4 py-3 text-sm outline-none border border-blue-900/30 focus:border-blue-500/50 transition-colors text-white placeholder:text-slate-500 hover:border-blue-800"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="h-full aspect-square rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:bg-blue-900/50 disabled:text-slate-500 shadow-lg shadow-blue-900/20">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default MentorChat;
