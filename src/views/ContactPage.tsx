'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Send, CheckCircle2, Building2, Shirt, Sparkles, AlertCircle } from 'lucide-react';
import { TripleBarDivider } from '@/components/corporate/TripleBarDivider';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  division: z.enum(['corporate', 'garment', 'digital', 'consulting', 'branding']),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactPage: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      division: 'corporate',
    },
  });

  const selectedDivision = watch('division');

  const onContactSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, division: data.division === 'garment' ? 'bvibe' : data.division === 'digital' ? 'tx' : data.division === 'corporate' ? 'general' : data.division }),
      });

      const resData = await res.json().catch(() => ({ success: true, inquiryId: `INQ_${Date.now()}` }));
      if (res.ok && resData.success !== false) {
        setSubmitted(true);
        setInquiryId(resData.inquiryId || `INQ_${Date.now()}`);
      } else {
        setErrorMessage(resData.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setErrorMessage('Unable to submit your inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main data-division="corporate" className="bg-[#080A0F] text-[#F4F1EC] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8961E]">Corporate Communications</span>
          <h1 className="text-4xl sm:text-5xl font-cormorant font-bold text-[#F4F1EC] mt-2">Central Contact Hub</h1>
          <TripleBarDivider className="my-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* HQ Details Card */}
          <div className="bg-[#111318] border border-white/10 rounded-3xl p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-cormorant text-[#F4F1EC]">Headquarters Address</h3>
              <p className="text-xs text-[#8A9AAF] flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C8961E] shrink-0 mt-0.5" />
                <span>Bole Sub City, Woreda 03, Addis Ababa, Ethiopia</span>
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <h3 className="text-xs font-bold text-[#D4B896] uppercase">Direct Division Routing</h3>
              <ul className="space-y-3 text-xs text-[#8A9AAF]">
                <li className="flex items-center gap-2">
                  <Shirt className="w-4 h-4 text-[#C84B1A]" />
                  <span>garment@origineverlasting.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2563EB]" />
                  <span>tx.digital@origineverlasting.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#C8961E]" />
                  <span>advisory@origineverlasting.com</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-[#8A9AAF]">
              <Phone className="w-4 h-4 text-[#C8961E] inline-block mr-2" />
              +251 911 000 000 / +251 116 000 000
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-[#111318] border border-[#C8961E]/30 rounded-3xl p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-[#06D6A0] mx-auto" />
                <h3 className="text-2xl font-bold font-cormorant text-[#F4F1EC]">Inquiry Dispatched</h3>
                <p className="text-xs text-[#8A9AAF] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to Origin & Everlasting Trading PLC. Your inquiry reference ID is <strong className="text-[#C8961E] font-mono-code">{inquiryId}</strong>. Our divisional team will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-[#C8961E] text-[#080A0F] font-bold rounded-xl text-xs"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-6">
                
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#C8961E] block mb-2">Select Target Division</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'corporate', label: 'Corporate HQ' },
                      { id: 'garment', label: 'B-VIBE Garment' },
                      { id: 'digital', label: 'Tˣ Digital' },
                      { id: 'consulting', label: 'Strategy Advisory' },
                      { id: 'branding', label: 'Branding' },
                    ].map(div => (
                      <button
                        key={div.id}
                        type="button"
                        onClick={() => setValue('division', div.id as any)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          selectedDivision === div.id
                            ? 'bg-[#C8961E]/20 border-[#C8961E] text-[#F4F1EC]'
                            : 'bg-[#080A0F] border-white/10 text-[#8A9AAF] hover:border-white/20'
                        }`}
                      >
                        {div.label}
                      </button>
                    ))}
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#D4B896] block mb-1">Full Name *</label>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="Your Name"
                      className="w-full bg-[#080A0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F4F1EC] focus:outline-none focus:border-[#C8961E]"
                    />
                    {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-[#D4B896] block mb-1">Email Address *</label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="executive@company.com"
                      className="w-full bg-[#080A0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F4F1EC] focus:outline-none focus:border-[#C8961E]"
                    />
                    {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#D4B896] block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="+251 911 000 000"
                      className="w-full bg-[#080A0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F4F1EC] focus:outline-none focus:border-[#C8961E]"
                    />
                    {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-[#D4B896] block mb-1">Subject *</label>
                    <input
                      type="text"
                      {...register('subject')}
                      placeholder="Inquiry Topic"
                      className="w-full bg-[#080A0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F4F1EC] focus:outline-none focus:border-[#C8961E]"
                    />
                    {errors.subject && <p className="text-[10px] text-red-400 mt-1">{errors.subject.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#D4B896] block mb-1">Inquiry Details *</label>
                  <textarea
                    rows={4}
                    {...register('message')}
                    placeholder="Describe your inquiry or partnership proposal..."
                    className="w-full bg-[#080A0F] border border-white/10 rounded-xl p-3 text-xs text-[#F4F1EC] focus:outline-none focus:border-[#C8961E]"
                  />
                  {errors.message && <p className="text-[10px] text-red-400 mt-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#C8961E] text-[#080A0F] font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#C8961E]/90 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  {submitting ? 'Dispatching Message...' : <><Send className="w-4 h-4" /> Send Corporate Message</>}
                </button>

              </form>
            )}
          </div>

        </div>

      </div>
    </main>
  );
};
