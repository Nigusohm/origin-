'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, DollarSign, Loader2, RefreshCw, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getStoredToken } from '@/context/AuthContext';

interface AdminEnquiry {
  id: string;
  division: string;
  status: string;
  subject?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  message?: string;
  preferred_contact?: string;
  quote_amount_etb?: number;
  quote_message?: string;
  quoted_at?: string;
  created_at: string;
  file_url?: string;
}

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-blue-500/20 text-blue-400',
  quoted: 'bg-yellow-500/20 text-yellow-400',
  payment_pending: 'bg-orange-500/20 text-orange-400',
  payment_verified: 'bg-green-500/20 text-green-400',
  in_progress: 'bg-purple-500/20 text-purple-400',
  completed: 'bg-[#06D6A0]/20 text-[#06D6A0]',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function AdminEnquiriesPage() {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Quote form state
  const [quoteTarget, setQuoteTarget] = useState<AdminEnquiry | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(0);
  const [quoteMessage, setQuoteMessage] = useState('');
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getStoredToken();
      const res = await fetch('/api/admin/enquiries?limit=100', {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Admin-Session-Token': token || '',
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setEnquiries(data.enquiries || []);
      setTotal(data.count || 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  const handleIssueQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteTarget) return;
    setQuoteSubmitting(true);
    setQuoteError(null);
    try {
      const token = getStoredToken();
      const res = await fetch(`/api/admin/enquiries/${quoteTarget.id}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Admin-Session-Token': token || '',
        },
        body: JSON.stringify({ amount_etb: quoteAmount, message: quoteMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setQuoteTarget(null);
      fetchEnquiries();
    } catch (e: any) {
      setQuoteError(e.message);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-jakarta">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-[#2563EB] tracking-wider">
            {user?.division ? `${user.division.toUpperCase()} Division` : 'All Divisions'}
          </span>
          <h1 className="text-3xl font-cormorant font-bold text-[#F4F1EC]">Enquiries Queue</h1>
          <p className="text-xs text-[#8A9AAF] mt-0.5">
            {total} total enquiries
          </p>
        </div>
        <button
          onClick={fetchEnquiries}
          disabled={loading}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs text-[#F4F1EC] flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#8A9AAF] gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading enquiries...</span>
        </div>
      ) : error ? (
        <div className="bg-[#C84B1A]/10 border border-[#C84B1A]/40 p-6 rounded-2xl flex items-center gap-3 text-sm text-[#C84B1A]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">Failed to load enquiries</p>
            <p className="text-xs opacity-80 mt-1">{error}</p>
          </div>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="bg-[#111318] p-10 rounded-3xl text-center">
          <MessageSquare className="w-8 h-8 text-[#8A9AAF] mx-auto mb-3" />
          <p className="text-sm text-[#8A9AAF]">No enquiries in your division yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map(enq => {
            const statusClass = STATUS_COLORS[enq.status] || 'bg-white/10 text-[#8A9AAF]';
            const isExpanded = expandedId === enq.id;
            return (
              <div key={enq.id} className="bg-[#111318] border border-white/10 rounded-3xl overflow-hidden">
                {/* Header row */}
                <div
                  className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : enq.id)}
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#2563EB]">#{enq.id.slice(0, 8)}…</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#2563EB]/20 text-[#2563EB]">{enq.division}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusClass}`}>{enq.status.replace('_', ' ')}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#F4F1EC] mt-1">{enq.subject || 'Custom Enquiry'}</h3>
                    <p className="text-xs text-[#8A9AAF]">
                      {enq.customer_name} · {new Date(enq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {enq.quote_amount_etb && enq.quote_amount_etb > 0 ? (
                      <span className="text-sm font-bold text-[#C8961E] font-mono">{enq.quote_amount_etb.toLocaleString()} ETB</span>
                    ) : (
                      <span className="text-xs text-[#8A9AAF]">Unquoted</span>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#8A9AAF]" /> : <ChevronDown className="w-4 h-4 text-[#8A9AAF]" />}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-white/10 p-5 space-y-4">
                    <div className="bg-[#080A0F] rounded-2xl p-4 text-xs space-y-2">
                      <div className="text-[#8A9AAF]">
                        From: <strong className="text-[#F4F1EC]">{enq.customer_name || '—'}</strong>
                        {enq.customer_email && <span> · {enq.customer_email}</span>}
                        {enq.customer_phone && <span> · {enq.customer_phone}</span>}
                        {enq.preferred_contact && <span> · Prefers <span className="capitalize">{enq.preferred_contact}</span></span>}
                      </div>
                      {enq.message && <p className="text-[#F4F1EC] italic">"{enq.message}"</p>}
                      {enq.file_url && (
                        <a href={enq.file_url} target="_blank" rel="noopener noreferrer" className="text-[#2563EB] underline block">
                          View Attached Brief Document →
                        </a>
                      )}
                    </div>

                    {enq.quote_amount_etb && enq.quote_amount_etb > 0 && (
                      <div className="bg-[#06D6A0]/5 border border-[#06D6A0]/20 rounded-xl p-3 text-xs">
                        <span className="text-[#06D6A0] font-bold">Quote Issued:</span>{' '}
                        <span className="text-[#F4F1EC]">{enq.quote_amount_etb.toLocaleString()} ETB — {enq.quote_message}</span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setQuoteTarget(enq);
                        setQuoteAmount(enq.quote_amount_etb || 0);
                        setQuoteMessage(enq.quote_message || '');
                        setQuoteError(null);
                      }}
                      className="px-4 py-2.5 bg-[#2563EB] text-white font-bold rounded-xl text-xs uppercase hover:bg-[#2563EB]/90 flex items-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      {enq.quote_amount_etb && enq.quote_amount_etb > 0 ? 'Revise Quote' : 'Issue Official Quote'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quote Modal */}
      {quoteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center font-jakarta">
          <form onSubmit={handleIssueQuote} className="bg-[#111318] border border-[#2563EB]/40 p-6 sm:p-8 rounded-3xl max-w-xl w-full space-y-6 shadow-2xl relative">
            <button type="button" onClick={() => setQuoteTarget(null)} className="absolute top-4 right-4 text-white hover:text-red-400">✕</button>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#2563EB]">Issue Division Quote</span>
              <h3 className="text-xl font-cormorant font-bold text-[#F4F1EC]">{quoteTarget.subject || 'Enquiry'}</h3>
              <p className="text-xs text-[#8A9AAF]">Client: {quoteTarget.customer_name} ({quoteTarget.customer_email})</p>
            </div>

            {quoteError && (
              <div className="p-3 bg-[#C84B1A]/20 border border-[#C84B1A] text-[#C84B1A] rounded-xl text-xs">
                {quoteError}
              </div>
            )}

            <div className="text-xs space-y-4">
              <div>
                <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Quoted Price (ETB) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quoteAmount || ''}
                  onChange={e => setQuoteAmount(Number(e.target.value))}
                  className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] font-mono text-base outline-none focus:border-[#2563EB]"
                  placeholder="e.g. 45000"
                />
              </div>
              <div>
                <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Quote Details &amp; Payment Terms *</label>
                <textarea
                  rows={4}
                  required
                  value={quoteMessage}
                  onChange={e => setQuoteMessage(e.target.value)}
                  placeholder="Include scope, retainer breakdown, estimated timeline, and payment terms..."
                  className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC] text-xs outline-none focus:border-[#2563EB] resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={quoteSubmitting}
              className="w-full py-3.5 bg-[#2563EB] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#2563EB]/90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
            >
              {quoteSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {quoteSubmitting ? 'Dispatching Quote…' : 'Dispatch Quote to Customer'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
