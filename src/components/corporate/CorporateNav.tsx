'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shirt, Sparkles, Building2, GraduationCap, Globe, Menu, X, ShoppingBag, Sun, Moon, User as UserIcon, LogOut, CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export const CorporateNav: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout, verifyEmail } = useAuth();

  const getActiveDivision = () => {
    if (pathname?.startsWith('/garment')) return 'bvibe';
    if (pathname?.startsWith('/digital')) return 'tx';
    if (pathname?.startsWith('/consulting')) return 'consulting';
    if (pathname?.startsWith('/branding')) return 'branding';
    return 'corporate';
  };

  const activeDivision = getActiveDivision();

  const navTheme = {
    corporate: 'bg-[#080A0F]/90 border-[#111318]',
    bvibe: 'bg-[#0A0A0A]/95 border-[#C84B1A]/20',
    tx: 'bg-[#060810]/95 border-[#2563EB]/20',
    consulting: 'bg-[#0C1420]/95 border-[#C8961E]/20',
    branding: 'bg-[#080A0F]/95 border-[#06D6A0]/20',
  };

  return (
    <>
      {/* Email Verification Banner */}
      {user && !user.is_verified && (
        <div className="bg-[#C8961E]/90 text-[#080A0F] px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Your email (<strong>{user.email}</strong>) requires verification. Please confirm your inbox or click verify.
            </span>
            <button
              onClick={() => router.push(`/auth/verify-email?email=${encodeURIComponent(user.email)}`)}
              className="ml-auto px-3 py-1 bg-[#080A0F] text-[#C8961E] rounded-md font-bold uppercase text-[10px] hover:bg-black transition-all shrink-0"
            >
              Verify Email Now
            </button>
          </div>
        </div>
      )}

      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${navTheme[activeDivision]}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center gap-6">
          
          {/* Corporate Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C8961E] via-[#8A9AAF] to-[#080A0F] p-[1px] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#080A0F] rounded-[7px] flex items-center justify-center font-cormorant text-xl font-bold text-[#C8961E]">
                OE
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-cormorant text-xl sm:text-2xl font-semibold tracking-wider text-[#F4F1EC] group-hover:text-[#C8961E] transition-colors leading-tight">
                ORIGIN <span className="text-[#8A9AAF] font-light">&</span> EVERLASTING
              </div>
              <div className="text-[10px] tracking-[0.25em] text-[#8A9AAF] uppercase font-jakarta leading-tight mt-0.5">
                TRADING PLC · ETHIOPIA
              </div>
            </div>
          </Link>

          {/* Division Switcher Desktop Bar */}
          <nav className="hidden md:flex flex-1 justify-center items-center">
            <div className="flex items-center gap-1 bg-white/5 dark:bg-[#111318]/80 p-1.5 rounded-full border border-white/10 shadow-inner">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold leading-none transition-all ${
                activeDivision === 'corporate'
                  ? 'bg-[#C8961E] text-[#080A0F] shadow-sm font-bold'
                  : 'text-[#8A9AAF] hover:text-[#F4F1EC]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Corporate HQ
            </Link>
            <Link
              href="/garment"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold leading-none transition-all ${
                activeDivision === 'bvibe'
                  ? 'bg-[#C84B1A] text-white shadow-sm font-bold'
                  : 'text-[#8A9AAF] hover:text-[#F4F1EC]'
              }`}
            >
              <Shirt className="w-3.5 h-3.5 text-[#C84B1A]" /> B-VIBE Garment
            </Link>
            <Link
              href="/digital"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold leading-none transition-all ${
                activeDivision === 'tx'
                  ? 'bg-[#2563EB] text-white shadow-sm font-bold'
                  : 'text-[#8A9AAF] hover:text-[#F4F1EC]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" /> Tˣ Digital
            </Link>
            <Link
              href="/consulting"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold leading-none transition-all ${
                activeDivision === 'consulting'
                  ? 'bg-[#1E3A5F] text-[#F4F1EC] shadow-sm font-bold border border-[#C8961E]'
                  : 'text-[#8A9AAF] hover:text-[#F4F1EC]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#C8961E]" /> Consulting
            </Link>
            <Link
              href="/branding"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold leading-none transition-all ${
                activeDivision === 'branding'
                  ? 'bg-[#06D6A0] text-[#080A0F] shadow-sm font-bold'
                  : 'text-[#8A9AAF] hover:text-[#F4F1EC]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#06D6A0]" /> Branding
            </Link>
            </div>
          </nav>

          {/* Right Action Utilities */}
          <div className="hidden lg:flex items-center gap-3 ml-auto shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-[#111318] border border-white/10 text-[#C8961E] hover:scale-105 transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-[#2563EB]" />}
            </button>

            {/* Shopping Cart Link */}
            <Link
              href="/garment/cart"
              className="relative p-2.5 rounded-full bg-[#111318] border border-white/10 text-[#F4F1EC] hover:text-[#C84B1A] transition-all"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C84B1A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Session Aware Auth Header */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-[#111318] border border-white/10 hover:border-[#C8961E] transition-all"
                >
                  <span className="text-xs font-bold text-[#F4F1EC] max-w-[100px] truncate">{user.name}</span>
                  <div className="w-7 h-7 rounded-full bg-[#C8961E] text-[#080A0F] font-bold text-xs flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name[0]
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#111318] border border-white/15 rounded-2xl p-3 shadow-2xl space-y-2 z-50 font-jakarta">
                    <div className="p-2 bg-[#080A0F] rounded-xl space-y-1">
                      <div className="text-xs font-bold text-[#F4F1EC] flex items-center justify-between">
                        {user.name}
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-[#C8961E]/20 text-[#C8961E] font-bold">
                          {user.role}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8A9AAF] truncate">{user.email}</div>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#F4F1EC] hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#C8961E]" /> Customer Dashboard
                    </Link>

                    {(user.role === 'division_staff' || user.role === 'super_admin') && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#06D6A0] hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <Shield className="w-4 h-4" /> Admin Portal
                      </Link>
                    )}

                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#C84B1A] hover:bg-white/5 rounded-xl transition-colors pt-2 border-t border-white/10"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-6 py-2.5 bg-[#C8961E] text-[#080A0F] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#B8851A] transition-all shadow-lg shadow-[#C8961E]/20 whitespace-nowrap"
              >
                <UserIcon className="w-3.5 h-3.5" /> Sign In / Account
              </Link>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-lg bg-white/5 text-[#F4F1EC] relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C84B1A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#F4F1EC] hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#080A0F] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 font-jakarta">
            <div className="text-xs uppercase tracking-wider text-[#8A9AAF] font-semibold mb-2">Divisions</div>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#F4F1EC] bg-white/5"
            >
              Corporate Headquarters
            </Link>
            <Link
              href="/garment"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-[#C84B1A] bg-[#C84B1A]/10"
            >
              <span className="flex items-center gap-2"><Shirt className="w-4 h-4" /> B-VIBE Garment</span>
              <span className="text-xs text-[#8A9AAF]">Retail & Wholesale</span>
            </Link>
            <Link
              href="/digital"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-[#2563EB] bg-[#2563EB]/10"
            >
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Tˣ Digital Marketing</span>
              <span className="text-xs text-[#8A9AAF]">Creative Agency</span>
            </Link>
            <Link
              href="/consulting"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-[#C8961E] bg-[#C8961E]/10"
            >
              <span className="flex items-center gap-2"><Building2 className="w-4 h-4" /> Strategic Consulting</span>
              <span className="text-xs text-[#8A9AAF]">Advisory</span>
            </Link>
            <Link
              href="/branding"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-[#06D6A0] bg-[#06D6A0]/10"
            >
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Branding &amp; Promotion</span>
              <span className="text-xs text-[#8A9AAF]">Agency</span>
            </Link>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-[#C8961E] py-1">
                    My Account ({user.name})
                  </Link>
                  {(user.role === 'division_staff' || user.role === 'super_admin') && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-[#06D6A0] py-1">
                      Admin Portal
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-sm text-[#C84B1A] text-left py-1">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-[#C8961E] py-1">
                  Sign In / Create Account
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
