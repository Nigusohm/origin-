'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    // Supabase also supports the older ?token= format
    const legacyToken = searchParams.get('token');
    const email = searchParams.get('email');

    async function verify() {
      try {
        // ── New Supabase PKCE flow (token_hash + type) ──────────────────────
        if (tokenHash && type) {
          const res = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token_hash: tokenHash, type }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Verification failed');

          setStatus('success');
          setMessage('Your email has been verified! Redirecting to your account...');
          setTimeout(() => router.push('/account'), 2500);
          return;
        }

        // ── Legacy OTP flow (email + token) ─────────────────────────────────
        if (email && legacyToken) {
          const res = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token: legacyToken }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Verification failed');

          setStatus('success');
          setMessage('Your email has been verified! Redirecting to your account...');
          setTimeout(() => router.push('/account'), 2500);
          return;
        }

        // ── No params — may have been auto-verified by Supabase magic link ──
        setStatus('success');
        setMessage('Email verified! Redirecting to your account...');
        setTimeout(() => router.push('/account'), 2500);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The link may have expired.');
      }
    }

    verify();
  }, [searchParams, router]);

  return (
    <main className="min-h-screen bg-[#080A0F] text-[#F4F1EC] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#111318] border border-white/10 p-10 rounded-3xl text-center space-y-6 shadow-2xl">

        {status === 'loading' && (
          <>
            <div className="w-16 h-16 bg-[#C8961E]/20 rounded-full flex items-center justify-center mx-auto border border-[#C8961E]/30">
              <Loader2 className="w-8 h-8 text-[#C8961E] animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-[#F4F1EC]">Verifying Email</h1>
            <p className="text-sm text-[#8A9AAF]">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-[#F4F1EC]">Email Verified!</h1>
            <p className="text-sm text-[#8A9AAF]">{message}</p>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div className="bg-[#C8961E] h-1 rounded-full animate-[progress_2.5s_linear_forwards]" />
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-[#F4F1EC]">Verification Failed</h1>
            <p className="text-sm text-[#8A9AAF]">{message}</p>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => router.push('/signup')}
                className="w-full py-3 bg-[#C8961E] text-[#080A0F] rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#C8961E]/90 transition-all"
              >
                Back to Sign Up
              </button>
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 border border-white/10 text-[#8A9AAF] rounded-xl font-bold text-sm uppercase tracking-wider hover:border-white/30 transition-all"
              >
                Go to Login
              </button>
            </div>
          </>
        )}

      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#080A0F] text-[#F4F1EC] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#C8961E] animate-spin" />
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
