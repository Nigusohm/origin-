'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin, verifyAdminOtp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  // const handleCredentials = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setErrorMsg(null);
  //   setInfoMsg(null);
  //   setLoading(true);
  //   try {
  //     const res = await adminLogin(email, password);
  //     if (res.success && res.requiresOtp) {
  //       setStep('otp');
  //       setInfoMsg(res.message || `A verification code has been sent to ${email}`);
  //       if (res.devOtp) setOtp(res.devOtp);
  //     } else if (!res.success) {
  //       setErrorMsg(res.message || 'Invalid credentials. Ensure you have an admin account.');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };


const handleCredentials = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg(null);
  setInfoMsg(null);
  setLoading(true);
  try {
    const res = await adminLogin(email, password);

    if (res.success && res.requiresOtp === false) {
      router.push('/admin');
      return;
    }

    if (res.success && res.requiresOtp) {
      setStep('otp');
      setInfoMsg(res.message || `A verification code has been sent to ${email}`);
      if (res.devOtp) setOtp(res.devOtp);
    } else if (!res.success) {
      setErrorMsg(res.message || 'Invalid credentials. Ensure you have an admin account.');
    }
  } finally {
    setLoading(false);
  }
};






  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await verifyAdminOtp(email, otp);
      if (res.success) {
        router.push('/admin');
      } else {
        setErrorMsg(res.message || 'Invalid or expired code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main data-division="corporate" className="bg-[#080A0F] text-[#F4F1EC] min-h-screen py-16 px-4 flex items-center justify-center font-jakarta">
      <div className="max-w-md w-full bg-[#111318] border border-[#06D6A0]/40 p-8 rounded-3xl space-y-6 shadow-2xl">

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#06D6A0]/20 text-[#06D6A0] rounded-2xl flex items-center justify-center mx-auto border border-[#06D6A0]/30">
            {step === 'otp' ? <KeyRound className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
          </div>
          <h1 className="text-3xl font-cormorant font-bold text-[#F4F1EC]">
            {step === 'otp' ? 'Enter Verification Code' : 'Enterprise Admin Login'}
          </h1>
          <p className="text-xs text-[#8A9AAF]">
            {step === 'otp'
              ? `Check your email at ${email} for the 6-digit code.`
              : 'Restricted portal for Origin & Everlasting Division Admins and Super Admin.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#C84B1A]/20 border border-[#C84B1A] text-[#C84B1A] rounded-xl text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div className="p-3 bg-[#06D6A0]/10 border border-[#06D6A0]/40 text-[#06D6A0] rounded-xl text-xs font-bold text-center">
            {infoMsg}
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleCredentials} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8A9AAF] uppercase font-bold tracking-wider mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A9AAF] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] focus:border-[#06D6A0] outline-none"
                  placeholder="admin@origineverlasting.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8A9AAF] uppercase font-bold tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A9AAF] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] focus:border-[#06D6A0] outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#06D6A0] text-[#080A0F] rounded-xl font-bold uppercase tracking-wider hover:bg-[#06D6A0]/90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Verifying…' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtp} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8A9AAF] uppercase font-bold tracking-wider mb-1">6-Digit OTP Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] focus:border-[#06D6A0] outline-none text-center text-lg tracking-[0.5em] font-mono"
                placeholder="000000"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3.5 bg-[#06D6A0] text-[#080A0F] rounded-xl font-bold uppercase tracking-wider hover:bg-[#06D6A0]/90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              {loading ? 'Verifying Code…' : 'Access Admin Portal'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('credentials'); setOtp(''); setErrorMsg(null); setInfoMsg(null); }}
              className="w-full text-[#8A9AAF] hover:text-white text-center transition-colors"
            >
              ← Back to login
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
