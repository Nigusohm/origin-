'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, Calendar, ArrowRight, GraduationCap, Loader2, CheckCircle2, MessageSquare } from 'lucide-react';
import { BookingCalendar } from '@/components/consulting/BookingCalendar';
import { ResourceCard } from '@/components/consulting/ResourceCard';
import { initialConsultingSlots, initialResources } from '@/data/mockData';
import { ConsultingSlot, Resource } from '@/types';

interface TrainingProgram {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  description?: string;
  image_url?: string | null;
  features?: string[];
  metadata?: {
    category?: string;
    badge?: string;
    targetAudience?: string;
    duration?: string;
  };
}

const FALLBACK_PROGRAMS: TrainingProgram[] = [
  {
    id: 'tp-1',
    slug: 'technical-vocational-training-program',
    title: 'Technical Vocational Training Program',
    excerpt: 'Hands-on industrial and technical training tailored for textile & apparel manufacturing, quality control, equipment maintenance, and supply chain logistics.',
    features: ['Garment & Textile Manufacturing Technology', 'Industrial Quality Assurance & ISO Standards', 'Machinery Maintenance & Production Optimization', 'Export Compliance & Safety Regulations'],
    metadata: { category: 'vocational', badge: 'Certified Program', targetAudience: 'Production Teams, Plant Supervisors, Technical Specialists' },
  },
  {
    id: 'tp-2',
    slug: 'enterprise-leadership-development',
    title: 'Enterprise & Leadership Development',
    excerpt: 'Customized leadership, managerial, and corporate governance programs designed for managers, department leads, and senior executives.',
    features: ['Strategic Operational Management', 'Financial Literacy & Corporate Budgeting', 'Cross-Functional Leadership & Team Building', 'Change Management & Organizational Agility'],
    metadata: { category: 'leadership', badge: 'Executive Track', targetAudience: 'Mid-to-Senior Executives, Department Heads, Entrepreneurs' },
  },
  {
    id: 'tp-3',
    slug: 'emerging-technology-integration-bootcamp',
    title: 'Emerging Technology Integration',
    excerpt: 'Practical bootcamps on AI tool deployment, workflow automation, digital business tools, and software engineering for modern enterprises.',
    features: ['Enterprise AI & LLM Automation Workflows', 'Data-Driven Decision Making & Analytics', 'Digital Product Management & Cloud Infrastructure', 'Cybersecurity Fundamentals for Business'],
    metadata: { category: 'technology', badge: 'Future Skills', targetAudience: 'IT Directors, Tech Leads, Innovation Teams & Analysts' },
  },
];

interface ConsultingHomeProps {
  slots?: ConsultingSlot[];
  resources?: Resource[];
}

