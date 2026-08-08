'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, CheckCircle2, MessageSquare,
  Loader2, Package, Star, Layers, Palette, Target, Megaphone,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface BrandingService {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  description?: string;
  image_url?: string | null;
  metadata?: {
    category?: string;
    badge?: string;
  };
  features?: string[];
}

interface BrandingPortfolioItem {
  id: string;
  slug?: string;
  title: string;
  excerpt?: string;
  image_url?: string | null;
  // client_name, category, timeline, metrics are stored inside metadata by toRow()
  metadata?: {
    client_name?: string;
    category?: string;
    timeline?: string;
    metrics?: string;
    Timeline?: string; // legacy capitalised key from admin form field
    Metrics?: string;  // legacy capitalised key from admin form field
    Client?: string;   // legacy capitalised key from admin form field
  };
}

// ─── Fallback static data ─────────────────────────────────────────────────────
const FALLBACK_SERVICES: BrandingService[] = [
  {
    id: 'brd-1',
    slug: 'brand-strategy-corporate-identity',
    title: 'Brand Strategy & Corporate Identity Suite',
    excerpt: 'Comprehensive brand strategy, visual positioning, and corporate identity systems tailored to East African enterprise standards.',
    image_url: 'https://images.unsplash.com/photo-1542744094-3a3172720177?auto=format&fit=crop&q=80&w=1200',
    features: ['Brand Architecture & Positioning', 'Logo & Typography Design System', 'Brand Book & Usage Guidelines', 'Stationery & Executive Collateral'],
    metadata: { category: 'brand-identity', badge: 'Core Solution' },
  },
  {
    id: 'brd-2',
    slug: 'promotional-campaigns-event-branding',
    title: 'Promotional Campaigns & Event Promotion',
    excerpt: 'High-impact promotional campaign creation, exhibition stand design, outdoor media assets, and event collateral production.',
    image_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200',
    features: ['Event Visual Identity & Signage', 'Exhibition Booth Design', 'Promotional Merchandising', 'Campaign Assets & Multi-channel Collateral'],
    metadata: { category: 'promotional-campaigns', badge: 'Event Ready' },
  },
  {
    id: 'brd-3',
    slug: 'digital-content-creation',
    title: 'Digital Content Creation & Collateral',
    excerpt: 'Motion graphics, social media templates, presentation design, and branded digital asset production for corporate and institutional clients.',
    image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200',
    features: ['Social Media Visual Templates', 'Branded Presentation Decks', 'Motion Graphics & Video Bumpers', 'Digital Ad Creatives (All Formats)'],
    metadata: { category: 'digital-content', badge: 'Digital First' },
  },
];

const WHAT_WE_DO = [
  { icon: Palette, label: 'Brand Identity', desc: 'Visual language, logo systems, and brand guidelines that distinguish.' },
  { icon: Target, label: 'Strategic Positioning', desc: 'Market positioning, messaging frameworks, and competitive differentiation.' },
  { icon: Megaphone, label: 'Promotional Campaigns', desc: 'Event branding, outdoor media, and campaign collateral production.' },
  { icon: Layers, label: 'Collateral Production', desc: 'Print, digital, and environmental design across all touchpoints.' },
];

