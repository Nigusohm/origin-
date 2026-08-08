'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Page() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sentMsg, setSentMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = await forgotPassword(email);
    setSentMsg(res.message);
  };

  return (
    <main data-division="corporate" className="bg-[#080A0F] text-[#F4F1EC] min-h-screen py-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-[#111318] border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl">
        
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-[#8A9AAF] hover:text-[#C8961E]">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#C8961E]/20 text-[#C8961E] rounded-2xl flex items-center justify-center mx-auto border border-[#C8961E]/30">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-cormorant font-bold text-[#F4F1EC]">Reset Your Password</h1>
          <p className="text-xs text-[#8A9AAF]">
            Enter your registered email address to receive a secure link to set a new password.
          </p>
        </div>

        {sentMsg ? (
          <div className="p-6 bg-[#080A0F] border border-[#06D6A0]/40 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-[#06D6A0] mx-auto" />
            <p className="text-xs text-[#F4F1EC] leading-relaxed">{sentMsg}</p>
            <Link href="/login" className="inline-block px-4 py-2 bg-[#C8961E] text-[#080A0F] font-bold text-xs rounded-xl uppercase">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-jakarta text-xs">
            <div>
              <label className="block text-[#8A9AAF] uppercase font-bold tracking-wider mb-1">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A9AAF] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] focus:border-[#C8961E] outline-none"
                  placeholder="client@origineverlasting.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#C8961E] text-[#080A0F] rounded-xl font-bold uppercase tracking-wider hover:bg-[#C8961E]/90 transition-all shadow-lg"
            >
              Send Reset Link
            </button>
          </form>
        )}

      </div>
    </main>
  );
}
