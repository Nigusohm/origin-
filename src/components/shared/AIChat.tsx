'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { X, Send, Bot, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const getDivisionContext = () => {
    if (pathname?.startsWith('/garment')) return 'B-VIBE Garment Manufacturing & E-Commerce';
    if (pathname?.startsWith('/digital')) return 'Tx Digital Marketing & Branding Agency';
    if (pathname?.startsWith('/consulting')) return 'Strategic Consulting Hub';
    return 'Origin & Everlasting Corporate HQ';
  };

  const currentContext = getDivisionContext();

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      divisionContext: currentContext,
    },
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Greetings! I am the Origin & Everlasting AI Executive Assistant. How may I assist you across B-VIBE Garment, Tˣ Digital Marketing, or Strategic Consulting Hub? (I support both English and አማርኛ).',
      },
    ],
  });

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-[#C8961E] via-[#D4B896] to-[#C8961E] text-[#080A0F] shadow-2xl hover:scale-105 transition-transform flex items-center justify-center border-2 border-white/20 group"
        aria-label="Open AI Assistant Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#080A0F]" />
        ) : (
          <div className="relative">
            <Bot className="w-7 h-7 text-[#080A0F]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#06D6A0] rounded-full border-2 border-[#080A0F] animate-pulse" />
          </div>
        )}
      </button>

      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[390px] h-[520px] max-h-[80vh] bg-[#0C1420] border border-[#C8961E]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-[#111318] p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C8961E]/20 text-[#C8961E] border border-[#C8961E]/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#F4F1EC] font-jakarta flex items-center gap-1.5">
                    O&E AI Assistant <span className="text-[10px] text-[#06D6A0] font-normal">• Vercel AI SDK</span>
                  </h3>
                  <p className="text-[10px] text-[#8A9AAF] truncate max-w-[220px]">
                    Context: {currentContext}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-[#8A9AAF] hover:text-[#F4F1EC] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#080A0F]/60">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-[#C8961E]/20 text-[#C8961E] border border-[#C8961E]/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#C8961E] text-[#080A0F] font-semibold rounded-br-none shadow-md'
                        : 'bg-[#111318] border border-white/10 text-[#F4F1EC] rounded-bl-none'
                    }`}
                  >
                    <p>{m.content}</p>
                  </div>

                  {m.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-white/10 text-[#F4F1EC] flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 items-center text-[#8A9AAF] text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#C8961E]/20 text-[#C8961E] flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <span className="animate-pulse">Thinking & composing response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 bg-[#111318] border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about products, packages, or booking..."
                className="flex-1 bg-[#080A0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F1EC] placeholder-[#8A9AAF] focus:outline-none focus:border-[#C8961E]"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-[#C8961E] text-[#080A0F] hover:bg-[#C8961E]/90 disabled:opacity-50 transition-colors font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
