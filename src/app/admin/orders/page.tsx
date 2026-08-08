'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Search, Filter, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getStoredToken } from '@/context/AuthContext';

interface AdminOrder {
  id: string;
  division: string;
  status: string;
  shipping_name?: string;
  shipping_email?: string;
  total_etb?: number;
  items?: { name: string; qty: number }[];
  created_at: string;
  payment_status?: string;
  notes?: string;
}

const STATUS_COLORS: Record<string, string> = {
  awaiting_payment: 'bg-yellow-500/20 text-yellow-400',
  proof_uploaded: 'bg-blue-500/20 text-blue-400',
  payment_verified: 'bg-green-500/20 text-green-400',
  in_progress: 'bg-purple-500/20 text-purple-400',
  fulfilled: 'bg-[#06D6A0]/20 text-[#06D6A0]',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getStoredToken();
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('limit', '100');

      const res = await fetch(`/api/admin/orders?${params}`, {
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
      setOrders(data.orders || []);
      setTotal(data.count || 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = orders.filter(o => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      (o.shipping_name || '').toLowerCase().includes(q) ||
      (o.shipping_email || '').toLowerCase().includes(q) ||
      (o.division || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-jakarta">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-[#06D6A0] tracking-wider">
            {user?.division ? `${user.division.toUpperCase()} Division` : 'All Divisions'}
          </span>
          <h1 className="text-3xl font-cormorant font-bold text-[#F4F1EC]">Orders Queue</h1>
          <p className="text-xs text-[#8A9AAF] mt-0.5">
            {total} total orders{user?.division && !user?.role?.includes('super') ? ` in ${user.division}` : ' across all divisions'}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs text-[#F4F1EC] flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#111318] border border-white/10 p-4 rounded-2xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8A9AAF] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, customer name or email..."
            className="w-full pl-9 pr-4 py-2 bg-[#080A0F] border border-white/10 rounded-xl text-xs text-[#F4F1EC] outline-none focus:border-[#06D6A0]"
          />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-[#8A9AAF]" />
          <span className="text-[#8A9AAF]">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#080A0F] border border-white/10 text-[#F4F1EC] p-2 rounded-xl text-xs outline-none focus:border-[#06D6A0]"
          >
            <option value="all">All Statuses</option>
            <option value="awaiting_payment">Awaiting Payment</option>
            <option value="proof_uploaded">Proof Uploaded</option>
            <option value="payment_verified">Payment Verified</option>
            <option value="in_progress">In Progress</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#8A9AAF] gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading orders...</span>
        </div>
      ) : error ? (
        <div className="bg-[#C84B1A]/10 border border-[#C84B1A]/40 p-6 rounded-2xl flex items-center gap-3 text-sm text-[#C84B1A]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">Failed to load orders</p>
            <p className="text-xs opacity-80 mt-1">{error}</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111318] p-10 rounded-3xl text-center">
          <ShoppingBag className="w-8 h-8 text-[#8A9AAF] mx-auto mb-3" />
          <p className="text-sm text-[#8A9AAF]">
            {orders.length === 0 ? 'No orders in your division yet.' : 'No orders match the current filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-[#8A9AAF]">Showing {filtered.length} of {total} orders</p>
          {filtered.map(ord => {
            const itemName = ord.items?.[0]?.name || 'Custom Order';
            const statusClass = STATUS_COLORS[ord.status] || 'bg-white/10 text-[#8A9AAF]';
            return (
              <div key={ord.id} className="bg-[#111318] border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/20 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#C8961E]">#{ord.id.slice(0, 8)}…</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-[#8A9AAF]">{ord.division}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusClass}`}>{ord.status.replace('_', ' ')}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#F4F1EC] mt-1 truncate">{itemName}</h3>
                  <div className="text-xs text-[#8A9AAF] mt-0.5">
                    Customer: <strong className="text-[#F4F1EC]">{ord.shipping_name || '—'}</strong>
                    {ord.shipping_email && <span> · {ord.shipping_email}</span>}
                    <span> · {new Date(ord.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-[#C84B1A] font-mono">
                    {ord.total_etb ? `${ord.total_etb.toLocaleString()} ETB` : '—'}
                  </div>
                  <div className={`text-[10px] mt-0.5 font-bold uppercase ${ord.payment_status === 'paid' ? 'text-[#06D6A0]' : 'text-[#8A9AAF]'}`}>
                    {ord.payment_status || 'pending'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
