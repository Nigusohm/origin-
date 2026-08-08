'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Lock } from 'lucide-react';
import { Resource } from '@/types';

interface ResourceCardProps {
  resource: Resource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  return (
    <div className="group bg-[#0C1420] border border-white/10 hover:border-[#C8961E]/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[#C8961E]/10 doc-fold-corner">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-[#C8961E]/15 text-[#C8961E] border border-[#C8961E]/30">
            {resource.type}
          </span>
          {resource.is_gated && (
            <span className="flex items-center gap-1 text-[10px] text-[#D4B896]">
              <Lock className="w-3 h-3 text-[#C8961E]" /> Executive Gated
            </span>
          )}
        </div>

        <Link
          href={`/consulting/resources/${resource.slug}`}
          className="text-base font-bold font-cormorant text-[#F0EDE8] group-hover:text-[#C8961E] transition-colors line-clamp-2"
        >
          {resource.title}
        </Link>

        <p className="text-xs text-[#8A9AAF] mt-2 line-clamp-3 leading-relaxed">
          {resource.excerpt}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20">
            <Image
              src={resource.author.avatar}
              alt={resource.author.name}
              fill
              sizes="24px"
              className="object-cover"
            />
          </div>
          <span className="text-[11px] text-[#8A9AAF]">{resource.author.name}</span>
        </div>

        <Link
          href={`/consulting/resources/${resource.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#C8961E] group-hover:translate-x-1 transition-transform"
        >
          Read Brief <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
