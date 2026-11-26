import React, { useState } from 'react';
import { Bot, X, Sparkles, Send, CheckCircle2, Zap } from 'lucide-react';

interface AICoachDrawerProps {
  onClose: () => void;
  userName?: string;
}

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({ onClose, userName }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Namaste ${userName || 'Student'}! Ask me for internship, resume, or placement guidance.`
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });

      const data = await response.json();
      if (!response.ok || data.source === 'fallback' || typeof data.reply !== 'string') {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: data.error || 'AI Coach is unavailable. Check the provider setup in Vercel and try again.'
        }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Could not reach the AI Coach. Please try again in a moment.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-black/90 backdrop-blur-3xl border-l border-white/20 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                AI Match Coach
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <p className="text-[10px] text-neutral-400">Internships Automated Guidance</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="space-y-3 overflow-y-auto max-h-[65vh] pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-white/20 text-white ml-6 font-medium border border-white/20'
                  : 'glass-panel text-neutral-200 border border-white/10'
              }`}
            >
              {m.text}
            </div>
          ))}
          {isTyping && (
            <div className="glass-panel text-neutral-400 border border-white/10 p-3 rounded-2xl text-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span>AI Coach is thinking...</span>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="pt-4 border-t border-white/10">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask AI Coach for resume & match advice..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-full pl-4 pr-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/40"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white text-black hover:scale-105 transition-transform"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
