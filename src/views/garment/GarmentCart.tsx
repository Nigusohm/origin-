'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { CheckoutFlow } from '@/components/garment/CheckoutFlow';
import { useCart } from '@/context/CartContext';

export const GarmentCart: React.FC = () => {
  const { cart: items, clearCart } = useCart();
  const [orderCompletedId, setOrderCompletedId] = useState<string | null>(null);

  if (orderCompletedId) {
    return (
      <main data-division="bvibe" className="bg-[#0A0A0A] text-[#F5EEE4] min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="bg-[#111318] border border-[#06D6A0] p-8 rounded-3xl max-w-md text-center space-y-4 shadow-2xl">
          <CheckCircle className="w-12 h-12 text-[#06D6A0] mx-auto" />
          <h1 className="text-2xl font-bold font-cormorant text-[#F5EEE4]">Order Confirmed!</h1>
          <p className="text-xs text-[#8A9AAF]">
            Thank you for shopping with B-VIBE Garment. Your reference order number is <strong>#{orderCompletedId}</strong>. A receipt and tracking summary have been dispatched to your email.
          </p>
          <Link
            href="/garment/shop"
            onClick={clearCart}
            className="inline-block px-6 py-2.5 bg-[#C84B1A] text-white font-bold rounded-xl text-xs uppercase"
          >
            Return to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main data-division="bvibe" className="bg-[#0A0A0A] text-[#F5EEE4] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C84B1A]">B-VIBE Checkout</span>
          <h1 className="text-3xl sm:text-4xl font-cormorant font-bold text-[#F5EEE4] mt-1">Complete Your Order</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#111318] border border-white/10 rounded-2xl p-12 text-center text-[#8A9AAF] space-y-4">
            <ShoppingBag className="w-12 h-12 text-white/20 mx-auto" />
            <p className="text-sm font-bold text-[#F5EEE4]">Your cart is currently empty.</p>
            <Link
              href="/garment/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C84B1A] text-white font-bold rounded-xl text-xs uppercase"
            >
              <ArrowLeft className="w-4 h-4" /> Browse Apparel Catalog
            </Link>
          </div>
        ) : (
          <CheckoutFlow
            items={items}
            onBackToCart={() => {}}
            onSuccess={(orderId) => {
              setOrderCompletedId(orderId);
              clearCart();
            }}
          />
        )}
      </div>
    </main>
  );
};
