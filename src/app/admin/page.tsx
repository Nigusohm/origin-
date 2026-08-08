'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageSquare, CreditCard, Shield, ArrowRight, CheckCircle2, Clock, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { useAuth, getAdminAuthHeaders } from '@/context/AuthContext';

interface DashboardKpiData {
  period: { start: string; label: string };
  kpis: {
    revenue: { current: number; previous: number; trendPercent: number };
    orders: { current: number; previous: number; trendPercent: number };
    enquiries: { current: number; previous: number; trendPercent: number };
    pendingVerifications: { current: number; trendPercent: number | null };
  };
}

interface PaymentRecord {
  id: string;
  division: string;
  order_id: string | null;
  enquiry_id: string | null;
  customer_email: string;
  amount_etb: number;
  payment_method: string;
  proof_file_url: string | null;
  transaction_reference: string | null;
  status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';
  const division = user?.division;

  const [kpiData, setKpiData] = useState<DashboardKpiData | null>(null);
  const [pendingPayments, setPendingPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAdminAuthHeaders();

      const [kpiRes, paymentsRes] = await Promise.all([
        fetch('/api/admin/dashboard/kpis', { headers }),
        fetch('/api/admin/payments?status=payment_submitted', { headers }),
      ]);

      if (kpiRes.ok) {
        const kpiJson = await kpiRes.json();
        if (kpiJson.kpis) setKpiData(kpiJson);
      }

      if (paymentsRes.ok) {
        const paymentsJson = await paymentsRes.json();
        if (Array.isArray(paymentsJson.payments)) {
          setPendingPayments(paymentsJson.payments);
        }
      }
    } catch (err: any) {
      console.error('Fetch dashboard telemetry error:', err);
      setError(err.message || 'Failed to load telemetry');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTelemetryData();
  }, [fetchTelemetryData]);

  const rev = kpiData?.kpis?.revenue?.current ?? 0;
  const ordersCount = kpiData?.kpis?.orders?.current ?? 0;
  const enquiriesCount = kpiData?.kpis?.enquiries?.current ?? 0;
  const pendingCount = kpiData?.kpis?.pendingVerifications?.current ?? pendingPayments.length;

  return (
    <div className="space-y-8 font-jakarta">
      
      {/* Top Banner */}
      <div className="bg-[#111318] border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-[#06D6A0] tracking-wider">
              {isSuperAdmin ? 'Super Admin HQ Operations' : `${division?.toUpperCase()} Division Admin Management Portal`}
            </span>
          </div>
          <h1 className="text-3xl font-cormorant font-bold text-[#F4F1EC] mt-1">
            {isSuperAdmin ? 'Enterprise Operations & Division Telemetry' : `${division?.toUpperCase()} Division Operational Dashboard`}
          </h1>
          <p className="text-xs text-[#8A9AAF] mt-1">
            Real-time analytics for division orders, commercial quotes, and customer payment verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTelemetryData}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#8A9AAF] hover:text-white transition-colors"
            title="Refresh Telemetry Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link href="/admin/payments" className="px-4 py-2.5 bg-[#06D6A0] text-[#080A0F] rounded-xl font-bold text-xs uppercase flex items-center gap-2 shadow-lg">
            Review Payment Proofs ({pendingCount})
          </Link>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 text-[#8A9AAF]">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading backend analytics telemetry...
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#C84B1A]/10 border border-[#C84B1A]/30 text-[#C84B1A] rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#111318] border border-white/10 p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8A9AAF]">
            <span>Pending Proof Verifications</span>
            <AlertTriangle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-400 font-mono-code">{pendingCount}</div>
          <div className="text-[10px] text-[#8A9AAF]">Requires staff receipt audit</div>
        </div>

        <div className="bg-[#111318] border border-white/10 p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8A9AAF]">
            <span>Open Customer Enquiries</span>
            <MessageSquare className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-3xl font-bold text-[#2563EB] font-mono-code">{enquiriesCount}</div>
          <div className="text-[10px] text-[#8A9AAF]">Commercial proposals & quotes</div>
        </div>

        <div className="bg-[#111318] border border-white/10 p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8A9AAF]">
            <span>Total Active Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#C8961E]" />
          </div>
          <div className="text-3xl font-bold text-[#C8961E] font-mono-code">{ordersCount}</div>
          <div className="text-[10px] text-[#8A9AAF]">In production or fulfilling</div>
        </div>

        <div className="bg-[#111318] border border-white/10 p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8A9AAF]">
            <span>Verified Division Revenue</span>
            <CheckCircle2 className="w-4 h-4 text-[#06D6A0]" />
          </div>
          <div className="text-2xl font-bold text-[#06D6A0] font-mono-code">{rev.toLocaleString()} ETB</div>
          <div className="text-[10px] text-[#8A9AAF]">Verified customer payments</div>
        </div>
      </div>

      {/* Immediate Attention Queue */}
      <div className="bg-[#111318] border border-white/10 rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-cormorant font-bold text-[#F4F1EC]">
              Uploaded Receipts Requiring Division Verification ({pendingPayments.length})
            </h2>
            <p className="text-xs text-[#8A9AAF]">Review incoming bank transfer screenshots &amp; mobile money receipts.</p>
          </div>
          <Link href="/admin/payments" className="text-xs text-[#06D6A0] font-bold hover:underline flex items-center gap-1">
            View All ({pendingPayments.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingPayments.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#8A9AAF]">
            No payment proofs pending review. All customer receipts up to date!
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPayments.map(payment => (
              <div key={payment.id} className="p-4 bg-[#080A0F] border border-purple-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {payment.proof_file_url ? (
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
                      <img src={payment.proof_file_url} alt="Receipt thumbnail" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <CreditCard className="w-8 h-8 text-[#C8961E]" />
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-code text-xs font-bold text-purple-400">
                        #{payment.order_id || payment.enquiry_id || payment.id}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-[#8A9AAF]">{payment.division}</span>
                      <span className="text-xs text-[#F4F1EC] font-bold">{payment.customer_email}</span>
                    </div>
                    <div className="text-xs text-[#8A9AAF] mt-0.5">
                      Amount: <strong className="text-[#C84B1A] font-mono-code">{Number(payment.amount_etb).toLocaleString()} ETB</strong>
                      {payment.transaction_reference && <> · Tx Ref: <strong className="text-[#06D6A0]">{payment.transaction_reference}</strong></>}
                    </div>
                  </div>
                </div>

                <Link
                  href="/admin/payments"
                  className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs uppercase hover:bg-purple-500 transition-colors shrink-0"
                >
                  Inspect &amp; Verify Receipt →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
