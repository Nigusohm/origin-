'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrderEnquiry } from '@/context/OrderEnquiryContext';
import { DivisionType } from '@/types';

function OrderNewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { createOrder } = useOrderEnquiry();

  const title = searchParams.get('title') || 'Custom Garment Retail Order';
  const division = (searchParams.get('division') as DivisionType) || 'garment';
  const priceETB = Number(searchParams.get('priceETB')) || 14500;
  const priceUSD = Number(searchParams.get('priceUSD')) || 120;
  const size = searchParams.get('size') || 'M';
  const color = searchParams.get('color') || 'Ivory White';

  const [quantity, setQuantity] = useState(1);

  if (!user) {
    const returnUrl = `/order/new?${searchParams.toString()}`;
    return (
      <main className="min-h-screen bg-[#080A0F] text-[#F4F1EC] py-20 px-4 text-center space-y-4 font-jakarta">
        <h1 className="text-3xl font-cormorant font-bold">Authentication Required</h1>
        <p className="text-xs text-[#8A9AAF]">Please log in to continue placing your order for <strong>{title}</strong>.</p>
        <Link href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} className="inline-block px-6 py-3 bg-[#C8961E] text-[#080A0F] font-bold text-xs rounded-xl uppercase">
          Sign In & Complete Order
        </Link>
      </main>
    );
  }

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const newRecord = await createOrder({
        type: 'order',
        division,
        customer_id: user.id,
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone,
        item_title: title,
        quantity,
        variant_size: size,
        variant_color: color,
        amount_due_etb: priceETB * quantity,
        amount_due_usd: priceUSD * quantity,
      });
      router.push(`/payment/instructions/${newRecord.id}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <main data-division="garment" className="bg-[#0A0A0A] text-[#F5EEE4] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-jakarta">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <Link href="/garment/shop" className="inline-flex items-center gap-1.5 text-xs text-[#8A9AAF] hover:text-[#C84B1A]">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C84B1A]">Checkout Entry</span>
          <h1 className="text-3xl sm:text-4xl font-cormorant font-bold text-[#F5EEE4] mt-1">Confirm Your Order</h1>
        </div>

        <form onSubmit={handleConfirmOrder} className="bg-[#111318] border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl">
          <div className="p-4 bg-[#080A0F] rounded-2xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#C84B1A]">{division} division</span>
            <h3 className="text-xl font-bold text-[#F5EEE4]">{title}</h3>
            <div className="text-xs text-[#8A9AAF]">Size: {size} · Color: {color}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Customer Name</label>
              <input type="text" value={user.name} disabled className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F5EEE4]" />
            </div>
            <div>
              <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Email</label>
              <input type="email" value={user.email} disabled className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F5EEE4]" />
            </div>
          </div>

          <div>
            <label className="block text-[#8A9AAF] uppercase font-bold text-xs mb-1">Order Quantity</label>
            <input
              type="number"
              min={1}
              max={50}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F5EEE4]"
            />
          </div>

          <div className="p-4 bg-[#080A0F] rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase text-[#8A9AAF]">Total Amount Due</div>
              <div className="text-2xl font-bold text-[#C84B1A] font-mono-code">{(priceETB * quantity).toLocaleString()} ETB</div>
            </div>
            <div className="text-right text-xs font-bold text-[#D4B896]">
              ${priceUSD * quantity} USD Equivalent
            </div>
          </div>

          {submitError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#C84B1A] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#C84B1A]/90 transition-colors shadow-xl shadow-[#C84B1A]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating Order...' : 'Proceed to Division Payment Instructions →'}
          </button>
        </form>

      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080A0F] text-[#F4F1EC] flex items-center justify-center">Loading Order...</div>}>
      <OrderNewContent />
    </Suspense>
  );
}
