'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid corporate email or phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/account';
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    const res = await login(data.email, data.password);
    if (res.success) {
      router.push(returnUrl);
    } else {
      setErrorMsg(res.message || 'Invalid credentials');
    }
  };

  return (
    <main data-division="corporate" className="bg-[#080A0F] text-[#F4F1EC] min-h-screen py-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-[#111318] border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#C8961E]/20 text-[#C8961E] rounded-2xl flex items-center justify-center mx-auto border border-[#C8961E]/30">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-cormorant font-bold text-[#F4F1EC]">Client & Staff Login</h1>
          <p className="text-xs text-[#8A9AAF]">
            Sign in to access your orders, enquiries, payment instructions, and division quotes.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#C84B1A]/20 border border-[#C84B1A] text-[#C84B1A] rounded-xl text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-jakarta text-xs">
          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold tracking-wider mb-1">Corporate Email or Phone</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A9AAF] absolute left-3 top-3" />
              <input
                {...register('email')}
                type="text"
                className="w-full pl-9 pr-4 py-2.5 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] focus:border-[#C8961E] outline-none"
                placeholder="name@company.com"
              />
            </div>
            {errors.email && <p className="text-[#C84B1A] text-[10px] mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[#8A9AAF] uppercase font-bold tracking-wider">Password</label>
              <Link href="/forgot-password" className="text-[#C8961E] hover:underline text-[10px]">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A9AAF] absolute left-3 top-3" />
              <input
                {...register('password')}
                type="password"
                className="w-full pl-9 pr-4 py-2.5 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] focus:border-[#C8961E] outline-none"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-[#C84B1A] text-[10px] mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#C8961E] text-[#080A0F] rounded-xl font-bold uppercase tracking-wider hover:bg-[#C8961E]/90 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {isSubmitting ? 'Authenticating...' : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>


        <div className="text-center text-xs text-[#8A9AAF]">
          Don&apos;t have an account?{' '}
          <Link href={`/signup?returnUrl=${encodeURIComponent(returnUrl)}`} className="text-[#C8961E] font-bold hover:underline">
            Create Account
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080A0F] text-[#F4F1EC] flex items-center justify-center">Loading Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
