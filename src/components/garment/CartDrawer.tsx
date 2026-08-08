'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, X, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const totalEtb = items.reduce((acc, item) => acc + item.product.price_etb * item.quantity, 0);
  const totalUsd = items.reduce((acc, item) => acc + item.product.price_usd * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Slide-In Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0A0A0A] border-l border-white/10 z-50 p-6 flex flex-col justify-between shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 font-bold font-jakarta text-base text-[#F5EEE4]">
                <ShoppingBag className="w-5 h-5 text-[#C84B1A]" /> Shopping Cart ({items.length})
              </div>
              <button onClick={onClose} className="p-1 rounded-lg text-[#8A9AAF] hover:text-[#F5EEE4]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12 text-[#8A9AAF]">
                  <ShoppingBag className="w-10 h-10 text-white/20 mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#F5EEE4]">Your cart is currently empty.</p>
                  <p className="text-xs mt-1">Browse B-VIBE collections to add items.</p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 bg-[#111318] p-3 rounded-xl border border-white/5 items-center justify-between"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-black">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#F5EEE4] truncate">{item.product.name}</h4>
                      <div className="text-[10px] text-[#8A9AAF] flex items-center gap-2 mt-0.5">
                        <span>Size: {item.selectedSize}</span>
                        <span className="flex items-center gap-1">
                          Color: <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.selectedColor.hex }} />
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#C84B1A] mt-1">
                        {(item.product.price_etb * item.quantity).toLocaleString()} ETB
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-[#8A9AAF] hover:text-[#C84B1A]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1 bg-[#0A0A0A] border border-white/10 rounded-lg px-2 py-0.5 text-xs text-[#F5EEE4]">
                        <button onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}>-</button>
                        <span className="px-1 font-bold">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(idx, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Button */}
            {items.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#8A9AAF]">
                  <span>Subtotal (ETB)</span>
                  <span className="text-sm font-bold text-[#F5EEE4]">{totalEtb.toLocaleString()} ETB</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#8A9AAF]">
                  <span>Subtotal (USD International)</span>
                  <span className="text-sm font-bold text-[#D4B896]">${totalUsd.toLocaleString()} USD</span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-[#06D6A0] bg-[#06D6A0]/10 p-2 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Chapa (ETB) & Stripe (USD) Encrypted Checkout</span>
                </div>

                <button
                  onClick={onProceedToCheckout}
                  className="w-full py-3.5 bg-[#C84B1A] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#C84B1A]/90 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
