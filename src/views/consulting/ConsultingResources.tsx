'use client';

import React from 'react';
import { ResourceCard } from '@/components/consulting/ResourceCard';
import { initialResources } from '@/data/mockData';
import { Resource } from '@/types';

interface ConsultingResourcesProps {
  resources?: Resource[];
}

export const ConsultingResources: React.FC<ConsultingResourcesProps> = ({ resources = initialResources }) => {
  return (
    <main data-division="consulting" className="bg-[#080A0F] text-[#F0EDE8] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8961E]">Knowledge Repository</span>
          <h1 className="text-4xl sm:text-5xl font-cormorant font-bold text-[#F0EDE8] mt-1">Research & Whitepapers</h1>
          <p className="text-xs text-[#8A9AAF] mt-2">Executive briefs and strategic operational frameworks for the Ethiopian market.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map(res => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      </div>
    </main>
  );
};
