'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, Award, Briefcase, Cpu, BookOpen,
  ArrowRight, CheckCircle2, MessageSquare, Sparkles, Loader2,
  Package, FileText, LayoutGrid
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TrainingArticle {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  image_url?: string | null;
  industry?: string;
  metadata?: {
    category?: string;
    badge?: string;
    targetAudience?: string;
    duration?: string;
    certification?: boolean;
  };
  features?: string[];
}

interface CatalogPackage {
  id: string;
  slug: string;
  title: string;
  description?: string;
  price_etb?: number | null;
  image_url?: string | null;
  features?: string[];
  metadata?: Record<string, any>;
}

interface WorkshopCaseStudy {
  id: string;
  title?: string;
  client_name?: string;
  category?: string;
  cover_image?: string | null;
  image_url?: string | null;
  brief?: string;
  excerpt?: string;
}

// ─── Icon map by category ─────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  vocational: Award,
  leadership: Briefcase,
  technology: Cpu,
};

function iconFor(category?: string) {
  return CATEGORY_ICONS[category?.toLowerCase() ?? ''] ?? BookOpen;
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export const TrainingHome: React.FC = () => {
  // Section 1: Training Programs (articles)
  const [programs, setPrograms] = useState<TrainingArticle[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  // Section 2: Courses & Packages (catalog_items)
  const [packages, setPackages] = useState<CatalogPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  // Section 3: Workshops & Case Studies (case_studies)
  const [caseStudies, setCaseStudies] = useState<WorkshopCaseStudy[]>([]);
  const [loadingCaseStudies, setLoadingCaseStudies] = useState(true);

  useEffect(() => {
    // 1. Fetch Training Programs (articles)
    fetch('/api/resources?division=training')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setPrograms(Array.isArray(data) ? data : []);
      })
      .catch(() => setPrograms([]))
      .finally(() => setLoadingPrograms(false));

    // 2. Fetch Courses & Packages (catalog)
    fetch('/api/catalog?division=training&type=package')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
        setPackages(items);
      })
      .catch(() => setPackages([]))
      .finally(() => setLoadingPackages(false));

    // 3. Fetch Workshops & Case Studies (case_studies)
    fetch('/api/case-studies?division=training')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setCaseStudies(Array.isArray(data) ? data : []);
      })
      .catch(() => setCaseStudies([]))
      .finally(() => setLoadingCaseStudies(false));
  }, []);

  return (
    <main
      data-division="training"
      className="bg-[#080A0F] text-[#F4F1EC] min-h-screen font-jakarta transition-colors duration-200"
    >
      {/* ── Hero Section (Unchanged) ────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-20 bg-gradient-to-b from-[#080A0F] via-[#0A1A17] to-[#080A0F] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#06D6A0_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#06D6A0]/15 border border-[#06D6A0]/40 text-[#06D6A0] text-xs font-bold uppercase tracking-wider shadow-sm">
            <GraduationCap className="w-4 h-4" /> Capacity Building &amp; Professional Training Hub
          </div>

          <h1 className="text-4xl sm:text-6xl font-cormorant font-bold text-[#F4F1EC] tracking-tight leading-tight">
            Technical Vocational &amp; Leadership Mastery. <br />
            <span className="text-[#06D6A0]">Empowering East Africa&apos;s Professional Workforce.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#8A9AAF] max-w-2xl mx-auto leading-relaxed">
            We deliver industry-accredited technical training, executive leadership programs, and emerging technology
            workshops designed to build sustainable capacity for enterprises and institutions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/enquire/new?title=Custom+Corporate+Training+Program&division=training"
              className="px-8 py-4 bg-[#06D6A0] hover:bg-[#059669] text-[#080A0F] hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/25 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              Request Custom Training Proposal <MessageSquare className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-[#06D6A0]/40 text-[#F4F1EC] hover:text-[#06D6A0] rounded-xl font-bold text-xs uppercase tracking-wider bg-white/5 hover:bg-[#06D6A0]/10 transition-all shadow-sm active:scale-[0.98]"
            >
              Contact Training Lead
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 1: Training Programs ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#06D6A0] flex items-center justify-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Core Curriculum &amp; Pillars
          </span>
          <h2 className="text-3xl sm:text-5xl font-cormorant font-bold text-[#F4F1EC]">
            Training Programs
          </h2>
          <p className="text-xs sm:text-sm text-[#8A9AAF]">
            Industry-accredited training curricula designed to elevate technical skills and executive capabilities.
          </p>
        </div>

        {loadingPrograms ? (
          <div className="flex items-center justify-center py-16 gap-3 text-[#8A9AAF]">
            <Loader2 className="w-6 h-6 animate-spin text-[#06D6A0]" />
            <span className="text-sm">Loading training programs…</span>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12 px-6 bg-[#111318] border border-white/10 rounded-2xl max-w-xl mx-auto space-y-2">
            <BookOpen className="w-8 h-8 text-[#8A9AAF] mx-auto opacity-50" />
            <p className="text-sm font-medium text-[#F4F1EC]">No training programs published yet</p>
            <p className="text-xs text-[#8A9AAF]">Check back soon or contact us to request a custom program.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {programs.map((prog) => {
              const category = prog.metadata?.category || prog.industry || 'vocational';
              const Icon = iconFor(category);
              const modules = prog.features && prog.features.length > 0 ? prog.features : [];

              return (
                <div
                  key={prog.id}
                  className="bg-[#111318] border border-white/10 hover:border-[#06D6A0]/60 p-8 rounded-3xl space-y-6 flex flex-col justify-between transition-all duration-300 group shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#06D6A0]/15 text-[#06D6A0] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <Icon className="w-6 h-6" />
                      </div>
                      {prog.metadata?.badge && (
                        <span className="px-3 py-1 bg-[#06D6A0]/20 text-[#06D6A0] text-[10px] font-bold uppercase rounded-full border border-[#06D6A0]/30 shadow-sm">
                          {prog.metadata.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8A9AAF] tracking-wider">
                        {category}
                      </span>
                      <h3 className="text-2xl font-cormorant font-bold text-[#F4F1EC] group-hover:text-[#06D6A0] transition-colors mt-0.5">
                        {prog.title}
                      </h3>
                    </div>

                    {prog.excerpt && (
                      <p className="text-xs text-[#8A9AAF] leading-relaxed">{prog.excerpt}</p>
                    )}

                    {modules.length > 0 && (
                      <div className="space-y-2.5 pt-3 border-t border-white/5">
                        <span className="text-[10px] uppercase font-bold text-[#06D6A0] tracking-wider block">
                          Key Modules Covered
                        </span>
                        <ul className="space-y-2 text-xs text-[#F4F1EC]">
                          {modules.map((m, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-[#06D6A0] shrink-0 mt-0.5" />
                              <span className="leading-snug">{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-5">
                    {(prog.metadata?.targetAudience || prog.metadata?.duration) && (
                      <div className="text-[11px] text-[#8A9AAF] bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                        {prog.metadata?.targetAudience && (
                          <p>
                            <strong className="text-[#F4F1EC]">Target Audience: </strong>
                            {prog.metadata.targetAudience}
                          </p>
                        )}
                        {prog.metadata?.duration && (
                          <p>
                            <strong className="text-[#F4F1EC]">Duration: </strong>
                            {prog.metadata.duration}
                          </p>
                        )}
                      </div>
                    )}

                    <Link
                      href={`/enquire/new?title=${encodeURIComponent(prog.title)}&division=training`}
                      className="w-full py-3.5 px-4 bg-[#06D6A0] hover:bg-[#059669] text-[#080A0F] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-500/20 active:scale-[0.98] group/btn"
                    >
                      <span>Enquire for This Program</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Section 2: Courses & Packages ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12 border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#06D6A0] flex items-center justify-center gap-1.5">
            <Package className="w-3.5 h-3.5" /> Structured Offerings
          </span>
          <h2 className="text-3xl sm:text-5xl font-cormorant font-bold text-[#F4F1EC]">
            Courses &amp; Packages
          </h2>
          <p className="text-xs sm:text-sm text-[#8A9AAF]">
            Ready-to-deploy training modules, multi-week bootcamps, and institutional packages.
          </p>
        </div>

        {loadingPackages ? (
          <div className="flex items-center justify-center py-16 gap-3 text-[#8A9AAF]">
            <Loader2 className="w-6 h-6 animate-spin text-[#06D6A0]" />
            <span className="text-sm">Loading courses &amp; packages…</span>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12 px-6 bg-[#111318] border border-white/10 rounded-2xl max-w-xl mx-auto space-y-2">
            <Package className="w-8 h-8 text-[#8A9AAF] mx-auto opacity-50" />
            <p className="text-sm font-medium text-[#F4F1EC]">No courses &amp; packages published yet</p>
            <p className="text-xs text-[#8A9AAF]">Check back soon for upcoming course releases.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const features = pkg.features || [];
              const priceText =
                pkg.price_etb && pkg.price_etb > 0
                  ? `${pkg.price_etb.toLocaleString()} ETB`
                  : 'Contact for pricing';

              return (
                <div
                  key={pkg.id}
                  className="bg-[#111318] border border-white/10 hover:border-[#06D6A0]/60 p-8 rounded-3xl space-y-6 flex flex-col justify-between transition-all duration-300 group shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10"
                >
                  <div className="space-y-4">
                    {pkg.image_url && (
                      <div className="w-full h-48 rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-4">
                        <img
                          src={pkg.image_url}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-[#06D6A0]/15 text-[#06D6A0] text-[10px] font-bold uppercase rounded-full border border-[#06D6A0]/30">
                        Package
                      </span>
                      <span className="text-xs font-bold text-[#06D6A0]">
                        {priceText}
                      </span>
                    </div>

                    <h3 className="text-2xl font-cormorant font-bold text-[#F4F1EC] group-hover:text-[#06D6A0] transition-colors">
                      {pkg.title}
                    </h3>

                    {pkg.description && (
                      <p className="text-xs text-[#8A9AAF] leading-relaxed">{pkg.description}</p>
                    )}

                    {features.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-white/5">
                        <span className="text-[10px] uppercase font-bold text-[#06D6A0] tracking-wider block">
                          Included Features &amp; Modules
                        </span>
                        <ul className="space-y-1.5 text-xs text-[#F4F1EC]">
                          {features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#06D6A0] shrink-0 mt-0.5" />
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <Link
                      href={`/enquire/new?title=${encodeURIComponent(pkg.title)}&division=training`}
                      className="w-full py-3.5 px-4 bg-[#06D6A0] hover:bg-[#059669] text-[#080A0F] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-500/20 active:scale-[0.98]"
                    >
                      <span>Enquire for Package</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Section 3: Workshops & Case Studies ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12 border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#06D6A0] flex items-center justify-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5" /> Real-World Impact
          </span>
          <h2 className="text-3xl sm:text-5xl font-cormorant font-bold text-[#F4F1EC]">
            Workshops &amp; Case Studies
          </h2>
          <p className="text-xs sm:text-sm text-[#8A9AAF]">
            Explore custom workshops delivered to our institutional partners and client organizations.
          </p>
        </div>

        {loadingCaseStudies ? (
          <div className="flex items-center justify-center py-16 gap-3 text-[#8A9AAF]">
            <Loader2 className="w-6 h-6 animate-spin text-[#06D6A0]" />
            <span className="text-sm">Loading workshops &amp; case studies…</span>
          </div>
        ) : caseStudies.length === 0 ? (
          <div className="text-center py-12 px-6 bg-[#111318] border border-white/10 rounded-2xl max-w-xl mx-auto space-y-2">
            <LayoutGrid className="w-8 h-8 text-[#8A9AAF] mx-auto opacity-50" />
            <p className="text-sm font-medium text-[#F4F1EC]">No workshops &amp; case studies published yet</p>
            <p className="text-xs text-[#8A9AAF]">Workshops and training case studies will appear here once published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((cs) => {
              const image = cs.cover_image || cs.image_url;
              const displayTitle = cs.title || cs.client_name || 'Training Workshop';
              const textBrief = cs.brief || cs.excerpt || '';

              return (
                <div
                  key={cs.id}
                  className="bg-[#111318] border border-white/10 hover:border-[#06D6A0]/60 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10"
                >
                  <div>
                    {image && (
                      <div className="w-full h-52 overflow-hidden bg-white/5 relative">
                        <img
                          src={image}
                          alt={displayTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {cs.category && (
                          <span className="absolute top-4 left-4 px-3 py-1 bg-[#080A0F]/80 backdrop-blur-md text-[#06D6A0] text-[10px] font-bold uppercase rounded-full border border-[#06D6A0]/40">
                            {cs.category}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-6 space-y-3">
                      {cs.client_name && cs.title && (
                        <span className="text-[10px] font-bold uppercase text-[#06D6A0] tracking-wider block">
                          Client: {cs.client_name}
                        </span>
                      )}
                      <h3 className="text-xl font-cormorant font-bold text-[#F4F1EC] group-hover:text-[#06D6A0] transition-colors">
                        {displayTitle}
                      </h3>
                      {textBrief && (
                        <p className="text-xs text-[#8A9AAF] leading-relaxed line-clamp-4">{textBrief}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/enquire/new?title=${encodeURIComponent(displayTitle)}&division=training`}
                      className="w-full py-3 px-4 bg-white/5 hover:bg-[#06D6A0] text-[#F4F1EC] hover:text-[#080A0F] font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-[#06D6A0]"
                    >
                      <span>Request Similar Workshop</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Corporate CTA Section (Unchanged) ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0C1420] via-[#111318] to-[#0A1A17] border border-[#06D6A0]/40 p-8 sm:p-12 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-bold text-[#06D6A0] tracking-widest">
              Tailored Organizational Programs
            </span>
            <h2 className="text-3xl sm:text-4xl font-cormorant font-bold text-[#F4F1EC]">
              Need a Custom In-House Training Solution for Your Organization?
            </h2>
            <p className="text-xs sm:text-sm text-[#8A9AAF] leading-relaxed">
              Our training leads co-design bespoke curricula tailored to your company&apos;s technology stack,
              operational protocols, and workforce skill requirements.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/enquire/new?title=Enterprise+Custom+Capacity+Building&division=training"
                className="px-8 py-4 bg-[#06D6A0] hover:bg-[#059669] text-[#080A0F] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
              >
                Submit Training Enquiry <MessageSquare className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
