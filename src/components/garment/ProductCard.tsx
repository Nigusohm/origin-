'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Default', hex: '#FFFFFF' });
  const [selectedSize] = useState(product.sizes[0] || 'M');
  const { addToCart } = useCart();

  const mainImg = product.images[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000';
  const secondImg = product.images[1] || mainImg;

  const orderUrl = `/order/new?title=${encodeURIComponent(product.name)}&priceETB=${product.price_etb}&priceUSD=${product.price_usd}&size=${selectedSize}&color=${encodeURIComponent(selectedColor.name)}&division=garment`;

  const cleanDescription = (product.description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white dark:bg-[#0A0A0A] border border-amber-200/60 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#B83E10] dark:hover:border-[#C84B1A]/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-amber-500/10"
    >
      {/* Product Image & Hover Action Overlay */}
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-[#111318]">
        <Image
          src={hovered ? secondImg : mainImg}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {product.is_wholesale && (
          <span className="absolute top-3 left-3 bg-[#B83E10] dark:bg-[#C84B1A] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10">
            Wholesale Available
          </span>
        )}

        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-[#C84B1A] transition-colors opacity-0 group-hover:opacity-100 z-10"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* Quick Add Slide-Up Bar */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-2 z-10">
          <button
            onClick={() => addToCart(product, selectedSize, selectedColor)}
            className="w-1/2 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Cart
          </button>
          <Link
            href={orderUrl}
            className="w-1/2 py-2.5 rounded-xl bg-[#C84B1A] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-[#C84B1A]/90 transition-colors shadow-lg"
          >
            Order Now <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-[#0A0A0A]">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#B83E10] dark:text-[#D4B896] font-semibold mb-1">
            {product.category}
          </div>
          <Link
            href={`/garment/shop/${product.slug}`}
            className="text-sm font-bold font-jakarta text-slate-900 dark:text-[#F5EEE4] hover:text-[#B83E10] dark:hover:text-[#C84B1A] transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          <p className="text-xs text-slate-600 dark:text-[#8A9AAF] mt-1 line-clamp-2">{cleanDescription}</p>
        </div>

        {/* Colors & Price */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {product.colors.map((c, i) => (
              <button
                key={i}
                onClick={() => setSelectedColor(c)}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  selectedColor.name === c.name ? 'scale-125 border-[#B83E10] dark:border-[#C84B1A]' : 'border-slate-300 dark:border-white/20'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-slate-900 dark:text-[#F5EEE4]">
              {product.price_etb.toLocaleString()} ETB
            </div>
            <div className="text-[10px] text-slate-500 dark:text-[#8A9AAF]">
              (~${product.price_usd} USD)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