export const ConsultingHome: React.FC<ConsultingHomeProps> = ({
  slots = initialConsultingSlots,
  resources = initialResources,
}) => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  useEffect(() => {
    // Fetch Training Programs from the consulting division (division=consulting, kind=process)
    fetch('/api/catalog?division=consulting&type=package')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
        // Filter for training-category items; fall back to static if none exist
        const trainingItems = items.filter(
          (item: any) => item.metadata?.category && ['vocational', 'leadership', 'technology'].includes(item.metadata.category)
        );
        setPrograms(trainingItems.length > 0 ? trainingItems : FALLBACK_PROGRAMS);
      })
      .catch(() => setPrograms(FALLBACK_PROGRAMS))
      .finally(() => setLoadingPrograms(false));
  }, []);

  return (
    <main data-division="consulting" className="bg-[#080A0F] text-[#F0EDE8] min-h-screen">
      
      {/* Consulting Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-20 bg-gradient-to-b from-[#080A0F] via-[#0C1420] to-[#080A0F] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C8961E_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C8961E]/20 border border-[#C8961E]/40 text-[#C8961E] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" /> Strategic Management Consulting & Training Hub
          </div>

          <h1 className="text-4xl sm:text-6xl font-cormorant font-bold text-[#F0EDE8] tracking-tight">
            Enterprise Advisory & AI Integration. <br />
            <span className="text-[#C8961E]">Data-Driven Strategy for African Leaders.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#8A9AAF] max-w-2xl mx-auto font-jakarta leading-relaxed">
            We partner with corporate boards, financial institutions, and international development agencies to build resilient operating models, integrate AI automation, and scale cross-border operations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/consulting/book"
              className="px-8 py-3.5 bg-[#C8961E] text-[#080A0F] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#C8961E]/90 shadow-xl flex items-center gap-2"
            >
              Book Executive Session <Calendar className="w-4 h-4" />
            </Link>
            <Link
              href="/consulting/resources"
              className="px-8 py-3.5 border border-[#C8961E]/40 text-[#F0EDE8] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              Explore Knowledge Base
            </Link>
          </div>
        </div>
      </section>

      {/* Live Booking Engine Section */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <BookingCalendar slots={slots} />
      </section>

      {/* Knowledge Base Resources Grid */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C8961E]">Executive Knowledge Vault</span>
            <h2 className="text-2xl sm:text-4xl font-cormorant font-bold text-[#F0EDE8] mt-1">Featured Briefings & Whitepapers</h2>
          </div>
          <Link href="/consulting/resources" className="text-xs font-bold text-[#C8961E] flex items-center gap-1">
            Browse All Briefings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.slice(0, 2).map(r => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </section>

      {/* ── Training & Capacity Building ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C8961E] flex items-center justify-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" /> Capacity Building & Professional Development
          </span>
          <h2 className="text-3xl sm:text-5xl font-cormorant font-bold text-[#F0EDE8]">
            Training Programs
          </h2>
          <p className="text-xs sm:text-sm text-[#8A9AAF] max-w-2xl mx-auto leading-relaxed">
            Industry-accredited technical training, executive leadership development, and emerging technology workshops
            designed to build sustainable workforce capacity for East African enterprises.
          </p>
        </div>

        {loadingPrograms ? (
          <div className="flex items-center justify-center gap-3 py-16 text-[#C8961E]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-jakarta">Loading training programs…</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-[#111318] border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-[#C8961E]/40 hover:-translate-y-1 transition-all duration-300 group shadow-xl"
              >
                {prog.image_url && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={prog.image_url}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111318]/80 to-transparent" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {prog.metadata?.category && (
                        <span className="text-[10px] uppercase font-bold text-[#C8961E] tracking-wider">
                          {prog.metadata.category}
                        </span>
                      )}
                      <h3 className="text-base sm:text-lg font-cormorant font-bold text-[#F0EDE8] mt-1 leading-snug">
                        {prog.title}
                      </h3>
                    </div>
                    {prog.metadata?.badge && (
                      <span className="shrink-0 px-2 py-0.5 bg-[#C8961E]/10 text-[#C8961E] border border-[#C8961E]/30 text-[9px] font-bold uppercase rounded-full">
                        {prog.metadata.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#8A9AAF] leading-relaxed flex-1">
                    {prog.excerpt || prog.description || ''}
                  </p>

                  {prog.features && prog.features.length > 0 && (
                    <ul className="space-y-1.5">
                      {prog.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-[#8A9AAF]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C8961E] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {prog.metadata?.targetAudience && (
                    <p className="text-[10px] text-[#8A9AAF] border-t border-white/10 pt-3 font-jakarta">
                      <span className="text-[#C8961E] font-bold">Target: </span>
                      {prog.metadata.targetAudience}
                    </p>
                  )}

                  <Link
                    href={`/enquire/new?title=${encodeURIComponent(prog.title)}&division=consulting`}
                    className="mt-auto w-full py-3 bg-[#C8961E]/10 hover:bg-[#C8961E] text-[#C8961E] hover:text-[#080A0F] border border-[#C8961E]/30 hover:border-[#C8961E] rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2"
                  >
                    Request This Program <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Training CTA */}
        <div className="bg-[#0C1420] border border-[#C8961E]/30 rounded-3xl p-10 text-center space-y-5 shadow-xl">
          <GraduationCap className="w-10 h-10 text-[#C8961E] mx-auto" />
          <h3 className="text-2xl font-cormorant font-bold text-[#F0EDE8]">
            Need a Custom In-House Training Solution?
          </h3>
          <p className="text-xs text-[#8A9AAF] max-w-xl mx-auto leading-relaxed font-jakarta">
            Our training leads co-design bespoke curricula tailored to your company&apos;s technology stack,
            industry requirements, and organizational capacity goals.
          </p>
          <Link
            href="/enquire/new?title=Enterprise+Custom+Capacity+Building&division=consulting"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C8961E] text-[#080A0F] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#b07e18] hover:text-white transition-all shadow-lg"
          >
            Submit Training Enquiry <MessageSquare className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </main>
  );
};
