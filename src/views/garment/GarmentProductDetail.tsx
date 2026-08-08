'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowLeft, Star, ShieldCheck, Truck, Check } from 'lucide-react';
import { initialProducts } from '@/data/mockData';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ReviewBlock } from '@/components/shared/ReviewBlock';

interface GarmentProductDetailProps {
  slug?: string;
  products?: Product[];
}

export const GarmentProductDetail: React.FC<GarmentProductDetailProps> = ({ slug, products = initialProducts }) => {
  const { addToCart } = useCart();
  const product = products.find(p => p.slug === slug) || products[0];

  const [activeImage, setActiveImage] = useState(product.images[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Default', hex: '#FFFFFF' });
  const [activeTab, setActiveTab] = useState<'description' | 'size' | 'care' | 'shipping'>('description');
  const [addedToast, setAddedToast] = useState(false);

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <main data-division="bvibe" className="bg-[#0A0A0A] text-[#F5EEE4] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Back Link */}
        <Link href="/garment/shop" className="inline-flex items-center gap-1.5 text-xs text-[#8A9AAF] hover:text-[#C84B1A] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Apparel Catalog
        </Link>

        {/* Product Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#111318] border border-white/10 shadow-2xl relative">
              <Image src={activeImage} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-[#C84B1A] scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel Info */}
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4B896]">{product.category}</span>
              <h1 className="text-3xl sm:text-4xl font-cormorant font-bold text-[#F5EEE4] mt-1">{product.name}</h1>
              
              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center text-[#C8961E]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold ml-1">4.9</span>
                </div>
                <span className="text-[#8A9AAF]">(Verified Client Reviews)</span>
              </div>
            </div>

            <div className="p-4 bg-[#111318] border border-white/10 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8A9AAF]">Local ETB Price</span>
                <div className="text-2xl font-bold text-[#C84B1A] font-jakarta">{product.price_etb.toLocaleString()} ETB</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#8A9AAF]">USD Export Equivalent</span>
                <div className="text-xl font-bold text-[#D4B896]">${product.price_usd} USD</div>
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#D4B896] block mb-2">Color Variant: {selectedColor.name}</label>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${selectedColor.name === c.name ? 'border-[#C84B1A] scale-110' : 'border-white/20'}`}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#D4B896] block mb-2">Size Specification</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedSize === s ? 'bg-[#C84B1A] text-white border-[#C84B1A]' : 'bg-[#111318] border-white/10 text-[#8A9AAF]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAdd}
              className="w-full py-4 bg-[#C84B1A] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#C84B1A]/90 transition-colors shadow-xl shadow-[#C84B1A]/20 flex items-center justify-center gap-2"
            >
              {addedToast ? <><Check className="w-4 h-4" /> Added to Order Bag!</> : <><ShoppingBag className="w-4 h-4" /> Add to Order Bag</>}
            </button>
          </div>
        </div>

        <ReviewBlock productId={product.id} />

      </div>
    </main>
  );
};
