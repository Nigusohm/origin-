'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shirt, Sparkles, Building2, GraduationCap, CheckCircle2, Cpu, Layers } from 'lucide-react';
import { AnimatedSection } from '../shared/AnimatedSection';

export const DivisionsGrid: React.FC = () => {
  return (
    <div className="bg-[#080A0F] py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 space-y-24">
      
      {/* Strategic Objectives Section */}
      <section className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#C8961E]">
            Corporate Strategy & Core Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-cormorant font-bold text-[#F4F1EC] mt-3">
            Strategic Enterprise Objectives
          </h2>
          <p className="text-sm text-[#8A9AAF] mt-4 font-jakarta">
            Origin & Everlasting Trading PLC establishes an integrated operational framework connecting industrial manufacturing, creative digital media, and management consulting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Layers className="w-6 h-6 text-[#C8961E]" />,
              title: 'Unified Authority',
              desc: 'One master corporate brand governing three high-performing commercial divisions with shared infrastructure.'
            },
            {
              icon: <Shirt className="w-6 h-6 text-[#C84B1A]" />,
              title: 'e-Commerce Pipeline',
              desc: 'Dual-currency (ETB Chapa & USD Stripe) retail and B2B wholesale order processing for international exports.'
            },
            {
              icon: <Sparkles className="w-6 h-6 text-[#2563EB]" />,
              title: 'Automated Lead Capture',
              desc: 'Interactive scope configurators, instant package cost estimation, and CRM lead routing.'
            },
            {
              icon: <Cpu className="w-6 h-6 text-[#06D6A0]" />,
              title: 'Interactive Advisory',
              desc: 'Real-time consulting booking calendar with atomic concurrency check and AI assistance.'
            }
          ].map((obj, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="bg-[#111318] border border-white/10 rounded-xl p-6 h-full hover:border-[#C8961E]/40 transition-colors">
                <div className="p-3 bg-white/5 rounded-lg w-fit mb-4">{obj.icon}</div>
                <h3 className="text-lg font-bold font-jakarta text-[#F4F1EC]">{obj.title}</h3>
                <p className="text-xs text-[#8A9AAF] mt-2 leading-relaxed">{obj.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Alternating Division Highlights */}
      <section className="max-w-7xl mx-auto space-y-20">
        
        {/* Division 1 Highlight: B-VIBE Garment */}
        <AnimatedSection>
          <div className="division-panel grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#0A0A0A] border border-[#C84B1A]/30 rounded-3xl p-8 sm:p-12 overflow-hidden relative">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C84B1A]/20 text-[#C84B1A] text-xs font-bold uppercase tracking-wider">
                <Shirt className="w-3.5 h-3.5" /> Division 01 — B-VIBE Garment
              </div>
              <h2 className="text-3xl sm:text-4xl font-cormorant font-bold text-[#F5EEE4]">
                Modern Ethiopian Textile Manufacturing & Fashion Retail
              </h2>
              <p className="text-sm text-[#8A9AAF] leading-relaxed">
                Combining heritage Ethiopian handweaving with industrial garment precision. Supplying bespoke Habesha apparel, corporate hotel/airline uniform suites, and high-volume B2B wholesale orders.
              </p>
              <ul className="space-y-3 text-xs text-[#E2DDD6]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C84B1A]" />
                  <span>Handspun Ethiopian cotton Habesha Kemis with metallic Tibeb threading</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C84B1A]" />
                  <span>B2B Wholesale Portal with automated volume tier pricing (50 to 500+ units)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C84B1A]" />
                  <span>Dual payment options: Ethiopian Birr (Chapa) and International USD (Stripe)</span>
                </li>
              </ul>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/garment/shop"
                  className="px-6 py-3 rounded-xl bg-[#C84B1A] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#C84B1A]/90 transition-colors shadow-lg shadow-[#C84B1A]/20"
                >
                  Explore Retail Catalog
                </Link>
                <Link
                  href="/garment/wholesale"
                  className="px-6 py-3 rounded-xl border border-[#D4B896]/40 text-[#D4B896] font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
                >
                  Wholesale B2B Portal
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group h-[400px]">
              <Image
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200"
                alt="B-VIBE Garment Modern Apparel"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10">
                <p className="text-xs font-bold text-[#F5EEE4]">Crafted in Addis Ababa Industrial Park</p>
                <p className="text-[11px] text-[#8A9AAF] mt-1">Export-certified production line meeting EU and global quality benchmarks.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Division 2 Highlight: Tx Digital Marketing */}
        <AnimatedSection>
          <div className="division-panel grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#060810] border border-[#2563EB]/30 rounded-3xl p-8 sm:p-12 overflow-hidden relative">
            <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group h-[400px]">
              <Image
                src="https://images.unsplash.com/photo-1542744094-3a3172720177?auto=format&fit=crop&q=80&w=1200"
                alt="T3 Digital Marketing Creative Agency"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060810] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#060810]/80 backdrop-blur-md border border-white/10">
                <p className="text-xs font-bold text-[#F8FAFC]">Tˣ Creative Performance Engine</p>
                <p className="text-[11px] text-[#8A9AAF] mt-1">Over 4.2M organic views generated across East African youth channels.</p>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/20 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Division 02 — Tˣ Digital Marketing
              </div>
              <h2 className="text-3xl sm:text-4xl font-cormorant font-bold text-[#F8FAFC]">
                Performance Marketing, TikTok/Telegram Growth & AI Creative
              </h2>
              <p className="text-sm text-[#8A9AAF] leading-relaxed">
                Tˣ is Ethiopia’s premier digital agency engineering high-conversion creative strategies. We combine deep local cultural insights with generative AI asset pipelines.
              </p>
              <ul className="space-y-3 text-xs text-[#F8FAFC]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06D6A0]" />
                  <span>360° Omnichannel Campaigns across TikTok, Telegram, Facebook & LinkedIn</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06D6A0]" />
                  <span>Interactive Package Configurator with real-time budget & scope generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06D6A0]" />
                  <span>AI-powered visual asset generation in localized Amharic & English</span>
                </li>
              </ul>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/digital/packages"
                  className="px-6 py-3 rounded-xl bg-[#2563EB] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2563EB]/90 transition-colors shadow-lg shadow-[#2563EB]/20"
                >
                  Configure Service Package
                </Link>
                <Link
                  href="/digital/portfolio"
                  className="px-6 py-3 rounded-xl border border-[#06D6A0]/40 text-[#06D6A0] font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
                >
                  View Case Studies
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Division 3 Highlight: Strategic Consulting & Training Hub */}
        <AnimatedSection>
          <div className="division-panel grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#0C1420] border border-[#C8961E]/30 rounded-3xl p-8 sm:p-12 overflow-hidden relative doc-fold-corner">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8961E]/20 text-[#C8961E] text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" /> Division 03 — Consulting & Training Hub
              </div>
              <h2 className="text-3xl sm:text-4xl font-cormorant font-bold text-[#F0EDE8]">
                Enterprise Advisory, AI Workflows & Vocational Training
              </h2>
              <p className="text-sm text-[#8A9AAF] leading-relaxed">
                Strategic advisory and capacity building guiding East African leadership teams through technology modernization, AI operating models, certified vocational curricula, and executive development.
              </p>
              <ul className="space-y-3 text-xs text-[#F0EDE8]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8961E]" />
                  <span>Enterprise Advisory & AI Operating Model deployment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8961E]" />
                  <span>Technical Vocational Training for garment & industrial manufacturing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C8961E]" />
                  <span>Live session booking calendar & Knowledge Base whitepaper hub</span>
                </li>
              </ul>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/consulting"
                  className="px-6 py-3 rounded-xl bg-[#C8961E] text-[#080A0F] font-bold text-xs uppercase tracking-wider hover:bg-[#C8961E]/90 transition-colors shadow-lg shadow-[#C8961E]/20"
                >
                  Explore Consulting & Training
                </Link>
                <Link
                  href="/consulting/book"
                  className="px-6 py-3 rounded-xl border border-white/20 text-[#F0EDE8] font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
                >
                  Book Executive Session
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group h-[400px]">
              <Image
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200"
                alt="Strategic Consulting Hub Executive Advisory"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1420] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0C1420]/80 backdrop-blur-md border border-white/10">
                <p className="text-xs font-bold text-[#F0EDE8]">Advising & Training Ethiopian Leadership</p>
                <p className="text-[11px] text-[#8A9AAF] mt-1">Bridging traditional management governance with frontier AI & technical capacity.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Division 4 Highlight: Branding & Promotion */}
        <AnimatedSection>
          <div className="division-panel grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#081814] border border-[#06D6A0]/30 rounded-3xl p-8 sm:p-12 overflow-hidden relative">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06D6A0]/20 text-[#06D6A0] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Division 04 — Branding & Promotion
              </div>
              <h2 className="text-3xl sm:text-4xl font-cormorant font-bold text-[#F4F1EC]">
                Corporate Identity, Promotional Campaigns & Event Branding
              </h2>
              <p className="text-sm text-[#8A9AAF] leading-relaxed">
                Crafting brand identity systems, promotional campaign strategies, exhibition stand designs, outdoor media assets, and collateral production for East African enterprises.
              </p>
              <ul className="space-y-3 text-xs text-[#F4F1EC]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06D6A0]" />
                  <span>Brand Strategy, Visual Positioning & Corporate Identity Systems</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06D6A0]" />
                  <span>Promotional Campaigns, Exhibition Stand Design & Event Branding</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06D6A0]" />
                  <span>Branded Digital Content, Presentation Decks & Merchandise Production</span>
                </li>
              </ul>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/branding"
                  className="px-6 py-3 rounded-xl bg-[#06D6A0] text-[#080A0F] font-bold text-xs uppercase tracking-wider hover:bg-[#06D6A0]/90 transition-colors shadow-lg shadow-[#06D6A0]/20"
                >
                  Explore Branding Portal
                </Link>
                <Link
                  href="/enquire/new?title=Brand+Strategy+%26+Identity+Brief&division=branding"
                  className="px-6 py-3 rounded-xl border border-white/20 text-[#F4F1EC] font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
                >
                  Request Brand Brief
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group h-[400px]">
              <Image
                src="https://images.unsplash.com/photo-1542744094-3a3172720177?auto=format&fit=crop&q=80&w=1200"
                alt="Branding & Promotion Division"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081814] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#081814]/80 backdrop-blur-md border border-white/10">
                <p className="text-xs font-bold text-[#F4F1EC]">Identity Systems & Event Activations</p>
                <p className="text-[11px] text-[#8A9AAF] mt-1">Delivering distinct corporate brand experiences across East Africa.</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

      </section>

    </div>
  );
};
