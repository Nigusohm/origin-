'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { DiscussionThread } from '@/components/consulting/DiscussionThread';
import { initialResources } from '@/data/mockData';
import { Resource } from '@/types';

interface ConsultingResourceDetailProps {
  slug?: string;
  resources?: Resource[];
}

export const ConsultingResourceDetail: React.FC<ConsultingResourceDetailProps> = ({ slug, resources = initialResources }) => {
  const resource = resources.find(r => r.slug === slug) || resources[0];

  return (
    <main data-division="consulting" className="bg-[#080A0F] text-[#F0EDE8] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <Link href="/consulting/resources" className="inline-flex items-center gap-1.5 text-xs text-[#8A9AAF] hover:text-[#C8961E]">
          <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
        </Link>

        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-[#C8961E]/20 text-[#C8961E]">
              {resource.type}
            </span>
            <span className="text-xs text-[#8A9AAF]">{resource.published_at}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-cormorant font-bold text-[#F0EDE8]">{resource.title}</h1>
          
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C8961E]">
              <Image src={resource.author.avatar} alt={resource.author.name} fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#F0EDE8]">{resource.author.name}</div>
              <div className="text-[10px] text-[#8A9AAF]">{resource.author.role}</div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-[#0C1420] border border-white/10 p-8 rounded-3xl space-y-6 font-jakarta text-sm text-[#8A9AAF] leading-relaxed doc-fold-corner">
          <p className="text-base text-[#F0EDE8] font-serif font-semibold italic border-l-2 border-[#C8961E] pl-4">
            {resource.excerpt}
          </p>

          <p>
            As Ethiopian enterprise markets undergo rapid modernization, local data sovereignty and hybrid AI pipelines represent critical competitive advantages.
          </p>

          <div className="bg-[#111318] p-4 rounded-2xl border border-[#C8961E]/30 text-xs text-[#F0EDE8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C8961E]" />
              <span>Full Executive Whitepaper Briefing Document (PDF)</span>
            </div>
            <button className="px-4 py-2 bg-[#C8961E] text-[#080A0F] font-bold rounded-xl text-xs flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
        </div>

        {/* Discussion Thread Component */}
        <DiscussionThread resourceId={resource.id} />

      </div>
    </main>
  );
};
