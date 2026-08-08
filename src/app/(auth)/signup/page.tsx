'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, CheckSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(9, 'Please enter a valid phone number (e.g. +251...)'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms of service' }),
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/account';
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      acceptTerms: true,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    const res = await signup(data.name, data.email, data.phone, data.password);
    if (res.success) router.push(returnUrl);
  };

  return (
    <main data-division="corporate" className="bg-[#080A0F] text-[#F4F1EC] min-h-screen py-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-[#111318] border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#C8961E]/20 text-[#C8961E] rounded-2xl flex items-center justify-center mx-auto border border-[#C8961E]/30">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-cormorant font-bold text-[#F4F1EC]">Create Client Account</h1>
          <p className="text-xs text-[#8A9AAF]">
            Register to place garment orders, request digital agency packages, and book advisory sessions.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-jakarta text-xs">
          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold tracking-wider mb-1">Full Name / Enterprise Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8A9AAF] absolute left-3 top-3" />
              <input
                {...register('name')}
                type="text"
                className="w-full pl-9 pr-4 py-2.5 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] focus:border-[#C8961E] outline-none"
                placeholder="Bethlehem Tadesse"
              />
            </div>
            {errors.name && <p className="text-[#C84B1A] text-[10px] mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A9AAF] absolute left-3 top-3" />
              <input
                {...register('email')}
                type="email"
                className="w-full pl-9 pr-4 py-2.5 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] focus:border-[#C8961E] outline-none"
                placeholder="client@company.com"
              />
            </div>
            {errors.email && <p className="text-[#C84B1A] text-[10px] mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold tracking-wider mb-1">Phone Number (Ethiopia / Global)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#8A9AAF] absolute left-3 top-3" />
              <input
                {...register('phone')}
                type="text"
                className="w-full pl-9 pr-4 py-2.5 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] focus:border-[#C8961E] outline-none"
                placeholder="+251 911 223 344"
              />
            </div>
            {errors.phone && <p className="text-[#C84B1A] text-[10px] mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold tracking-wider mb-1">Password</label>
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

          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold tracking-wider mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A9AAF] absolute left-3 top-3" />
              <input
                {...register('confirmPassword')}
                type="password"
                className="w-full pl-9 pr-4 py-2.5 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] focus:border-[#C8961E] outline-none"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="text-[#C84B1A] text-[10px] mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              {...register('acceptTerms')}
              className="mt-0.5 rounded accent-[#C8961E]"
            />
            <label htmlFor="terms" className="text-[11px] text-[#8A9AAF] leading-tight">
              I agree to Origin & Everlasting PLC commercial terms of service, payment proof verification workflows, and privacy policies.
            </label>
          </div>
          {errors.acceptTerms && <p className="text-[#C84B1A] text-[10px]">{errors.acceptTerms.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#C8961E] text-[#080A0F] rounded-xl font-bold uppercase tracking-wider hover:bg-[#C8961E]/90 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {isSubmitting ? 'Creating Account...' : <>Register Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="text-center text-xs text-[#8A9AAF]">
          Already have an account?{' '}
          <Link href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} className="text-[#C8961E] font-bold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080A0F] text-[#F4F1EC] flex items-center justify-center">Loading Sign Up...</div>}>
      <SignupContent />
    </Suspense>
  );
}
