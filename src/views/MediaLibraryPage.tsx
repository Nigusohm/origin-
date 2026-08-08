'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, X, Download, Sparkles } from 'lucide-react';
import { initialMediaAssets } from '@/data/mockData';
import { MediaAsset } from '@/types';

interface MediaLibraryPageProps {
  assets?: MediaAsset[];
}

export const MediaLibraryPage: React.FC<MediaLibraryPageProps> = ({ assets }) => {
  const allAssets = assets && assets.length > 0 ? assets : initialMediaAssets;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeAsset, setActiveAsset] = useState<MediaAsset | null>(null);

  const categories = [
    { id: 'all', label: 'All Media Assets' },
    { id: 'garment', label: 'B-VIBE Fashion & Textiles' },
    { id: 'digital', label: 'Tˣ Creative Campaigns' },
    { id: 'consulting', label: 'Consulting Whitepapers & HQ' },
    { id: 'branding', label: 'Branding & Promotion' },
  ];

  const filteredAssets = allAssets.filter(
    asset => selectedCategory === 'all' || asset.division === selectedCategory || (selectedCategory === 'garment' && asset.division === 'bvibe') || (selectedCategory === 'digital' && asset.division === 'tx') || (selectedCategory === 'branding' && asset.division === 'branding')
  );

  return (
    <main data-division="corporate" className="bg-[#080A0F] text-[#F4F1EC] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8961E]">Asset Repository</span>
          <h1 className="text-4xl sm:text-5xl font-cormorant font-bold text-[#F4F1EC] mt-2">Unified Media Library</h1>
          <p className="text-xs text-[#8A9AAF] max-w-xl mx-auto mt-2 font-jakarta">
            High-resolution photography, editorial lookbooks, campaign assets, and corporate executive press materials across all 3 divisions.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#C8961E] text-[#080A0F] shadow-lg'
                  : 'bg-[#111318] text-[#8A9AAF] hover:text-[#F4F1EC] border border-white/10'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Masonry Image Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              onClick={() => setActiveAsset(asset)}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-[#111318] border border-white/10 cursor-pointer shadow-xl hover:border-[#C8961E]/50 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={asset.url}
                  alt={asset.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <span className="text-[10px] uppercase font-bold text-[#C8961E] tracking-wider">{asset.division}</span>
                <h4 className="text-sm font-bold text-white">{asset.title}</h4>
                <p className="text-[10px] text-[#8A9AAF] line-clamp-1 mt-0.5">{asset.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Overlay */}
        {activeAsset && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center">
            <div className="relative max-w-4xl w-full bg-[#111318] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
              <button
                onClick={() => setActiveAsset(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full md:w-2/3 aspect-[4/3] bg-black">
                <Image
                  src={activeAsset.url}
                  alt={activeAsset.title}
                  fill
                  sizes="66vw"
                  className="object-contain"
                />
              </div>

              <div className="p-6 md:w-1/3 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#C8961E] tracking-widest">{activeAsset.division}</span>
                  <h3 className="text-xl font-bold font-cormorant text-white mt-1">{activeAsset.title}</h3>
                  <p className="text-xs text-[#8A9AAF] mt-2 leading-relaxed">{activeAsset.caption}</p>
                </div>

                <a
                  href={activeAsset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#C8961E] text-[#080A0F] font-bold text-xs rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Download className="w-4 h-4" /> Download High-Res Asset
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};
