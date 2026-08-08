'use client';

import React from 'react';
import { Sparkles, Megaphone, Video, Share2, Cpu, LineChart } from 'lucide-react';

export const DigitalServices: React.FC = () => {
  const services = [
    {
      icon: Sparkles,
      title: 'Brand Identity & Visual System',
      desc: 'Comprehensive logo suites, typography guidelines, and localized brand toolkits for East African markets.',
    },
    {
      icon: Video,
      title: 'Short-Form Video Production',
      desc: 'In-house Addis production team generating viral TikTok, Instagram Reels, and YouTube Shorts.',
    },
    {
      icon: Share2,
      title: 'Telegram Growth Engine',
      desc: 'Custom bot development, channel subscriber acquisition, and broadcast content automation.',
    },
    {
      icon: Cpu,
      title: 'Generative AI Asset Pipelines',
      desc: 'Custom-trained Gemini model image generators for rapid campaign visual variation at scale.',
    },
    {
      icon: Megaphone,
      title: 'Performance Paid Ads',
      desc: 'Targeted Facebook, Instagram, Google, and TikTok paid campaigns with daily conversion tracking.',
    },
    {
      icon: LineChart,
      title: 'Executive Analytics Dashboards',
      desc: 'Real-time client reporting portals tracking impression volume, ROI, and audience sentiment.',
    },
  ];

  return (
    <main data-division="tx" className="bg-[#060810] text-[#F8FAFC] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <span className="text-xs font-mono-code uppercase text-[#06D6A0]">Capabilities</span>
          <h1 className="text-4xl sm:text-5xl font-cormorant font-bold text-[#F8FAFC] mt-2">Tˣ Agency Services</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className="bg-[#111318] border border-white/10 p-8 rounded-3xl hover:border-[#2563EB] transition-colors space-y-4">
              <s.icon className="w-8 h-8 text-[#2563EB]" />
              <h3 className="text-xl font-bold font-jakarta text-[#F8FAFC]">{s.title}</h3>
              <p className="text-xs text-[#8A9AAF] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
