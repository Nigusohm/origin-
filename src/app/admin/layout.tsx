'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, ShoppingBag, MessageSquare, CreditCard, Users, Settings, Filter, LogOut, FilePenLine, Key, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth, getAdminAuthHeaders } from '@/context/AuthContext';
import { DivisionType } from '@/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<DivisionType | 'all'>('all');

  // Change password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);



const PUBLIC_ADMIN_PATHS = ['/admin/login'];
const isPublicAdminPath = PUBLIC_ADMIN_PATHS.includes(pathname);

if (isPublicAdminPath) {
  return <>{children}</>;
}
  if (!user || user.role === 'customer') {
    return (
      <main className="min-h-screen bg-[#080A0F] text-[#F4F1EC] py-20 px-4 text-center space-y-4 font-jakarta">
        <Shield className="w-12 h-12 text-[#C84B1A] mx-auto" />
        <h1 className="text-3xl font-cormorant font-bold text-[#F4F1EC]">Access Restricted</h1>
        <p className="text-xs text-[#8A9AAF]">Admin authentication required to view internal staff queues.</p>
        <Link href="/admin/login" className="inline-block px-6 py-3 bg-[#06D6A0] text-[#080A0F] font-bold text-xs rounded-xl uppercase">
          Sign In to Admin Portal
        </Link>
      </main>
    );
  }

  const isSuperAdmin = user.role === 'super_admin';
  const staffDivision = user.division;

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      setPasswordSuccess('Password updated successfully! You can use your new password next time you sign in.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowPasswordModal(false), 2500);
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-[#F4F1EC] font-jakarta flex flex-col">
      
      {/* Top Admin Header */}
      <header className="bg-[#111318] border-b border-white/10 px-4 sm:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#06D6A0] text-[#080A0F] flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#F4F1EC]">Origin & Everlasting Admin Portal</h1>
              <span className="px-2 py-0.5 rounded bg-[#06D6A0]/20 text-[#06D6A0] text-[10px] font-bold uppercase">
                {isSuperAdmin ? 'Super Admin' : `${staffDivision?.toUpperCase()} Staff`}
              </span>
            </div>
            <p className="text-[11px] text-[#8A9AAF]">Logged in as {user.name} ({user.email})</p>
          </div>
        </div>

        {/* Division Filter Bar & Actions */}
        <div className="flex items-center gap-3">
          {isSuperAdmin ? (
            <div className="flex items-center gap-2 bg-[#080A0F] border border-white/10 p-1.5 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-[#06D6A0] ml-1" />
              <span className="text-[#8A9AAF]">Division Filter:</span>
              <select
                value={selectedDivisionFilter}
                onChange={e => setSelectedDivisionFilter(e.target.value as any)}
                className="bg-transparent text-[#F4F1EC] font-bold outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#111318]">All Divisions</option>
                <option value="garment" className="bg-[#111318]">B-VIBE Garment</option>
                <option value="digital" className="bg-[#111318]">Tˣ Digital Agency</option>
                <option value="consulting" className="bg-[#111318]">Strategic Consulting</option>
                <option value="branding" className="bg-[#111318]">Branding & Promotion</option>
              </select>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-[#080A0F] border border-white/10 rounded-xl text-xs font-bold text-[#C8961E]">
              Assigned Division: {staffDivision?.toUpperCase()}
            </div>
          )}

          <button
            onClick={() => { setShowPasswordModal(true); setPasswordError(null); setPasswordSuccess(null); }}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-[#06D6A0] flex items-center gap-1.5 transition-all"
            title="Change Account Password"
          >
            <Key className="w-3.5 h-3.5" /> Password
          </button>

          <Link href="/account" className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-[#8A9AAF]">
            Exit Admin
          </Link>
          <button onClick={logout} className="p-2 text-[#C84B1A] hover:bg-white/5 rounded-xl" title="Sign Out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Admin Nav Sub-Bar */}
      <div className="bg-[#080A0F] border-b border-white/10 px-4 sm:px-8 py-2 overflow-x-auto">
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          {[
            { href: '/admin', label: 'Dashboard Overview', icon: Shield },
            { href: '/admin/orders', label: 'Orders Queue', icon: ShoppingBag },
            { href: '/admin/enquiries', label: 'Enquiries Queue & Quotes', icon: MessageSquare },
            { href: '/admin/payments', label: 'Payment Verification', icon: CreditCard },
            ...(isSuperAdmin || user.role === 'division_staff'
              ? [{ href: '/admin/content', label: isSuperAdmin ? 'Content' : 'My Division Content', icon: FilePenLine }]
              : []),
            ...(isSuperAdmin
              ? [
                  { href: '/admin/accounts', label: 'Division Payment Accounts', icon: Settings },
                  { href: '/admin/staff', label: 'Staff Management', icon: Users },
                ]
              : []),
          ].map(tab => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#06D6A0] text-[#080A0F] shadow-lg'
                    : 'bg-[#111318] text-[#8A9AAF] hover:text-white border border-white/10'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" /> {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">{children}</div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center font-jakarta">
          <form onSubmit={handleChangePasswordSubmit} className="bg-[#111318] border border-[#06D6A0]/40 p-8 rounded-3xl max-w-md w-full space-y-5 shadow-2xl relative">
            <button type="button" onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 text-xs text-[#8A9AAF] hover:text-white">✕</button>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#06D6A0]">Security & Account Credentials</span>
              <h3 className="text-2xl font-cormorant font-bold text-[#F4F1EC]">Change Account Password</h3>
            </div>

            {passwordError && (
              <div className="p-3 bg-[#C84B1A]/20 border border-[#C84B1A] text-[#C84B1A] rounded-xl text-xs font-bold">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-[#06D6A0]/20 border border-[#06D6A0] text-[#06D6A0] rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {passwordSuccess}
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Current (Temporary) Password *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current or temporary password"
                  className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] outline-none focus:border-[#06D6A0]"
                />
              </div>

              <div>
                <label className="block text-[#8A9AAF] uppercase font-bold mb-1">New Desired Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] outline-none focus:border-[#06D6A0]"
                />
              </div>

              <div>
                <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] outline-none focus:border-[#06D6A0]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-3.5 bg-[#06D6A0] text-[#080A0F] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#06D6A0]/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              {passwordLoading ? 'Updating Password...' : 'Update & Save New Password'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
