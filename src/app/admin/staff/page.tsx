'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserPlus, ShieldCheck, CheckCircle2, Copy, Key, Loader2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useAuth, getAdminAuthHeaders } from '@/context/AuthContext';
import { UserRole, DivisionType } from '@/types';

type StaffRecord = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  division?: DivisionType;
  status: 'invited' | 'active' | 'deactivated';
  created_at: string;
};

function generateRandomPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
  let pass = 'OE_';
  for (let i = 0; i < 9; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export default function AdminStaffPage() {
  const { user } = useAuth();

  const [staffList, setStaffList] = useState<StaffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('division_staff');
  const [division, setDivision] = useState<DivisionType>('garment');
  const [tempPassword, setTempPassword] = useState(generateRandomPassword());
  const [showPassword, setShowPassword] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Created credentials modal preview
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; pass: string; name: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/staff', {
        headers: getAdminAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch staff list');

      // Map backend staff array
      const mapped: StaffRecord[] = (data.staff || []).map((s: any) => ({
        id: s.id,
        email: s.email,
        name: s.name || s.email.split('@')[0],
        role: s.role || 'division_staff',
        division: s.division === 'bvibe' ? 'garment' : s.division === 'tx' ? 'digital' : s.division,
        status: s.status || 'active',
        created_at: s.created_at || new Date().toISOString(),
      }));
      setStaffList(mapped);
    } catch (err: any) {
      console.error('Fetch staff error:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'super_admin') {
      fetchStaff();
    }
  }, [user, fetchStaff]);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !tempPassword) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    const DIVISION_UI_TO_ID: Record<string, string> = {
      garment: 'bvibe',
      digital: 'tx',
      consulting: 'consulting',
      branding: 'branding',
    };
    const divisionId = role === 'division_staff' ? DIVISION_UI_TO_ID[division] ?? null : null;

    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({
          fullName: name,
          email,
          role,
          divisionId,
          temporaryPassword: tempPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create staff account');

      setCreatedCredentials({
        name,
        email,
        pass: tempPassword,
      });

      // Reset form
      setName('');
      setEmail('');
      setTempPassword(generateRandomPassword());
      setShowModal(false);
      fetchStaff();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (staffId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'deactivated' ? 'active' : 'deactivated';
    try {
      const res = await fetch(`/api/admin/staff/${staffId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update staff status');
      }
      fetchStaff();
    } catch (err: any) {
      alert(`Status update error: ${err.message}`);
    }
  };

  const copyCredentials = () => {
    if (!createdCredentials) return;
    const text = `Origin & Everlasting Staff Portal Account:\nEmail: ${createdCredentials.email}\nTemporary Password: ${createdCredentials.pass}\nLogin at: ${window.location.origin}/admin/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (user?.role !== 'super_admin') {
    return (
      <div className="p-8 text-center text-xs text-[#C84B1A] font-bold">
        Super Admin authorization required for Staff Account Governance.
      </div>
    );
  }

  return (
    <div className="space-y-6 font-jakarta max-w-5xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-[#06D6A0] tracking-wider">Super Admin Governance</span>
          <h1 className="text-3xl font-cormorant font-bold text-[#F4F1EC]">Staff Accounts & Role Credentials</h1>
        </div>

        <button
          onClick={() => { setShowModal(true); setTempPassword(generateRandomPassword()); }}
          className="px-4 py-2.5 bg-[#06D6A0] text-[#080A0F] rounded-xl font-bold text-xs uppercase flex items-center gap-2 hover:bg-[#06D6A0]/90 transition-all shadow-lg"
        >
          <UserPlus className="w-4 h-4" /> Add Division Admin Account
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-[#C84B1A]/20 border border-[#C84B1A] text-[#C84B1A] rounded-xl text-xs font-bold">
          {errorMsg}
        </div>
      )}

      {/* Success Banner when credentials are created */}
      {createdCredentials && (
        <div className="bg-[#06D6A0]/10 border border-[#06D6A0]/40 p-6 rounded-3xl space-y-3 relative shadow-2xl">
          <button onClick={() => setCreatedCredentials(null)} className="absolute top-4 right-4 text-xs text-[#8A9AAF] hover:text-white">✕</button>
          <div className="flex items-center gap-2 text-[#06D6A0]">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Staff Account Created Successfully</h3>
          </div>
          <p className="text-xs text-[#8A9AAF]">
            Please copy the temporary credentials below and hand them over to <strong>{createdCredentials.name}</strong>. They will be able to log in immediately and update their password.
          </p>
          <div className="bg-[#080A0F] border border-white/10 p-4 rounded-2xl space-y-2 text-xs font-mono">
            <div><span className="text-[#8A9AAF]">Corporate Email:</span> <strong className="text-[#F4F1EC]">{createdCredentials.email}</strong></div>
            <div><span className="text-[#8A9AAF]">Temporary Password:</span> <strong className="text-[#06D6A0]">{createdCredentials.pass}</strong></div>
          </div>
          <button
            onClick={copyCredentials}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#06D6A0] text-[#080A0F] font-bold rounded-xl text-xs uppercase hover:bg-[#06D6A0]/90 transition-all"
          >
            <Copy className="w-4 h-4" /> {copied ? 'Copied to Clipboard!' : 'Copy Credentials to Clipboard'}
          </button>
        </div>
      )}

      {/* Staff Accounts List */}
      <div className="bg-[#111318] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-cormorant font-bold text-[#F4F1EC] flex items-center justify-between">
          <span>Division Admin Accounts ({staffList.length})</span>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-[#06D6A0]" />}
        </h3>

        <div className="space-y-3">
          {loading ? (
            <div className="p-8 text-center text-xs text-[#8A9AAF]">Loading division admin accounts...</div>
          ) : staffList.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8A9AAF]">No division admins registered yet. Click &quot;Add Division Admin Account&quot; to create one.</div>
          ) : staffList.map(stf => (
            <div key={stf.id} className="p-4 bg-[#080A0F] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#F4F1EC] text-sm">{stf.name}</span>
                  <span className="px-2 py-0.5 rounded bg-[#06D6A0]/20 text-[#06D6A0] text-[10px] font-bold uppercase">{stf.role}</span>
                  {stf.division && <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] uppercase">{stf.division}</span>}
                </div>
                <div className="text-xs text-[#8A9AAF]">{stf.email} · Created {new Date(stf.created_at).toLocaleDateString()}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${stf.status === 'active' ? 'bg-[#06D6A0]/20 text-[#06D6A0]' : 'bg-[#C84B1A]/20 text-[#C84B1A]'}`}>
                  {stf.status === 'active' ? 'Active' : 'Deactivated'}
                </span>
                <button
                  onClick={() => handleToggleStatus(stf.id, stf.status)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs text-[#F4F1EC] transition-all"
                >
                  {stf.status === 'active' ? 'Deactivate' : 'Reactivate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center font-jakarta">
          <form onSubmit={handleCreateStaff} className="bg-[#111318] border border-[#06D6A0]/40 p-8 rounded-3xl max-w-md w-full space-y-5 shadow-2xl relative">
            <button type="button" onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-white text-xs hover:text-[#06D6A0]">✕</button>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#06D6A0]">Super Admin Action</span>
              <h3 className="text-2xl font-cormorant font-bold text-[#F4F1EC]">Create Division Admin Account</h3>
              <p className="text-[10px] text-[#8A9AAF] mt-1">This admin will manage their division&apos;s orders, payment verifications, content, and enquiries.</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Admin Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Abebe Bikila"
                  className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] outline-none focus:border-[#06D6A0]"
                />
              </div>

              <div>
                <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin.name@origineverlasting.com"
                  className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] outline-none focus:border-[#06D6A0]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[#8A9AAF] uppercase font-bold">Temporary Password *</label>
                  <button
                    type="button"
                    onClick={() => setTempPassword(generateRandomPassword())}
                    className="text-[#06D6A0] hover:underline text-[10px] flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={tempPassword}
                    onChange={e => setTempPassword(e.target.value)}
                    className="w-full p-3 pr-10 bg-[#080A0F] border border-white/10 rounded-xl text-[#06D6A0] font-mono font-bold outline-none focus:border-[#06D6A0]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-[#8A9AAF] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-[#8A9AAF] mt-1">The new staff member will log in with this temporary password.</p>
              </div>

              <div>
                <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Staff Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] outline-none focus:border-[#06D6A0]"
                >
                  <option value="division_staff">Division Admin — Manages division orders, payments, content & enquiries</option>
                  <option value="finance_reviewer">Finance Reviewer — Payment verification only (all divisions)</option>
                  <option value="super_admin">Super Admin — Full system access</option>
                </select>
              </div>

              {role === 'division_staff' && (
                <div>
                  <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Assigned Division</label>
                  <select
                    value={division}
                    onChange={e => setDivision(e.target.value as any)}
                    className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] outline-none focus:border-[#06D6A0]"
                  >
                    <option value="garment">B-VIBE Garment Manufacturing</option>
                    <option value="digital">Tˣ Digital Agency</option>
                    <option value="consulting">Strategic Business Advisory</option>
                    <option value="branding">Branding & Promotion</option>
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#06D6A0] text-[#080A0F] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#06D6A0]/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {isSubmitting ? 'Creating Account...' : 'Confirm Account & Password Creation'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
