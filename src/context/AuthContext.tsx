'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, DivisionType } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string; requiresOtp?: boolean; devOtp?: string }>;
  verifyAdminOtp: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  verifyEmail: (email: string, token: string) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  switchDemoRole: (role: UserRole, division?: DivisionType) => void;
}

// ── Supabase access-token stored in sessionStorage (client only) ──────────────
const TOKEN_KEY = 'oe_access_token';

function saveToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function getAdminAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
    'X-Admin-Session-Token': token,
  };
}

// ── Map backend user response → frontend User type ────────────────────────────
function mapBackendUser(raw: any): User {
  const backendRole: string = raw.role || 'customer';
  const divisionRaw: string | undefined = raw.division;

  let division: DivisionType | undefined;
  if (divisionRaw === 'bvibe' || divisionRaw === 'garment') division = 'garment';
  else if (divisionRaw === 'tx' || divisionRaw === 'digital') division = 'digital';
  else if (divisionRaw === 'consulting') division = 'consulting';
  else if (divisionRaw === 'branding') division = 'branding';

  const role: UserRole =
    backendRole === 'super_admin' ? 'super_admin'
    : backendRole === 'finance_reviewer' ? 'finance_reviewer'
    : backendRole === 'division_staff' ? 'division_staff'
    : 'customer';

  return {
    id: raw.id,
    name: raw.name || raw.full_name || (raw.email?.split('@')[0] ?? 'User'),
    email: raw.email,
    phone: raw.phone || '',
    role,
    division,
    is_verified: raw.emailVerified ?? (raw.email_confirmed_at != null),
    avatar: raw.avatar_url ?? undefined,
    created_at: raw.createdAt || raw.created_at || new Date().toISOString(),
  };
}

