'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageSquare, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrderEnquiry } from '@/context/OrderEnquiryContext';
import { DivisionType } from '@/types';

function EnquireNewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { createEnquiry } = useOrderEnquiry();

  const title = searchParams.get('title') || 'Custom Scope Enquiry';
  const division = (searchParams.get('division') as DivisionType) || 'digital';

  const [message, setMessage] = useState('');
  const [fileAttachment, setFileAttachment] = useState('');
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone' | 'telegram'>('email');

  if (!user) {
    const returnUrl = `/enquire/new?${searchParams.toString()}`;
    return (
      <main className="min-h-screen bg-[#080A0F] text-[#F4F1EC] py-20 px-4 text-center space-y-4 font-jakarta">
        <h1 className="text-3xl font-cormorant font-bold">Authentication Required</h1>
        <p className="text-xs text-[#8A9AAF]">Please sign in to submit your enquiry for <strong>{title}</strong>.</p>
        <Link href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} className="inline-block px-6 py-3 bg-[#C8961E] text-[#080A0F] font-bold text-xs rounded-xl uppercase">
          Sign In & Submit Enquiry
        </Link>
      </main>
    );
  }

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEnquiry({
      type: 'enquiry',
      division,
      customer_id: user.id,
      customer_name: user.name,
      customer_email: user.email,
      customer_phone: user.phone,
      item_title: title,
      message,
      file_attachment: fileAttachment || undefined,
      preferred_contact: preferredContact,
      amount_due_etb: 0,
      amount_due_usd: 0,
    });
    router.push('/account?tab=enquiries');
  };

  return (
    <main data-division={division} className="bg-[#080A0F] text-[#F4F1EC] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-jakarta">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <Link href={`/${division}`} className="inline-flex items-center gap-1.5 text-xs text-[#8A9AAF] hover:text-[#C8961E]">
          <ArrowLeft className="w-4 h-4" /> Back to Division Portal
        </Link>

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8961E]">Service & Scope RFQ</span>
          <h1 className="text-3xl sm:text-4xl font-cormorant font-bold text-[#F4F1EC] mt-1">Enquire About Package</h1>
        </div>

        <form onSubmit={handleSubmitEnquiry} className="bg-[#111318] border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl">
          <div className="p-4 bg-[#080A0F] rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#C8961E]">{division} Division</span>
            <h3 className="text-xl font-bold text-[#F4F1EC]">{title}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Your Name</label>
              <input type="text" value={user.name} disabled className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC]" />
            </div>
            <div>
              <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Email</label>
              <input type="email" value={user.email} disabled className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC]" />
            </div>
          </div>

          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold text-xs mb-1">Project Brief / Enquiry Message</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe your organization's goals, timeline, and specific deliverables needed..."
              className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] text-xs focus:border-[#C8961E] outline-none"
            />
          </div>

          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold text-xs mb-1">Optional Reference Document / Brief URL</label>
            <input
              type="url"
              value={fileAttachment}
              onChange={e => setFileAttachment(e.target.value)}
              placeholder="https://drive.google.com/file/... or link to design brief"
              className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] text-xs"
            />
          </div>

          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold text-xs mb-2">Preferred Contact Method</label>
            <div className="flex gap-4 text-xs">
              {(['email', 'phone', 'telegram'] as const).map(method => (
                <label key={method} className="flex items-center gap-2 capitalize text-[#F4F1EC]">
                  <input
                    type="radio"
                    name="contact"
                    value={method}
                    checked={preferredContact === method}
                    onChange={() => setPreferredContact(method)}
                    className="accent-[#C8961E]"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#C8961E] text-[#080A0F] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#C8961E]/90 transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            <Send className="w-4 h-4" /> Submit Enquiry to Division Staff
          </button>
        </form>

      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080A0F] text-[#F4F1EC] flex items-center justify-center">Loading Form...</div>}>
      <EnquireNewContent />
    </Suspense>
  );
}
