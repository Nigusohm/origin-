'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, CheckCircle2, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import { CartItem } from '@/types';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(6, 'Valid phone number is required'),
  addressLine: z.string().min(3, 'Address line is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  paymentMethod: z.enum(['chapa', 'stripe']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFlowProps {
  items: CartItem[];
  onBackToCart: () => void;
  onSuccess: (orderId: string) => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ items, onBackToCart, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      addressLine: '',
      city: 'Addis Ababa',
      country: 'Ethiopia',
      paymentMethod: 'chapa',
    },
  });

  const paymentMethod = watch('paymentMethod');

  const totalEtb = items.reduce((acc, item) => acc + item.product.price_etb * item.quantity, 0);
  const totalUsd = items.reduce((acc, item) => acc + item.product.price_usd * item.quantity, 0);

  const onCheckoutSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({ product_id: item.product.id, name: item.product.name, qty: item.quantity, size: item.selectedSize, color: item.selectedColor.name, price_etb: item.product.price_etb })),
          payment_method: data.paymentMethod,
          shipping: {
            name: data.fullName,
            email: data.email,
            phone: data.phone,
            address: { line1: data.addressLine, city: data.city, region: data.city, country: data.country },
          },
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Checkout could not be initialized');
      if (resData.checkout_url) {
        window.location.href = resData.checkout_url;
      } else {
        onSuccess(resData.order_id);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout could not be initialized. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <button
          onClick={onBackToCart}
          className="text-xs text-[#8A9AAF] hover:text-[#F5EEE4] flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>
        <div className="text-xs font-bold uppercase tracking-wider text-[#C84B1A]">
          Encrypted Checkout
        </div>
      </div>

      <form onSubmit={handleSubmit(onCheckoutSubmit)} className="space-y-6">
        {/* Shipping Information */}
        <div>
          <h3 className="text-sm font-bold text-[#F5EEE4] uppercase tracking-wider mb-3">1. Shipping Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#8A9AAF] block mb-1">Full Name *</label>
              <input
                type="text"
                {...register('fullName')}
                placeholder="Abebe Bikila"
                className="w-full bg-[#111318] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
              />
              {errors.fullName && <p className="text-[10px] text-red-400 mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="text-xs text-[#8A9AAF] block mb-1">Email Address *</label>
              <input
                type="email"
                {...register('email')}
                placeholder="abebe@example.com"
                className="w-full bg-[#111318] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
              />
              {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-xs text-[#8A9AAF] block mb-1">Phone Number *</label>
              <input
                type="tel"
                {...register('phone')}
                placeholder="+251 911 234 567"
                className="w-full bg-[#111318] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
              />
              {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="text-xs text-[#8A9AAF] block mb-1">Address Line *</label>
              <input
                type="text"
                {...register('addressLine')}
                placeholder="Bole Road, House #402"
                className="w-full bg-[#111318] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
              />
              {errors.addressLine && <p className="text-[10px] text-red-400 mt-1">{errors.addressLine.message}</p>}
            </div>
            <div>
              <label className="text-xs text-[#8A9AAF] block mb-1">City *</label>
              <input
                type="text"
                {...register('city')}
                className="w-full bg-[#111318] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
              />
              {errors.city && <p className="text-[10px] text-red-400 mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="text-xs text-[#8A9AAF] block mb-1">Country *</label>
              <input
                type="text"
                {...register('country')}
                className="w-full bg-[#111318] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5EEE4] focus:outline-none focus:border-[#C84B1A]"
              />
              {errors.country && <p className="text-[10px] text-red-400 mt-1">{errors.country.message}</p>}
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div>
          <h3 className="text-sm font-bold text-[#F5EEE4] uppercase tracking-wider mb-3">2. Select Payment Gateway</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setValue('paymentMethod', 'chapa')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'chapa'
                  ? 'bg-[#C84B1A]/10 border-[#C84B1A]'
                  : 'bg-[#111318] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-[#F5EEE4]">Chapa Ethiopia (ETB)</span>
                <CheckCircle2 className={`w-4 h-4 ${paymentMethod === 'chapa' ? 'text-[#C84B1A]' : 'text-white/20'}`} />
              </div>
              <p className="text-[10px] text-[#8A9AAF]">Telebirr, CBE Birr, Awash, & Ethiopian Bank Debit Cards.</p>
              <div className="text-xs font-bold text-[#C84B1A] mt-2">{totalEtb.toLocaleString()} ETB</div>
            </div>

            <div
              onClick={() => setValue('paymentMethod', 'stripe')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'stripe'
                  ? 'bg-[#2563EB]/10 border-[#2563EB]'
                  : 'bg-[#111318] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-[#F5EEE4]">Stripe International (USD)</span>
                <CheckCircle2 className={`w-4 h-4 ${paymentMethod === 'stripe' ? 'text-[#2563EB]' : 'text-white/20'}`} />
              </div>
              <p className="text-[10px] text-[#8A9AAF]">Visa, Mastercard, Apple Pay & Global USD Cards.</p>
              <div className="text-xs font-bold text-[#D4B896] mt-2">${totalUsd.toLocaleString()} USD</div>
            </div>
          </div>
        </div>

        {/* Security badge & submit button */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#06D6A0]">
            <ShieldCheck className="w-4 h-4" />
            <span>256-bit Bank Grade Encrypted Transaction</span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 bg-[#C84B1A] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#C84B1A]/90 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Redirecting to Payment Gateway...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Pay Now ({paymentMethod === 'chapa' ? `${totalEtb.toLocaleString()} ETB` : `$${totalUsd} USD`})
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
