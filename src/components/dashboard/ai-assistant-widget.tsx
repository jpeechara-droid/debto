"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function AiAssistantWidget() {
  const [messages, setMessages] = useState<{ role: string; content: string; options?: string[] }[]>([
    {
      role: "assistant",
      content: "Hello Rajesh! I've analyzed your latest CIBIL report. Your score of 742 is strong. Would you like to see how making an extra payment of ₹5,000/month could impact your Home Loan?",
    },
    {
      role: "user",
      content: "Yes, show me the calculation for ₹5k extra payment.",
    },
    {
      role: "assistant", // Using a special content trigger to render the mock projection widget we see in the screenshots
      content: "[PROJECTION:REFINANCE]",
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { role: "user", content: inputValue }];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm analyzing that scenario for you right now." },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <aside className="hidden lg:flex flex-col w-[320px] xl:w-[340px] border-l border-slate-100 bg-white shadow-[-4px_0_24px_-16px_rgba(0,0,0,0.03)] z-30">
      {/* Header */}
      <div className="h-12 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#5454F6] text-[18px]">
            smart_toy
          </span>
          <h2 className="text-[13px] font-bold text-slate-800">AI Assistant</h2>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <span className="material-symbols-outlined text-[16px]">open_in_full</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-0 flex flex-col gap-4 bg-[#fafbfc]">
        {messages.map((msg, idx) => {
          if (msg.role === "user") {
            return (
              <div key={idx} className="self-end flex items-end gap-1.5 max-w-[82%] group">
                <div className="bg-[#5454F6] text-white text-[13px] leading-[1.55] px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm">
                  {msg.content}
                </div>
                <div className="size-5 rounded-full overflow-hidden shrink-0 border border-slate-200">
                   <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
            );
          }

          // Render assistant message
          return (
            <div key={idx} className="self-start flex items-start gap-2.5 max-w-[90%]">
              <div className="size-6 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100/50 mt-0.5">
                <span className="material-symbols-outlined text-[#5454F6] text-[13px]">
                  auto_awesome
                </span>
              </div>
              
              <div className="flex-1 flex flex-col gap-2">
                {msg.content === "[PROJECTION:REFINANCE]" ? (
                  <div className="bg-[#F8F9FA] border border-slate-100 rounded-xl p-4 shadow-sm">
                    <h4 className="text-[11px] font-bold text-slate-800 mb-1.5 uppercase tracking-wide">Savings Projection</h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed mb-3">
                      An extra ₹5,000 monthly reduces your loan tenure by <span className="font-semibold text-[#0046FF]">4.2 years</span> and saves you approximately <span className="font-semibold text-[#0046FF]">₹8.4 Lakhs</span> in total interest.
                    </p>
                    <button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-50 transition-colors group">
                      Full Projection PDF
                      <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-[#0046FF]">download</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#F8F9FA] text-[#4A5568] text-[13px] leading-[1.55] px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm">
                    {msg.content}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="self-start flex items-start gap-2 max-w-[85%]">
            <div className="size-6 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100/50 mt-0.5">
              <span className="material-symbols-outlined text-[#5454F6] text-[13px]">
                auto_awesome
              </span>
            </div>
            <div className="bg-[#F8F9FA] text-slate-500 rounded-2xl rounded-tl-sm px-3 py-2 border border-slate-100 flex items-center gap-1 shadow-sm">
              <div className="size-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="size-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="size-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-100 shrink-0">
        <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar pb-0.5">
          <button className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors">
            Debt Calculator
          </button>
          <button className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors">
            Refinance Offers
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Ask anything about your debts..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full bg-[#F3F4F6] text-[13px] text-slate-800 placeholder:text-slate-400 rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#5454F6]/20 transition-all border border-transparent focus:border-[#5454F6]/30"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-1 top-1 bottom-1 aspect-square bg-[#1A1A1A] hover:bg-black text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:hover:bg-[#1A1A1A] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