// ── Helper: POST to Next.js API proxy with optional Bearer token ───────────────
async function apiPost(path: string, body: unknown, token?: string | null) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['X-Admin-Session-Token'] = token;
  }
  const res = await fetch(path, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

// ── Demo staff accounts for convenience role-switching (not for real login) ───
const DEMO_STAFF: Record<string, User> = {
  'garment_staff': {
    id: 'demo_staff_garment', name: 'B-VIBE Staff', email: 'garment.staff@origineverlasting.com',
    phone: '+251911556677', role: 'division_staff', division: 'garment',
    is_verified: true, created_at: '2026-06-15T08:30:00Z',
  },
  'digital_staff': {
    id: 'demo_staff_digital', name: 'TĒ£ Staff', email: 'tx.staff@origineverlasting.com',
    phone: '+251922334455', role: 'division_staff', division: 'digital',
    is_verified: true, created_at: '2026-06-15T08:30:00Z',
  },
  'consulting_staff': {
    id: 'demo_staff_consulting', name: 'Consulting Staff', email: 'consulting.staff@origineverlasting.com',
    phone: '+251922334456', role: 'division_staff', division: 'consulting',
    is_verified: true, created_at: '2026-06-15T08:30:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session from stored token on mount ──────────────────────────────
  useEffect(() => {
    const restore = async () => {
      try {
        const overrideJson = localStorage.getItem('oe_demo_override');
        if (overrideJson) {
          const override = JSON.parse(overrideJson) as User;
          setUser(override);
          setLoading(false);
          return;
        }

        const token = getStoredToken();
        if (!token) { setLoading(false); return; }

        const headers = {
          Authorization: `Bearer ${token}`,
          'X-Admin-Session-Token': token,
        };

        // First try admin session restore (for division admins / super admins)
        // /api/admin/auth/me returns flat { id, email, name, role, division, isSuperAdmin }
        const adminRes = await fetch('/api/admin/auth/me', { headers });
        if (adminRes.ok) {
          const adminData = await adminRes.json();
          // Valid admin me response has id + role
          if (adminData.id && adminData.role && adminData.role !== 'customer') {
            const mapped = mapBackendUser({
              id: adminData.id,
              email: adminData.email,
              name: adminData.name,
              role: adminData.role,
              division: adminData.division,
            });
            setUser(mapped);
            setLoading(false);
            return;
          }
        }

        // Fallback: try customer auth
        const res = await fetch('/api/auth/me', { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.user) setUser(mapBackendUser(data.user));
          else { saveToken(null); setUser(null); }
        } else {
          saveToken(null);
          setUser(null);
        }
      } catch {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);


  const login = useCallback(async (email: string, password: string) => {
    try {
      const { ok, data } = await apiPost('/api/auth/login', { email, password });
      if (!ok) return { success: false, message: data.error || 'Login failed' };

      if (data.session?.access_token) saveToken(data.session.access_token);
      if (data.user) {
        const mapped = mapBackendUser(data.user);
        setUser(mapped);
        localStorage.removeItem('oe_demo_override');
      }
      return { success: true };
    } catch {
      return { success: false, message: 'Network error — please check your connection.' };
    }
  }, []);

  // ── Admin login — Step 1: email+password → triggers OTP email ────────────────
  // const adminLogin = useCallback(async (email: string, password: string) => {
  //   try {
  //     const { ok, data } = await apiPost('/api/admin/auth/login', { email, password });
  //     if (!ok) return { success: false, message: data.error || 'Invalid admin credentials' };
  //     // Step 1 success: OTP has been sent to email
  //     return { success: true, requiresOtp: true, message: data.message, devOtp: data.devOtp };
  //   } catch {
  //     return { success: false, message: 'Network error — please check your connection.' };
  //   }
  // }, []);


// ── Admin login — Step 1: email+password → triggers OTP email (or full session if OTP disabled) ──
const adminLogin = useCallback(async (email: string, password: string) => {
  try {
    const { ok, data } = await apiPost('/api/admin/auth/login', { email, password });
    if (!ok) return { success: false, message: data.error || 'Invalid admin credentials' };

    // OTP disabled backend-side (REQUIRE_ADMIN_OTP=false) — full session returned immediately
    if (data.sessionToken && data.staff) {
      saveToken(data.sessionToken);
      const mapped = mapBackendUser(data.staff);
      setUser(mapped);
      localStorage.removeItem('oe_demo_override');
      return { success: true, requiresOtp: false, message: data.message };
    }

    // Normal flow — OTP has been sent to email
    return { success: true, requiresOtp: true, message: data.message, devOtp: data.devOtp };
  } catch {
    return { success: false, message: 'Network error — please check your connection.' };
  }
}, []);





  // ── Admin login — Step 2: OTP → session token + user ──────────────────────
  const verifyAdminOtp = useCallback(async (email: string, otp: string) => {
    try {
      const { ok, data } = await apiPost('/api/admin/auth/verify-otp', { email, otp });
      if (!ok) return { success: false, message: data.error || 'Invalid or expired OTP' };

      // Step 2 success: sessionToken + staff object returned
      const token = data.sessionToken || data.session_token || data.token;
      if (token) saveToken(token);

      if (data.staff) {
        const mapped = mapBackendUser(data.staff);
        setUser(mapped);
        localStorage.removeItem('oe_demo_override');
      }
      return { success: true };
    } catch {
      return { success: false, message: 'Network error — please check your connection.' };
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, phone: string, password: string) => {
    try {
      const { ok, data } = await apiPost('/api/auth/register', { name, email, phone, password, role: 'customer' });
      if (!ok) return { success: false, message: data.error || 'Registration failed' };

      if (data.user) setUser(mapBackendUser(data.user));
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: 'Network error — please check your connection.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = getStoredToken();
      if (token) {
        await apiPost('/api/admin/auth/logout', {}, token);
        await apiPost('/api/auth/logout', {}, token);
      }
    } catch { /* best-effort */ }
    saveToken(null);
    localStorage.removeItem('oe_demo_override');
    setUser(null);
  }, []);

  const verifyEmail = useCallback(async (email: string, token: string) => {
    try {
      const { ok, data } = await apiPost('/api/auth/verify-email', { email, token });
      if (!ok) return { success: false, message: data.error || 'Verification failed' };
      // Mark current user as verified
      setUser(u => u ? { ...u, is_verified: true } : u);
      return { success: true, message: data.message || 'Email verified successfully.' };
    } catch {
      return { success: false, message: 'Network error' };
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      const { ok, data } = await apiPost('/api/auth/forgot-password', { email });
      if (!ok) return { success: false, message: data.error || 'Request failed' };
      return { success: true, message: data.message || `Reset link sent to ${email}` };
    } catch {
      return { success: false, message: 'Network error' };
    }
  }, []);

  // ── Role switcher kept for staff/admin quick-switch convenience ───────────────
  const switchDemoRole = useCallback((role: UserRole, division?: DivisionType) => {
    const key = division ? `${division}_staff` : role;
    const demo = DEMO_STAFF[key];
    if (demo) {
      setUser(demo);
      localStorage.setItem('oe_demo_override', JSON.stringify(demo));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, verifyAdminOtp, signup, logout, verifyEmail, forgotPassword, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
