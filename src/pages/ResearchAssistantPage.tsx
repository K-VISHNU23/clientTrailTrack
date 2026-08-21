import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, FileText, User } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { answerResearchQuestion } from '@/lib/researchAssistant';
import { researchAssistantSuggestions } from '@/data/dashboard';
import type { ChatMessage } from '@/types';

export function ResearchAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am the TrialMatch AI Research Assistant. I can help you understand patient eligibility, trial criteria, and screening results. Ask me a question or try one of the suggestions below.',
      timestamp: '2026-08-15 10:00 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function sendQuestion(question?: string) {
    const query = question || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = answerResearchQuestion(query);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: answer.content,
        evidence: answer.evidence,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-navy-800">Research Assistant</h2>
        <p className="text-sm text-slate-500 mt-1">AI-powered Q&A for clinical trial eligibility and patient screening</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chat */}
        <Card className="lg:col-span-2 flex flex-col" >
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4 min-h-[400px] max-h-[600px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                  msg.role === 'user' ? 'bg-navy-700 text-white' : 'bg-teal-100 text-teal-600'
                }`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>
                <div className={`flex-1 min-w-0 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                  <div className={`inline-block rounded-2xl px-4 py-3 max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-navy-700 text-white'
                      : 'bg-slate-50 text-navy-800 border border-slate-100'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    {msg.evidence && msg.evidence.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/50">
                        <p className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Evidence
                        </p>
                        <ul className="space-y-1">
                          {msg.evidence.map((e, i) => (
                            <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                              <span className="text-teal-500 mt-0.5">•</span> {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-600 shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="inline-block rounded-2xl px-4 py-3 bg-slate-50 border border-slate-100">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '200ms' }} />
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-pulse" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendQuestion()}
                placeholder="Ask about patient eligibility, trial criteria..."
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-400"
              />
              <Button variant="primary" onClick={() => sendQuestion()} disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </Card>

        {/* Suggestions */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-4 w-4 text-navy-500" />
            <h3 className="font-semibold text-navy-800 text-sm">Suggested Questions</h3>
          </div>
          <div className="space-y-2">
            {researchAssistantSuggestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendQuestion(q)}
                className="w-full text-left rounded-lg border border-slate-100 px-3 py-2.5 text-sm text-navy-700 hover:bg-navy-50 hover:border-navy-200 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <Badge variant="amber">
              <Sparkles className="h-3 w-3" />
              AI Assistant
            </Badge>
            <p className="text-xs text-slate-400 mt-2">
              This assistant provides evidence-based answers grounded in synthetic patient and trial data. It does not invent clinical evidence.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
