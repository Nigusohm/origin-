'use client';

import React from 'react';
import Link from 'next/link';
import { Shirt, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/garment/ProductCard';
import { LookbookSlider } from '@/components/garment/LookbookSlider';
import { initialProducts } from '@/data/mockData';
import { Product } from '@/types';

interface GarmentHomeProps {
  products?: Product[];
}

export const GarmentHome: React.FC<GarmentHomeProps> = ({ products = initialProducts }) => {
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  return (
    <main data-division="bvibe" className="bg-[#0A0A0A] text-[#F5EEE4] min-h-screen">
      
      {/* Garment Division Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-20 bg-gradient-to-b from-[#0A0A0A] via-[#111318] to-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C84B1A_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C84B1A]/20 border border-[#C84B1A]/40 text-[#C84B1A] text-xs font-bold uppercase tracking-wider">
            <Shirt className="w-4 h-4" /> B-VIBE Garment Manufacturing & Fashion
          </div>

          <h1 className="text-4xl sm:text-6xl font-cormorant font-bold text-[#F5EEE4] tracking-wide">
            Modern Garment Manufacturing. <br />
            <span className="text-[#C84B1A]">Retail. Wholesale. Made in Ethiopia.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#8A9AAF] max-w-2xl mx-auto font-jakarta leading-relaxed">
            From handwoven Habesha silk dresses to bulk corporate uniform suites, B-VIBE delivers export-ready textile craftsmanship from our Addis Ababa industrial facility.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/garment/shop"
              className="px-8 py-3.5 bg-[#C84B1A] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#C84B1A]/90 shadow-xl shadow-[#C84B1A]/20 flex items-center gap-2"
            >
              Shop Apparel Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/garment/wholesale"
              className="px-8 py-3.5 border border-[#D4B896]/40 text-[#D4B896] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              B2B Wholesale Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections Grid */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C84B1A]">Curated Line</span>
            <h2 className="text-2xl sm:text-4xl font-cormorant font-bold text-[#F5EEE4] mt-1">Featured Collections</h2>
          </div>
          <Link
            href="/garment/shop"
            className="text-xs font-bold text-[#D4B896] hover:text-[#C84B1A] flex items-center gap-1"
          >
            View Full Store <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Interactive Lookbook Section */}
      <section className="bg-[#111318] py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-white/10">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#D4B896]">Visual Editorial</span>
            <h2 className="text-3xl sm:text-5xl font-cormorant font-bold text-[#F5EEE4] mt-2">
              Habesha Textile Craftsmanship Lookbook
            </h2>
          </div>
          <LookbookSlider />
        </div>
      </section>

    </main>
  );
};
