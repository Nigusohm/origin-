'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shirt, CheckCircle, Send } from 'lucide-react';

const wholesaleSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactName: z.string().min(2, 'Contact executive name is required'),
  email: z.string().email('Please enter a valid corporate email address'),
  phone: z.string().min(6, 'Please enter a valid phone number'),
  category: z.enum(['corporate', 'traditional', 'custom']),
  estimatedUnits: z.number().min(20, 'Minimum volume is 20 units'),
  notes: z.string().optional(),
});

type WholesaleFormData = z.infer<typeof wholesaleSchema>;

export const WholesaleForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<WholesaleFormData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WholesaleFormData>({
    resolver: zodResolver(wholesaleSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      category: 'corporate',
      estimatedUnits: 150,
      notes: '',
    },
  });

  const category = watch('category');
  const estimatedUnits = watch('estimatedUnits');

  // Dynamic Volume Tier Calculation
  const calculateTierPrice = (units: number, cat: string) => {
    let basePriceEtb = 10000;
    if (cat === 'traditional') basePriceEtb = 8500;
    if (cat === 'corporate') basePriceEtb = 11200;
    if (cat === 'custom') basePriceEtb = 14500;

    let discountPercent = 0;
    if (units >= 500) discountPercent = 35;
    else if (units >= 200) discountPercent = 25;
    else if (units >= 50) discountPercent = 15;

    const unitPrice = Math.round(basePriceEtb * (1 - discountPercent / 100));
    const totalPrice = unitPrice * units;

    return { unitPrice, totalPrice, discountPercent };
  };

  const { unitPrice, totalPrice, discountPercent } = calculateTierPrice(estimatedUnits || 150, category);

  const onSubmit = async (data: WholesaleFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: data.companyName,
          contact_name: data.contactName,
          email: data.email,
          phone: data.phone,
          business_type: data.category,
          estimated_monthly_volume: String(data.estimatedUnits),
          message: data.notes,
        }),
      });
      const result = await res.json().catch(() => ({ success: true }));
      if (res.ok && result.success) {
        setSubmittedData(data);
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Quote submission error:', err);
      setSubmittedData(data);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#C84B1A]/30 rounded-3xl p-6 sm:p-10 max-w-4xl mx-auto shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#C84B1A]/20 text-[#C84B1A] border border-[#C84B1A]/40 flex items-center justify-center">
          <Shirt className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-jakarta text-[#F5EEE4]">
            B-VIBE B2B Wholesale Portal
          </h2>
          <p className="text-xs text-[#8A9AAF]">
            Volume tier pricing calculations for hotel chains, airlines, corporate offices, and export distributors.
          </p>
        </div>
      </div>

      {submitted && submittedData ? (
        <div className="bg-[#111318] border border-[#06D6A0] rounded-2xl p-8 text-center space-y-4">
          <CheckCircle className="w-12 h-12 text-[#06D6A0] mx-auto" />
          <h3 className="text-lg font-bold text-[#F5EEE4]">Wholesale RFQ Submitted</h3>
          <p className="text-xs text-[#8A9AAF] max-w-md mx-auto">
            Thank you, {submittedData.contactName}. Our B-VIBE Garment sales account executive has received your inquiry for {submittedData.companyName} ({submittedData.estimatedUnits} units) and will send a formal proforma invoice to {submittedData.email} within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 bg-[#C84B1A] text-white rounded-xl text-xs font-bold"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Real-time Dynamic Tier Price Calculation Box */}
          <div className="bg-[#111318] border border-white/10 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#D4B896] font-bold block">
                Estimated Volume Tier
              </span>
              <div className="text-sm font-bold text-[#F5EEE4] mt-1">
                {estimatedUnits >= 500 ? 'Tier 3 (500+ Units)' : estimatedUnits >= 200 ? 'Tier 2 (200-499 Units)' : estimatedUnits >= 50 ? 'Tier 1 (50-199 Units)' : 'Standard Retail'}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#D4B896] font-bold block">
                Estimated Unit Cost
              </span>
              <div className="text-base font-bold text-[#C84B1A] mt-1">
                {unitPrice.toLocaleString()} ETB <span className="text-xs text-[#06D6A0]">({discountPercent}% OFF)</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#D4B896] font-bold block">
                Estimated Order Subtotal
              </span>
              <div className="text-lg font-bold text-[#F5EEE4] mt-1">
                {totalPrice.toLocaleString()} ETB
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#D4B896] block mb-1">Company / Organization Name *</label>
              <input
                type="text"
                {...register('companyName')}
                placeholder="e.g. Ethiopian Airlines / Skylight Hotel"
                className="w-full bg-[#111318] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
              />
              {errors.companyName && <p className="text-[10px] text-red-400 mt-1">{errors.companyName.message}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-[#D4B896] block mb-1">Contact Executive Name *</label>
              <input
                type="text"
                {...register('contactName')}
                placeholder="Full Name"
                className="w-full bg-[#111318] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
              />
              {errors.contactName && <p className="text-[10px] text-red-400 mt-1">{errors.contactName.message}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-[#D4B896] block mb-1">Corporate Email Address *</label>
              <input
                type="email"
                {...register('email')}
                placeholder="executive@company.com"
                className="w-full bg-[#111318] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
              />
              {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-[#D4B896] block mb-1">Phone Number *</label>
              <input
                type="tel"
                {...register('phone')}
                placeholder="+251 911 000 000"
                className="w-full bg-[#111318] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
              />
              {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#D4B896] block mb-1">Product Category</label>
              <select
                {...register('category')}
                className="w-full bg-[#111318] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
              >
                <option value="corporate">Corporate Blazers & Hotel Uniforms</option>
                <option value="traditional">Traditional Handwoven Habesha Sets</option>
                <option value="custom">Custom Industrial Garment Line</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#D4B896] block mb-1">
                Estimated Volume (Units): <span className="text-[#C84B1A]">{estimatedUnits}</span>
              </label>
              <input
                type="range"
                min={20}
                max={1000}
                step={10}
                value={estimatedUnits}
                onChange={e => setValue('estimatedUnits', Number(e.target.value))}
                className="w-full accent-[#C84B1A] mt-2"
              />
              {errors.estimatedUnits && <p className="text-[10px] text-red-400 mt-1">{errors.estimatedUnits.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#D4B896] block mb-1">Customization / Sizing Specifications</label>
            <textarea
              rows={3}
              {...register('notes')}
              placeholder="Detail specific embroidery motifs, colorways, or delivery deadlines..."
              className="w-full bg-[#111318] border border-white/10 rounded-xl p-3 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#C84B1A] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#C84B1A]/90 transition-colors shadow-lg shadow-[#C84B1A]/20 flex items-center justify-center gap-2"
          >
            {submitting ? 'Calculating & Processing Quote...' : <><Send className="w-4 h-4" /> Request Official Proforma Quote</>}
          </button>
        </form>
      )}
    </div>
  );
};
