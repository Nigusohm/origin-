'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Globe, Shield, Shirt, Sparkles, Building2, GraduationCap, Send, CheckCircle2, Award, FileText, ArrowRight } from 'lucide-react';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const CorporateFooter: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const handleSubscribe = (data: NewsletterFormData) => {
    if (data.email) {
      setSubscribed(true);
      reset();
    }
  };

  return (
    <footer className="bg-[#080A0F] text-[#8A9AAF] border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 font-jakarta relative overflow-hidden">
      
      {/* Background Decorative Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#C8961E]/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Top Section: Newsletter & Enterprise Briefing */}
        <div className="bg-[#111318] border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8961E]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8961E]/15 border border-[#C8961E]/30 text-[#C8961E] text-xs font-bold uppercase tracking-widest">
                <Send className="w-3.5 h-3.5" /> ORIGIN ENTERPRISE BRIEFING
              </div>
              <h3 className="text-2xl sm:text-3xl font-cormorant font-bold text-[#F4F1EC] tracking-wide">
                Stay Ahead of East African Commercial Innovation
              </h3>
              <p className="text-xs sm:text-sm text-[#8A9AAF] leading-relaxed max-w-xl">
                Subscribe for executive research reports, textile export trend analyses, digital marketing benchmarks, and corporate announcements.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="bg-[#C8961E]/20 border border-[#C8961E]/40 p-4 rounded-2xl flex items-center gap-3 text-[#F4F1EC]">
                  <CheckCircle2 className="w-6 h-6 text-[#C8961E] shrink-0" />
                  <div>
                    <div className="font-bold text-sm">Briefing Subscription Confirmed</div>
                    <div className="text-xs text-[#8A9AAF]">Thank you for subscribing to Origin & Everlasting insights.</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(handleSubscribe)} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="flex-1 w-full">
                    <input
                      type="email"
                      placeholder="Enter executive email address..."
                      {...register('email')}
                      className="w-full bg-[#080A0F] border border-white/15 rounded-xl px-4 py-3 text-xs text-[#F4F1EC] placeholder-[#8A9AAF] focus:outline-none focus:border-[#C8961E] transition-colors"
                    />
                    {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#C8961E] text-[#080A0F] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C8961E]/90 transition-colors shadow-lg flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto"
                  >
                    Subscribe <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Middle Section: Corporate Identity & 4 Division Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          
          {/* Column 1: Corporate Identity & HQ */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C8961E] text-[#080A0F] font-cormorant font-bold text-xl flex items-center justify-center shadow-md">
                OE
              </div>
              <div>
                <div className="font-cormorant text-2xl font-bold text-[#F4F1EC] leading-tight">
                  ORIGIN <span className="text-[#C8961E]">&</span> EVERLASTING
                </div>
                <div className="text-[9px] tracking-[0.2em] text-[#8A9AAF] uppercase">
                  TRADING PLC · ADDIS ABABA
                </div>
              </div>
            </div>

            <p className="font-amharic text-xs text-[#C8961E] leading-relaxed">
              ኦሪጅን እና ኤቨርላስቲንግ ትሬዲንግ ኃ.የተ.የግ.ማ — የልብስ ስፌት ፋብሪካ፣ ዲጂታል ማርኬቲንግ እና ስትራቴጂክ አማካሪ ተቋም።
            </p>

            <p className="text-xs text-[#8A9AAF] leading-relaxed">
              A diversified Ethiopian commercial group integrating apparel manufacturing, digital agency performance, and strategic advisory.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#8A9AAF]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C8961E] shrink-0 mt-0.5" />
                <span>Bole Sub City, Woreda 03, Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C8961E] shrink-0" />
                <span>+251 11 667 9200 / +251 91 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C8961E] shrink-0" />
                <span>contact@originandeverlasting.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Corporate HQ Links */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#C8961E] tracking-wider">
              <Globe className="w-4 h-4" /> Corporate HQ
            </div>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-[#F4F1EC] transition-colors">Group Overview</Link></li>
              <li><Link href="/about" className="hover:text-[#F4F1EC] transition-colors">Executive Leadership & History</Link></li>
              <li><Link href="/divisions" className="hover:text-[#F4F1EC] transition-colors">Commercial Divisions</Link></li>
              <li><Link href="/media" className="hover:text-[#F4F1EC] transition-colors">Media Library & Assets</Link></li>
              <li><Link href="/contact" className="hover:text-[#F4F1EC] transition-colors">Corporate Contact Portal</Link></li>
            </ul>
          </div>

          {/* Column 3: Division 1 - B-VIBE Garment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#C84B1A] tracking-wider">
              <Shirt className="w-4 h-4" /> B-VIBE Garment
            </div>
            <ul className="space-y-2 text-xs">
              <li><Link href="/garment" className="hover:text-[#F4F1EC] transition-colors">Garment Division Home</Link></li>
              <li><Link href="/garment/shop" className="hover:text-[#F4F1EC] transition-colors">Habesha & Modern Catalog</Link></li>
              <li><Link href="/garment/wholesale" className="hover:text-[#F4F1EC] transition-colors">B2B Wholesale Portal</Link></li>
              <li><Link href="/garment/lookbook" className="hover:text-[#F4F1EC] transition-colors">Visual Fashion Lookbook</Link></li>
              <li><Link href="/garment/cart" className="hover:text-[#F4F1EC] transition-colors">Shopping Cart & Order</Link></li>
            </ul>
          </div>

          {/* Column 4: Division 2 - Tˣ Digital Agency */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#2563EB] tracking-wider">
              <Sparkles className="w-4 h-4" /> Tˣ Digital Agency
            </div>
            <ul className="space-y-2 text-xs">
              <li><Link href="/digital" className="hover:text-[#F4F1EC] transition-colors">Tˣ Agency Home</Link></li>
              <li><Link href="/digital/portfolio" className="hover:text-[#F4F1EC] transition-colors">Case Studies & Campaigns</Link></li>
              <li><Link href="/digital/packages" className="hover:text-[#F4F1EC] transition-colors">Interactive Package Builder</Link></li>
              <li><Link href="/digital/services" className="hover:text-[#F4F1EC] transition-colors">Services & AI Creative</Link></li>
            </ul>
          </div>

          {/* Column 5: Division 3 - Strategic Consulting */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#C8961E] tracking-wider">
              <Building2 className="w-4 h-4" /> Strategic Consulting
            </div>
            <ul className="space-y-2 text-xs">
              <li><Link href="/consulting" className="hover:text-[#F4F1EC] transition-colors">Consulting Hub Home</Link></li>
              <li><Link href="/consulting/book" className="hover:text-[#F4F1EC] transition-colors">Executive Discovery Booking</Link></li>
              <li><Link href="/consulting/resources" className="hover:text-[#F4F1EC] transition-colors">Research Papers & Reports</Link></li>
              <li><Link href="/consulting/insights" className="hover:text-[#F4F1EC] transition-colors">Sector Analytics</Link></li>
            </ul>
          </div>

          {/* Column 6: Division 4 - Capacity Building & Training */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#06D6A0] tracking-wider">
              <GraduationCap className="w-4 h-4" /> Training Division
            </div>
            <ul className="space-y-2 text-xs">
              <li><Link href="/training" className="hover:text-[#F4F1EC] transition-colors">Training Hub Home</Link></li>
              <li><Link href="/enquire/new?title=Technical+Vocational+Training&division=training" className="hover:text-[#F4F1EC] transition-colors">Vocational Training</Link></li>
              <li><Link href="/enquire/new?title=Enterprise+Leadership+Development&division=training" className="hover:text-[#F4F1EC] transition-colors">Leadership Development</Link></li>
              <li><Link href="/enquire/new?title=Emerging+Technology+Integration&division=training" className="hover:text-[#F4F1EC] transition-colors">Emerging AI Tech</Link></li>
            </ul>
          </div>

        </div>

        {/* Certifications & Regulatory Accreditation Strip */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center gap-2 text-xs text-[#F4F1EC]">
            <Award className="w-4 h-4 text-[#C8961E]" />
            <span>ISO 9001:2015 Certified</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center gap-2 text-xs text-[#F4F1EC]">
            <Shield className="w-4 h-4 text-[#2563EB]" />
            <span>FairTrade Ethiopia Compliant</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center gap-2 text-xs text-[#F4F1EC]">
            <FileText className="w-4 h-4 text-[#C84B1A]" />
            <span>EAC License #ET-2026-9041</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center gap-2 text-xs text-[#F4F1EC]">
            <Globe className="w-4 h-4 text-[#06D6A0]" />
            <span>Chapa ETB & Stripe USD Verified</span>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <div className="text-[#8A9AAF]">
            © {new Date().getFullYear()} Origin & Everlasting Trading PLC. Addis Ababa, Ethiopia. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[#F4F1EC] transition-colors">Governance & Leadership</Link>
            <Link href="/contact" className="hover:text-[#F4F1EC] transition-colors">Corporate Headquarters</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
