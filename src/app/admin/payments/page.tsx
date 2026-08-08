'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, CheckCircle2, XCircle, Eye, Loader2, RefreshCw } from 'lucide-react';
import { getAdminAuthHeaders } from '@/context/AuthContext';

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
  rejection_reason: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'payment_submitted':
      return <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold uppercase">Awaiting Review</span>;
    case 'payment_verified':
      return <span className="px-2.5 py-0.5 rounded-full bg-[#06D6A0]/20 text-[#06D6A0] border border-[#06D6A0]/30 text-[10px] font-bold uppercase">Verified</span>;
    case 'payment_rejected':
      return <span className="px-2.5 py-0.5 rounded-full bg-[#C84B1A]/20 text-[#C84B1A] border border-[#C84B1A]/30 text-[10px] font-bold uppercase">Rejected</span>;
    default:
      return <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase">{status}</span>;
  }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/payments', {
        headers: getAdminAuthHeaders(),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || `Failed to load payments (${res.status})`);
      }
      const data = await res.json();
      setPayments(Array.isArray(data.payments) ? data.payments : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleVerify = async (paymentId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: 'POST',
        headers: getAdminAuthHeaders(),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to verify payment');
      }
      setSelectedPayment(null);
      await fetchPayments();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment || !rejectionReason) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/${selectedPayment.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to reject payment');
      }
      setSelectedPayment(null);
      setRejectionReason('');
      setShowRejectInput(false);
      await fetchPayments();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = payments.filter(p => p.status === 'payment_submitted').length;

  return (
    <div className="space-y-6 font-jakarta">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold text-[#06D6A0] tracking-wider">Division Finance Audit</span>
          <h1 className="text-3xl font-cormorant font-bold text-[#F4F1EC]">Payment Proof Receipt Verification Queue</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#8A9AAF]">{pendingCount} Pending &middot; {payments.length} Total</span>
          <button
            onClick={fetchPayments}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#8A9AAF] hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-[#8A9AAF]">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading payment proofs...
        </div>
      )}

      {!loading && error && (
        <div className="bg-[#C84B1A]/10 border border-[#C84B1A]/30 text-[#C84B1A] p-4 rounded-2xl text-xs">
          {error}
        </div>
      )}

      {!loading && !error && payments.length === 0 && (
        <div className="bg-[#111318] p-8 rounded-3xl text-center text-xs text-[#8A9AAF]">
          No payment proof receipts submitted for review yet.
        </div>
      )}

      {!loading && payments.length > 0 && (
        <div className="space-y-4">
          {payments.map(payment => (
            <div key={payment.id} className="bg-[#111318] border border-white/10 p-6 rounded-3xl space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  {payment.proof_file_url ? (
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-black border border-white/20 shrink-0">
                      <img src={payment.proof_file_url} alt="Proof Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <CreditCard className="w-10 h-10 text-[#C8961E]" />
                  )}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono-code text-xs font-bold text-[#06D6A0]">
                        #{payment.order_id || payment.enquiry_id || payment.id}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-[#8A9AAF]">{payment.division}</span>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="text-xs text-[#8A9AAF] mt-1">
                      Client: <strong className="text-white">{payment.customer_email}</strong>
                      {payment.transaction_reference && (
                        <> &middot; Tx Ref: <strong className="text-[#06D6A0]">{payment.transaction_reference}</strong></>
                      )}
                    </div>
                    <div className="text-[10px] text-[#8A9AAF] mt-0.5">
                      Submitted: {new Date(payment.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#C84B1A] font-mono-code">
                      {Number(payment.amount_etb).toLocaleString()} ETB
                    </div>
                    <div className="text-[10px] text-[#8A9AAF]">{payment.payment_method}</div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowRejectInput(false);
                      setRejectionReason('');
                    }}
                    className="px-4 py-2.5 bg-[#06D6A0] text-[#080A0F] font-bold rounded-xl text-xs uppercase hover:bg-[#06D6A0]/90 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> Inspect Receipt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verification Lightbox Viewer */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex items-center justify-center font-jakarta">
          <div className="bg-[#111318] border border-white/15 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
            <button
              onClick={() => setSelectedPayment(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            >
              &times;
            </button>

            {/* Proof Image Viewer */}
            <div className="w-full md:w-1/2 aspect-[4/3] bg-black relative p-4 flex items-center justify-center border-r border-white/10">
              {selectedPayment.proof_file_url ? (
                <img
                  src={selectedPayment.proof_file_url}
                  alt="Proof Full Size"
                  className="max-w-full max-h-full object-contain rounded-xl"
                />
              ) : (
                <div className="text-xs text-[#8A9AAF]">No image file uploaded.</div>
              )}
            </div>

            {/* Verification Context Panel */}
            <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#06D6A0]">{selectedPayment.division} Division</span>
                  <h3 className="text-xl font-bold font-cormorant text-[#F4F1EC]">
                    #{selectedPayment.order_id || selectedPayment.enquiry_id || selectedPayment.id}
                  </h3>
                </div>

                <div className="p-4 bg-[#080A0F] rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-[#8A9AAF]">Client:</span><strong className="text-white">{selectedPayment.customer_email}</strong></div>
                  <div className="flex justify-between"><span className="text-[#8A9AAF]">Amount:</span><strong className="text-[#C84B1A] font-mono-code">{Number(selectedPayment.amount_etb).toLocaleString()} ETB</strong></div>
                  <div className="flex justify-between"><span className="text-[#8A9AAF]">Method:</span><span className="text-white">{selectedPayment.payment_method}</span></div>
                  {selectedPayment.transaction_reference && (
                    <div className="flex justify-between"><span className="text-[#8A9AAF]">Tx Ref:</span><strong className="text-[#06D6A0] font-mono-code">{selectedPayment.transaction_reference}</strong></div>
                  )}
                  <div className="flex justify-between"><span className="text-[#8A9AAF]">Submitted:</span><span className="text-[#8A9AAF]">{new Date(selectedPayment.created_at).toLocaleString()}</span></div>
                  <div className="flex justify-between items-center"><span className="text-[#8A9AAF]">Status:</span>{getStatusBadge(selectedPayment.status)}</div>
                </div>

                {selectedPayment.status === 'payment_verified' && (
                  <div className="p-3 bg-[#06D6A0]/20 border border-[#06D6A0] text-[#06D6A0] rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Verified
                    {selectedPayment.verified_at && ` on ${new Date(selectedPayment.verified_at).toLocaleDateString()}`}
                  </div>
                )}

                {selectedPayment.status === 'payment_rejected' && selectedPayment.rejection_reason && (
                  <div className="p-3 bg-[#C84B1A]/20 border border-[#C84B1A] text-[#C84B1A] rounded-xl text-xs font-bold">
                    Rejection reason: {selectedPayment.rejection_reason}
                  </div>
                )}
              </div>

              {/* Action Buttons — only show for pending */}
              {selectedPayment.status === 'payment_submitted' && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                  {!showRejectInput ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleVerify(selectedPayment.id)}
                        disabled={actionLoading}
                        className="py-3 bg-[#06D6A0] text-[#080A0F] font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-1.5 hover:bg-[#06D6A0]/90 shadow-lg disabled:opacity-50"
                      >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Verify Payment
                      </button>
                      <button
                        onClick={() => setShowRejectInput(true)}
                        className="py-3 bg-[#C84B1A] text-white font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-1.5 hover:bg-[#C84B1A]/90"
                      >
                        <XCircle className="w-4 h-4" /> Reject Receipt
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRejectSubmit} className="space-y-3">
                      <label className="block text-xs font-bold text-[#C84B1A]">Specify Rejection Reason for Client</label>
                      <input
                        type="text"
                        required
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                        placeholder="e.g. Unreadable screenshot / Reference number mismatch"
                        className="w-full p-2.5 bg-[#080A0F] border border-white/10 rounded-xl text-xs text-white"
                      />
                      <div className="flex gap-2">
                        <button type="submit" disabled={actionLoading} className="w-2/3 py-2 bg-[#C84B1A] text-white font-bold rounded-xl text-xs uppercase disabled:opacity-50">
                          {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                        </button>
                        <button type="button" onClick={() => setShowRejectInput(false)} className="w-1/3 py-2 bg-white/10 text-xs rounded-xl">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