export const BrandingHome: React.FC = () => {
  const [services, setServices] = useState<BrandingService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [portfolio, setPortfolio] = useState<BrandingPortfolioItem[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);

  useEffect(() => {
    // Fetch Branding Services
    fetch('/api/catalog?division=branding')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
        setServices(items.length > 0 ? items : FALLBACK_SERVICES);
      })
      .catch(() => setServices(FALLBACK_SERVICES))
      .finally(() => setLoadingServices(false));

    // Fetch Portfolio / Case Studies
    fetch('/api/case-studies?division=branding')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPortfolio(Array.isArray(data) ? data : []))
      .catch(() => setPortfolio([]))
      .finally(() => setLoadingPortfolio(false));
  }, []);

  return (
    <main
      data-division="branding"
      className="bg-[#080A0F] text-[#F4F1EC] min-h-screen font-jakarta transition-colors duration-200"
    >
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-20 bg-gradient-to-b from-[#051A13] via-[#080A0F] to-[#080A0F] overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#06D6A0_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.08]" />

        {/* Ambient glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#06D6A0]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#C8961E]/8 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#06D6A0]/15 border border-[#06D6A0]/40 text-[#06D6A0] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-4 h-4" /> Branding &amp; Promotion Division
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-cormorant font-bold text-[#F4F1EC] tracking-tight leading-tight">
            Identity That Commands.<br />
            <span className="text-[#06D6A0]">Campaigns That Convert.</span>
          </h1>

          {/* Body */}
          <p className="text-sm sm:text-base text-[#8A9AAF] max-w-2xl mx-auto leading-relaxed">
            We craft brand identities, promotional campaigns, and collateral systems that define enterprises
            across East Africa — from corporate identity suites to exhibition-ready event activations.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/enquire/new?title=Brand+Strategy+%26+Identity+Brief&division=branding"
              className="px-8 py-4 bg-[#06D6A0] text-[#080A0F] rounded-xl font-bold text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/15 hover:bg-[#059669] hover:text-white hover:shadow-emerald-500/30 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              Request Brand Brief <MessageSquare className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-[#06D6A0]/40 text-[#F4F1EC] rounded-xl font-bold text-xs uppercase tracking-wider bg-white/5 hover:text-[#06D6A0] hover:bg-[#06D6A0]/10 transition-all shadow-sm"
            >
              Contact Branding Lead
            </Link>
          </div>
        </div>
      </section>

      {/* ── What We Do ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#06D6A0]">Our Practice Areas</span>
          <h2 className="text-3xl sm:text-4xl font-cormorant font-bold text-[#F4F1EC]">What We Do</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHAT_WE_DO.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-[#111318] border border-white/10 rounded-2xl p-6 space-y-3 hover:border-[#06D6A0]/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#06D6A0]/10 flex items-center justify-center group-hover:bg-[#06D6A0]/20 transition-colors">
                <Icon className="w-5 h-5 text-[#06D6A0]" />
              </div>
              <h3 className="text-sm font-bold text-[#F4F1EC] font-cormorant text-lg">{label}</h3>
              <p className="text-xs text-[#8A9AAF] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services & Packages ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#06D6A0] flex items-center justify-center gap-1.5">
            <Package className="w-3.5 h-3.5" /> Service Offerings
          </span>
          <h2 className="text-3xl sm:text-5xl font-cormorant font-bold text-[#F4F1EC]">
            Branding Solutions
          </h2>
          <p className="text-xs sm:text-sm text-[#8A9AAF]">
            Tailored brand strategy, design, and promotional solutions for enterprise, institutional, and emerging clients.
          </p>
        </div>

        {loadingServices ? (
          <div className="flex items-center justify-center gap-3 py-16 text-[#06D6A0]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading branding services…</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="bg-[#111318] border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-[#06D6A0]/40 hover:-translate-y-1 transition-all duration-300 group shadow-xl"
              >
                {svc.image_url && (
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={svc.image_url}
                      alt={svc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111318]/80 to-transparent" />
                    {svc.metadata?.badge && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#06D6A0]/90 text-[#080A0F] text-[10px] font-bold uppercase rounded-full">
                        {svc.metadata.badge}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <div>
                    {svc.metadata?.category && (
                      <span className="text-[10px] uppercase font-bold text-[#06D6A0] tracking-wider">
                        {svc.metadata.category.replace(/-/g, ' ')}
                      </span>
                    )}
                    <h3 className="text-base sm:text-lg font-cormorant font-bold text-[#F4F1EC] mt-1 leading-snug">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-[#8A9AAF] mt-2 leading-relaxed">
                      {svc.excerpt || svc.description || ''}
                    </p>
                  </div>

                  {svc.features && svc.features.length > 0 && (
                    <ul className="space-y-1.5 flex-1">
                      {svc.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-[#8A9AAF]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#06D6A0] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={`/enquire/new?title=${encodeURIComponent(svc.title)}&division=branding`}
                    className="mt-auto w-full py-3 bg-[#06D6A0]/10 hover:bg-[#06D6A0] text-[#06D6A0] hover:text-[#080A0F] border border-[#06D6A0]/30 hover:border-[#06D6A0] rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2"
                  >
                    Request Proposal <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Portfolio / Case Studies ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#06D6A0] flex items-center justify-center gap-1.5">
            <Star className="w-3.5 h-3.5" /> Client Portfolio
          </span>
          <h2 className="text-3xl sm:text-5xl font-cormorant font-bold text-[#F4F1EC]">
            Selected Work
          </h2>
          <p className="text-xs sm:text-sm text-[#8A9AAF]">
            Brand identity and promotional campaigns delivered for corporate, government, and institutional clients across East Africa.
          </p>
        </div>

        {loadingPortfolio ? (
          <div className="flex items-center justify-center gap-3 py-12 text-[#06D6A0]">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : portfolio.length === 0 ? (
          <div className="bg-[#111318] border border-white/10 rounded-2xl p-10 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-[#06D6A0]/40 mx-auto" />
            <p className="text-sm font-medium text-[#F4F1EC]">Portfolio case studies coming soon</p>
            <p className="text-xs text-[#8A9AAF]">Published client work will appear here once submitted by the Branding team.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item) => {
              // client_name, timeline, metrics are stored in metadata by the admin save path
              const clientName = item.metadata?.client_name || item.metadata?.Client || '';
              const timeline = item.metadata?.timeline || item.metadata?.Timeline || '';
              const metrics = item.metadata?.metrics || item.metadata?.Metrics || '';
              const displayTitle = item.title || clientName || 'Branding Project';
              return (
                <div
                  key={item.id}
                  className="bg-[#111318] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#06D6A0]/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-40 bg-[#0A1A17] overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={displayTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-[#06D6A0]/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111318]/80 to-transparent" />
                  </div>
                  <div className="p-5 space-y-3">
                    {clientName && (
                      <span className="text-[10px] font-bold text-[#06D6A0] uppercase tracking-wider">{clientName}</span>
                    )}
                    <h3 className="text-sm font-cormorant font-bold text-[#F4F1EC] leading-snug">{displayTitle}</h3>
                    {item.excerpt && (
                      <p className="text-xs text-[#8A9AAF] line-clamp-2">{item.excerpt}</p>
                    )}
                    {timeline && (
                      <p className="text-[10px] text-[#8A9AAF]">
                        <span className="text-[#06D6A0] font-bold">Timeline: </span>{timeline}
                      </p>
                    )}
                    {metrics && (
                      <div className="px-3 py-2 bg-[#06D6A0]/10 border border-[#06D6A0]/20 rounded-lg">
                        <p className="text-[10px] text-[#06D6A0] font-bold">{metrics}</p>
                      </div>
                    )}
                    <Link
                      href={`/enquire/new?title=${encodeURIComponent(displayTitle)}&division=branding`}
                      className="text-xs font-bold text-[#06D6A0] flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Request Similar Work <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111318] border border-[#06D6A0]/30 rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#06D6A0]/15 border border-[#06D6A0]/30 flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7 text-[#06D6A0]" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-cormorant font-bold text-[#F4F1EC]">
            Ready to Build Your Brand Identity?
          </h2>
          <p className="text-xs sm:text-sm text-[#8A9AAF] max-w-xl mx-auto leading-relaxed">
            Our branding team co-designs corporate identity systems tailored to your sector, audience, and market goals.
            From strategy to execution — we deliver brand experiences that endure.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/enquire/new?title=Branding+%26+Corporate+Identity+Brief&division=branding"
              className="px-8 py-4 bg-[#06D6A0] text-[#080A0F] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#059669] hover:text-white flex items-center gap-2 shadow-xl transition-all"
            >
              Submit Branding Brief <MessageSquare className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-[#06D6A0]/40 text-[#F4F1EC] rounded-xl font-bold text-xs uppercase tracking-wider bg-white/5 hover:bg-[#06D6A0]/10 hover:border-[#06D6A0] transition-all"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
