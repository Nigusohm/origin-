'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shirt, Sparkles, Building2, Globe } from 'lucide-react';
import { TripleBarDivider } from './TripleBarDivider';
import { motion } from 'framer-motion';

export const CorporateHero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-12 pb-20 bg-[#080A0F] overflow-hidden">
      
      {/* Background Particle Field - 12 Gold Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#C8961E] opacity-25 animate-float-particle"
            style={{
              width: `${(i % 3) * 3 + 4}px`,
              height: `${(i % 3) * 3 + 4}px`,
              top: `${(i * 17) % 90 + 5}%`,
              left: `${(i * 23) % 90 + 5}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${6 + (i % 4) * 2}s`
            }}
          />
        ))}
        {/* Subtle background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8961E]/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111318] border border-[#8A9AAF]/20 text-xs font-semibold text-[#8A9AAF] uppercase tracking-[0.2em] mb-6"
        >
          <Globe className="w-3.5 h-3.5 text-[#C8961E]" />
          Ethiopian Enterprise · Global Standard
        </motion.div>

        {/* Corporate Name in Cormorant */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-cormorant font-light text-[#F4F1EC] tracking-wider leading-none mb-4"
        >
          <span className="text-[#C8961E] font-medium">ORIGIN</span>{' '}
          <span className="text-[#8A9AAF] font-light">&</span>{' '}
          <span className="text-[#C8961E] font-medium">EVERLASTING</span>
          <span className="block text-sm sm:text-lg font-jakarta font-light text-[#8A9AAF] tracking-[0.35em] uppercase mt-3">
            TRADING PLC
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg sm:text-2xl font-jakarta text-[#E2DDD6]/90 font-light max-w-2xl mx-auto my-6"
        >
          Four commercial divisions. One corporate authority. Endless Ethiopian ambition.
        </motion.p>

        {/* Signature Element: Triple-Bar Divider in Gold */}
        <TripleBarDivider className="my-8" />
        {/* Strategic Division Portal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10 text-left">

          {/* Division 1: B-VIBE Garment */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            className="group relative bg-white dark:bg-[#111318] border border-[#C84B1A]/25 hover:border-[#C84B1A]/70 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#C84B1A]/15 flex flex-col"
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#C84B1A] to-[#E8721F]" />
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C84B1A]/30 to-[#E8721F]/15 border border-[#C84B1A]/40 flex items-center justify-center text-[#C84B1A] group-hover:scale-110 transition-transform shadow-sm">
                  <Shirt className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-[#C84B1A]/50 tracking-[0.2em] uppercase">01</span>
              </div>
              <div className="text-[10px] uppercase font-extrabold text-[#C84B1A] tracking-[0.18em] mb-1.5">
                Manufacturing
              </div>
              <h3 className="text-lg font-bold font-jakarta text-gray-900 dark:text-[#F4F1EC] group-hover:text-[#C84B1A] dark:group-hover:text-[#C84B1A] transition-colors leading-snug">
                B-VIBE Garment
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#8A9AAF] mt-2 leading-relaxed flex-1">
                Modern fashion, Habesha Kemis, corporate uniform production, and global B2B wholesale export.
              </p>
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#C84B1A]/70">Retail &amp; Wholesale</span>
                <Link
                  href="/garment"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#C84B1A] group-hover:translate-x-1 transition-transform"
                >
                  Enter Portal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Division 2: Tx Digital Marketing */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5 }}
            className="group relative bg-white dark:bg-[#111318] border border-[#2563EB]/25 hover:border-[#2563EB]/70 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#2563EB]/15 flex flex-col"
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#2563EB] to-[#06D6A0]" />
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB]/30 to-[#06D6A0]/15 border border-[#2563EB]/40 flex items-center justify-center text-[#2563EB] group-hover:scale-110 transition-transform shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-[#2563EB]/50 tracking-[0.2em] uppercase">02</span>
              </div>
              <div className="text-[10px] uppercase font-extrabold text-[#2563EB] tracking-[0.18em] mb-1.5">
                Creative Agency
              </div>
              <h3 className="text-lg font-bold font-jakarta text-gray-900 dark:text-[#F4F1EC] group-hover:text-[#2563EB] dark:group-hover:text-[#06D6A0] transition-colors leading-snug">
                T<sup>x</sup> Digital Marketing
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#8A9AAF] mt-2 leading-relaxed flex-1">
                Brand identity, performance marketing, TikTok/Telegram campaigns, and AI-powered creative assets.
              </p>
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2563EB]/70">Data &amp; AI Driven</span>
                <Link
                  href="/digital"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] group-hover:translate-x-1 transition-transform"
                >
                  Enter Portal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Division 3: Strategic Consulting & Training */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.6 }}
            className="group relative bg-white dark:bg-[#111318] border border-[#C8961E]/25 hover:border-[#C8961E]/70 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#C8961E]/15 flex flex-col doc-fold-corner"
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#C8961E] to-[#E2B96E]" />
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8961E]/30 to-[#E2B96E]/15 border border-[#C8961E]/40 flex items-center justify-center text-[#C8961E] group-hover:scale-110 transition-transform shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-[#C8961E]/50 tracking-[0.2em] uppercase">03</span>
              </div>
              <div className="text-[10px] uppercase font-extrabold text-[#C8961E] tracking-[0.18em] mb-1.5">
                Advisory &amp; Training
              </div>
              <h3 className="text-lg font-bold font-jakarta text-gray-900 dark:text-[#F4F1EC] group-hover:text-[#C8961E] dark:group-hover:text-[#C8961E] transition-colors leading-snug">
                Consulting &amp; Training
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#8A9AAF] mt-2 leading-relaxed flex-1">
                Enterprise workflows, AI operating models, vocational capacity building, and leadership workshops.
              </p>
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#C8961E]/70">Advisory &amp; Training</span>
                <Link
                  href="/consulting"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#C8961E] group-hover:translate-x-1 transition-transform"
                >
                  Enter Portal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Division 4: Branding & Promotion */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.7 }}
            className="group relative bg-white dark:bg-[#111318] border border-[#06D6A0]/25 hover:border-[#06D6A0]/70 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#06D6A0]/15 flex flex-col"
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#06D6A0] to-[#059669]" />
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06D6A0]/30 to-[#059669]/15 border border-[#06D6A0]/40 flex items-center justify-center text-[#06D6A0] group-hover:scale-110 transition-transform shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-[#06D6A0]/50 tracking-[0.2em] uppercase">04</span>
              </div>
              <div className="text-[10px] uppercase font-extrabold text-[#06D6A0] tracking-[0.18em] mb-1.5">
                Branding Agency
              </div>
              <h3 className="text-lg font-bold font-jakarta text-gray-900 dark:text-[#F4F1EC] group-hover:text-[#06D6A0] dark:group-hover:text-[#06D6A0] transition-colors leading-snug">
                Branding &amp; Promotion
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#8A9AAF] mt-2 leading-relaxed flex-1">
                Brand strategy, corporate identity design, promotional campaigns, and collateral production.
              </p>
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#06D6A0]/70">Identity &amp; Campaigns</span>
                <Link
                  href="/branding"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#06D6A0] group-hover:translate-x-1 transition-transform"
                >
                  Enter Portal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
