'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Check, ArrowRight, Layers, DollarSign, Send, Zap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useOrderEnquiry } from '@/context/OrderEnquiryContext';

const configuratorModalSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactName: z.string().min(2, 'Executive name is required'),
  contactEmail: z.string().email('Valid corporate email address is required'),
});

type ConfiguratorModalData = z.infer<typeof configuratorModalSchema>;

export const ServiceConfigurator: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { createEnquiry } = useOrderEnquiry();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBasePackage, setSelectedBasePackage] = useState<'starter' | 'growth' | 'enterprise'>('growth');
  const [addons, setAddons] = useState<string[]>(['video', 'ai-assets']);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfiguratorModalData>({
    resolver: zodResolver(configuratorModalSchema),
  });

  const basePackages = [
    {
      id: 'starter',
      name: 'Starter Brand Engine',
      tagline: 'Ideal for early-stage startups & local retail brands',
      minPrice: 2500,
      maxPrice: 4000,
      timeline: '2–3 Weeks',
      features: [
        'Brand Identity Guidelines & Logo Package',
        'Social Media Templates (12 Posts)',
        'Telegram Channel Setup & Onboarding',
        'Basic Analytics Reporting',
      ],
    },
    {
      id: 'growth',
      name: 'Growth Performance Suite',
      tagline: 'Designed for scaling enterprises seeking national reach',
      minPrice: 6500,
      maxPrice: 10000,
      timeline: '4–6 Weeks',
      features: [
        'Full Brand Identity + Motion Graphics Pack',
        'TikTok & Facebook Paid Ad Campaigns',
        'Localized Amharic & English Copywriting',
        'Telegram Growth & Influencer Strategy',
        'Bi-Weekly ROI & Attribution Dashboard',
      ],
    },
    {
      id: 'enterprise',
      name: 'Omnichannel Enterprise Takeover',
      tagline: 'Comprehensive digital agency retainer for industry leaders',
      minPrice: 15000,
      maxPrice: 25000,
      timeline: 'Custom Retainer',
      features: [
        'Custom Gemini Model Generative AI Asset Pipelines',
        'Full Video Production Team on Retainer',
        'Dedicated Campaign Strategist & Media Buyer',
        'Real-time Executive Dashboard Access',
        'Priority 24/7 SLA Support',
      ],
    },
  ];

  const availableAddons = [
    { id: 'video', name: 'Dedicated Short-Form Video Sprints', price: 1500 },
    { id: 'ai-assets', name: 'Generative AI Visual Model Training', price: 2000 },
    { id: 'telegram-bot', name: 'Custom Telegram E-Commerce Bot', price: 1200 },
    { id: 'pr-release', name: 'Regional Press Release Distribution', price: 800 },
  ];

  const selectedPkgObj = basePackages.find(p => p.id === selectedBasePackage)!;
  const addonTotal = addons.reduce((sum, addId) => {
    const item = availableAddons.find(a => a.id === addId);
    return sum + (item ? item.price : 0);
  }, 0);

  const estimatedMin = selectedPkgObj.minPrice + addonTotal;
  const estimatedMax = selectedPkgObj.maxPrice + addonTotal;

  const toggleAddon = (id: string) => {
    if (addons.includes(id)) {
      setAddons(addons.filter(a => a !== id));
    } else {
      setAddons([...addons, id]);
    }
  };

  const handleOpenEnquire = () => {
    const title = `Tˣ Package: ${selectedPkgObj.name}`;
    const enquireUrl = `/enquire/new?title=${encodeURIComponent(title)}&division=digital`;

    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent(enquireUrl)}`);
    } else {
      router.push(enquireUrl);
    }
  };

  const onSubmitModal = async (data: ConfiguratorModalData) => {
    if (user) {
      await createEnquiry({
        type: 'enquiry',
        division: 'digital',
        customer_id: user.id,
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone,
        item_title: `Tˣ Custom Configured Scope: ${selectedPkgObj.name}`,
        message: `Company: ${data.companyName}. Selected Addons: ${addons.join(', ')}. Estimated Range: $${estimatedMin} - $${estimatedMax} USD.`,
        amount_due_etb: Math.round(estimatedMin * 120),
        amount_due_usd: estimatedMin,
      });
    }
    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      router.push('/account?tab=enquiries');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 font-jakarta">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-[#06D6A0] text-xs font-mono-code">
          <Sparkles className="w-3.5 h-3.5" /> Interactive Agency Scope Builder
        </div>
        <h2 className="text-3xl sm:text-5xl font-cormorant font-bold text-slate-900 dark:text-[#F8FAFC]">
          Tailor Your Tˣ Digital Media Package
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8A9AAF] max-w-xl mx-auto">
          Select your core growth tier, toggle modular add-on capabilities, and calculate transparent project investment ranges in real time.
        </p>
      </div>

      {/* Main Configurator Container */}
      <div className="bg-white dark:bg-[#0D1322] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
        
        {/* Step Indicator Bar */}
        <div className="grid grid-cols-3 gap-2 border-b border-slate-100 dark:border-white/10 pb-6 text-center">
          <button
            onClick={() => setStep(1)}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              step === 1
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#8A9AAF]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/20 text-[10px] flex items-center justify-center">1</span> Core Tier
          </button>

          <button
            onClick={() => setStep(2)}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              step === 2
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#8A9AAF]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/20 text-[10px] flex items-center justify-center">2</span> Add-ons
          </button>

          <button
            onClick={() => setStep(3)}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              step === 3
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#8A9AAF]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/20 text-[10px] flex items-center justify-center">3</span> Proposal Summary
          </button>
        </div>

        {/* Step 1: Base Tier Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">1. Select Base Agency Package Tier</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {basePackages.map(pkg => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedBasePackage(pkg.id as any)}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                    selectedBasePackage === pkg.id
                      ? 'bg-blue-50/50 dark:bg-[#111318] border-blue-600 dark:border-[#2563EB] shadow-lg ring-2 ring-blue-500/20'
                      : 'bg-slate-50 dark:bg-[#060810] border-slate-200 dark:border-white/10 hover:border-blue-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-mono-code text-blue-600 dark:text-[#06D6A0] font-bold">
                        {pkg.timeline}
                      </span>
                      {selectedBasePackage === pkg.id && (
                        <Check className="w-4 h-4 text-blue-600 dark:text-[#06D6A0]" />
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">{pkg.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-[#8A9AAF]">{pkg.tagline}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2">
                    <div className="text-xs text-slate-500 dark:text-[#8A9AAF]">Base Investment:</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">
                      ${pkg.minPrice.toLocaleString()} – ${pkg.maxPrice.toLocaleString()} <span className="text-xs text-slate-500 font-normal">USD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md"
              >
                Continue to Add-on Selection <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Addon Capabilities */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">2. Customize Modular Add-on Capabilities</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableAddons.map(add => {
                const isSelected = addons.includes(add.id);
                return (
                  <div
                    key={add.id}
                    onClick={() => toggleAddon(add.id)}
                    className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-blue-50/50 dark:bg-[#111318] border-blue-600 dark:border-[#2563EB]'
                        : 'bg-slate-50 dark:bg-[#060810] border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-white/20'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">{add.name}</span>
                    </div>
                    <span className="text-xs font-mono-code font-bold text-blue-600 dark:text-[#06D6A0]">
                      +${add.price} USD
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-[#8A9AAF] rounded-xl text-xs font-bold"
              >
                Back to Core Tier
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md"
              >
                Generate Proposal Summary <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Proposal Summary & Direct Action */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">3. Custom Proposal Investment Estimate</h3>

            <div className="p-6 bg-slate-50 dark:bg-[#060810] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <span className="text-xs text-slate-600 dark:text-[#8A9AAF]">Selected Base Tier:</span>
                <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">{selectedPkgObj.name}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <span className="text-xs text-slate-600 dark:text-[#8A9AAF]">Active Add-ons:</span>
                <span className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                  {addons.length > 0 ? `${addons.length} Modules Selected` : 'None'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs text-slate-600 dark:text-[#8A9AAF] uppercase font-bold block">Estimated Investment</span>
                  <div className="text-2xl font-bold text-blue-600 dark:text-[#06D6A0] font-mono-code">
                    ${estimatedMin.toLocaleString()} – ${estimatedMax.toLocaleString()} USD
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 dark:text-[#8A9AAF] block">ETB Equivalent Estimate</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC] font-mono-code">
                    ~{(estimatedMin * 120).toLocaleString()} ETB
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleOpenEnquire}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" /> Enquire About This Package (Locks Intent & Returns)
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="py-4 px-6 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-[#F8FAFC] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Quick Email Quote Request
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Quick Modal Fallback */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0D1322] border border-slate-200 dark:border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#06D6A0] mx-auto" />
                  <h4 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">Scope Proposal Generated!</h4>
                  <p className="text-xs text-slate-600 dark:text-[#8A9AAF]">
                    Your customized Tˣ agency scope quote has been created and saved to your customer enquiries dashboard.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmitModal)} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                    <h4 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">Request Executive Proposal</h4>
                    <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 dark:text-[#8A9AAF] block mb-1">Company Name *</label>
                    <input
                      type="text"
                      {...register('companyName')}
                      placeholder="Ethiopian Enterprise Ltd."
                      className="w-full bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                    />
                    {errors.companyName && <p className="text-[10px] text-red-400 mt-1">{errors.companyName.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 dark:text-[#8A9AAF] block mb-1">Executive Name *</label>
                    <input
                      type="text"
                      {...register('contactName')}
                      placeholder="Full Name"
                      className="w-full bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                    />
                    {errors.contactName && <p className="text-[10px] text-red-400 mt-1">{errors.contactName.message}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 dark:text-[#8A9AAF] block mb-1">Email Address *</label>
                    <input
                      type="email"
                      {...register('contactEmail')}
                      placeholder="executive@company.com"
                      className="w-full bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                    />
                    {errors.contactEmail && <p className="text-[10px] text-red-400 mt-1">{errors.contactEmail.message}</p>}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-[#8A9AAF] rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#1D4ED8] dark:bg-[#2563EB] text-white rounded-xl text-xs font-bold shadow-lg"
                    >
                      Send Request
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
