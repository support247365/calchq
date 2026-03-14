/*
 * CalcHQ Support — Level 2: AI Chat Modal
 * Provides an AI-powered chat interface using the support tRPC router.
 */
import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatModalProps {
  onClose: () => void;
}

export default function ChatModal({ onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the CalcHQ AI assistant. I can help you understand how to use any of our calculators, explain your results, or answer questions about finance, health, and math. What can I help you with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatMutation = trpc.support.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please try again or email support@calchq.io for help.",
        },
      ]);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || chatMutation.isPending) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(newMessages);
    setInput("");

    chatMutation.mutate({ messages: newMessages });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ height: "min(600px, 90dvh)" }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white flex-shrink-0">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              AI Support Assistant
            </p>
            <p className="text-xs text-emerald-600 font-medium">Level 2 — Powered by AI</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.role === "assistant"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot className="w-3.5 h-3.5" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-100"
                    : "bg-emerald-500 text-white rounded-tr-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {chatMutation.isPending && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about any calculator..."
              disabled={chatMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-60"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
              className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            For unresolved issues, email{" "}
            <a href="mailto:support@calchq.io" className="text-emerald-600 hover:underline">
              support@calchq.io
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
