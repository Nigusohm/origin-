'use client';

import React from 'react';
import { ProductGrid } from '@/components/garment/ProductGrid';
import { initialProducts } from '@/data/mockData';
import { Product } from '@/types';

interface GarmentShopProps {
  products?: Product[];
}

export const GarmentShop: React.FC<GarmentShopProps> = ({ products = initialProducts }) => {
  return (
    <main data-division="bvibe" className="bg-[#0A0A0A] text-[#F5EEE4] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#C84B1A]">B-VIBE Fashion Catalog</span>
          <h1 className="text-3xl sm:text-5xl font-cormorant font-bold text-[#F5EEE4] mt-1">Apparel Collection</h1>
          <p className="text-xs text-[#8A9AAF] mt-2">Filter by Habesha traditional, corporate blazers, mini-me sets, and custom orders.</p>
        </div>

        <ProductGrid products={products} />
      </div>
    </main>
  );
};
