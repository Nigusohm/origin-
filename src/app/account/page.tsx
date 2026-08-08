'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  ShoppingBag,
  MessageSquare,
  CreditCard,
  Settings,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  ArrowRight,
  Shield,
  Eye,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrderEnquiry } from '@/context/OrderEnquiryContext';
import { OrderEnquiryRecord, OrderEnquiryStatus } from '@/types';

export default function CustomerAccountPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { records } = useOrderEnquiry();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'enquiries' | 'payments' | 'settings'>('overview');
  const [selectedRecord, setSelectedRecord] = useState<OrderEnquiryRecord | null>(null);

  if (!user) {
    return (
      <main className="min-h-screen bg-[#080A0F] text-[#F4F1EC] py-20 px-4 text-center space-y-4">
        <h1 className="text-3xl font-cormorant font-bold">Authentication Required</h1>
        <p className="text-xs text-[#8A9AAF]">Please sign in to access your customer dashboard.</p>
        <Link href="/login" className="inline-block px-6 py-3 bg-[#C8961E] text-[#080A0F] font-bold text-xs rounded-xl uppercase">
          Sign In Now
        </Link>
      </main>
    );
  }

  const customerRecords = records.filter(r => r.customer_id === user.id || r.customer_email === user.email);
  const orders = customerRecords.filter(r => r.type === 'order');
  const enquiries = customerRecords.filter(r => r.type === 'enquiry');
  
  const handleReuploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    router.push(`/payment/instructions/${selectedRecord.id}`);
  };

  const activeOrdersCount = orders.filter(o => o.status !== 'fulfilled').length;
  const openEnquiriesCount = enquiries.filter(e => e.status === 'submitted' || e.status === 'awaiting_payment').length;
  const lastPayment = customerRecords.find(r => r.payment_proof);

  const getStatusBadge = (status: OrderEnquiryStatus) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase">Submitted</span>;
      case 'awaiting_payment':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#C8961E]/20 text-[#C8961E] border border-[#C8961E]/30 text-[10px] font-bold uppercase">Awaiting Payment</span>;
      case 'payment_submitted':
        return <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold uppercase">Proof Under Review</span>;
      case 'proof_uploaded':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase">Proof Uploaded</span>;
      case 'payment_verified':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#06D6A0]/20 text-[#06D6A0] border border-[#06D6A0]/30 text-[10px] font-bold uppercase">Payment Verified</span>;
      case 'payment_rejected':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#C84B1A]/20 text-[#C84B1A] border border-[#C84B1A]/30 text-[10px] font-bold uppercase">Payment Rejected</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase">In Production</span>;
      case 'fulfilled':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">Fulfilled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase">{status}</span>;
    }
  };


  return (
    <main data-division="corporate" className="bg-[#080A0F] text-[#F4F1EC] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-jakarta">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* User Greeting & Header Bar */}
        <div className="bg-[#111318] border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#C8961E] text-[#080A0F] font-bold text-2xl flex items-center justify-center overflow-hidden border-2 border-[#C8961E]/40 shrink-0">
              {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-cormorant font-bold text-[#F4F1EC]">{user.name}</h1>
                <span className="px-2 py-0.5 rounded bg-[#C8961E]/20 text-[#C8961E] text-[10px] font-bold uppercase">Client Account</span>
              </div>
              <p className="text-xs text-[#8A9AAF]">{user.email} · {user.phone}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {(user.role === 'division_staff' || user.role === 'super_admin') && (
              <Link
                href="/admin"
                className="px-4 py-2.5 bg-[#06D6A0] text-[#080A0F] rounded-xl font-bold text-xs uppercase flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Admin Portal Access
              </Link>
            )}
            <button
              onClick={logout}
              className="px-4 py-2.5 bg-[#C84B1A]/20 text-[#C84B1A] border border-[#C84B1A]/40 rounded-xl font-bold text-xs uppercase flex items-center gap-2 hover:bg-[#C84B1A] hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Account Sub-Nav Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Account Overview', icon: UserIcon },
            { id: 'orders', label: `My Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'enquiries', label: `My Enquiries (${enquiries.length})`, icon: MessageSquare },
            { id: 'payments', label: 'Payment History', icon: CreditCard },
            { id: 'settings', label: 'Profile Settings', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#C8961E] text-[#080A0F] shadow-lg'
                  : 'bg-[#111318] text-[#8A9AAF] hover:text-white border border-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#111318] border border-white/10 p-6 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8A9AAF]">
                  <span>Active Retail Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#C84B1A]" />
                </div>
                <div className="text-3xl font-bold text-[#F4F1EC] font-mono-code">{activeOrdersCount}</div>
                <div className="text-[10px] text-[#8A9AAF]">In production or awaiting payment</div>
              </div>

              <div className="bg-[#111318] border border-white/10 p-6 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8A9AAF]">
                  <span>Open Scoped Enquiries</span>
                  <MessageSquare className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div className="text-3xl font-bold text-[#F4F1EC] font-mono-code">{openEnquiriesCount}</div>
                <div className="text-[10px] text-[#8A9AAF]">Awaiting quote or response</div>
              </div>

              <div className="bg-[#111318] border border-white/10 p-6 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8A9AAF]">
                  <span>Last Payment Record</span>
                  <CreditCard className="w-4 h-4 text-[#C8961E]" />
                </div>
                <div className="text-lg font-bold text-[#06D6A0] truncate">
                  {lastPayment ? lastPayment.payment_proof?.tx_ref || 'Receipt Uploaded' : 'No Uploads Yet'}
                </div>
                <div className="text-[10px] text-[#8A9AAF]">
                  {lastPayment ? `Ref #${lastPayment.id}` : 'Create an order to upload proof'}
                </div>
              </div>
            </div>

            {/* Recent Orders & Enquiries Summary */}
            <div className="bg-[#111318] border border-white/10 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-cormorant font-bold text-[#F4F1EC]">Recent Orders & Enquiries</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs text-[#C8961E] font-bold hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {customerRecords.length === 0 ? (
                <div className="text-center py-8 text-[#8A9AAF] text-xs">
                  No orders or enquiries placed yet. Explore our division catalogs to submit your first request!
                </div>
              ) : (
                <div className="space-y-3">
                  {customerRecords.slice(0, 3).map(rec => (
                    <div key={rec.id} className="p-4 bg-[#080A0F] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-code text-xs font-bold text-[#C8961E]">{rec.id}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-[#8A9AAF]">{rec.division}</span>
                          {getStatusBadge(rec.status)}
                        </div>
                        <div className="text-sm font-bold text-[#F4F1EC] mt-1">{rec.item_title}</div>
                        <div className="text-[10px] text-[#8A9AAF] mt-0.5">
                          Placed on {new Date(rec.created_at).toLocaleDateString()} · Due: {rec.amount_due_etb > 0 ? `${rec.amount_due_etb.toLocaleString()} ETB` : 'Pending Quote'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {rec.status === 'awaiting_payment' && (
                          <Link href={`/payment/instructions/${rec.id}`} className="px-3 py-1.5 bg-[#C8961E] text-[#080A0F] rounded-xl text-xs font-bold uppercase">
                            Pay & Upload Proof
                          </Link>
                        )}
                        {(rec.status === 'payment_submitted' || rec.status === 'proof_uploaded') && (
                          <span className="px-3 py-1.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold">
                            ✓ Proof Submitted
                          </span>
                        )}
                        <button onClick={() => setSelectedRecord(rec)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-[#8A9AAF]">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-cormorant font-bold text-[#F4F1EC]">My Fixed-Price Retail Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-[#111318] p-8 rounded-3xl text-center text-xs text-[#8A9AAF]">No retail orders found.</div>
            ) : (
              <div className="space-y-4">
                {orders.map(ord => (
                  <div key={ord.id} className="bg-[#111318] border border-white/10 p-6 rounded-3xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-code text-xs font-bold text-[#C8961E]">{ord.id}</span>
                          {getStatusBadge(ord.status)}
                        </div>
                        <h3 className="text-lg font-bold text-[#F4F1EC] mt-1">{ord.item_title}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#C84B1A] font-mono-code">{ord.amount_due_etb.toLocaleString()} ETB</div>
                        <div className="text-[10px] text-[#8A9AAF]">${ord.amount_due_usd} USD</div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#080A0F] rounded-2xl flex flex-wrap gap-4 text-xs text-[#8A9AAF]">
                      <div><strong>Quantity:</strong> {ord.quantity || 1}</div>
                      {ord.variant_size && <div><strong>Size:</strong> {ord.variant_size}</div>}
                      {ord.variant_color && <div><strong>Color:</strong> {ord.variant_color}</div>}
                    </div>

                    {ord.status === 'payment_rejected' && ord.payment_proof?.rejection_reason && (
                      <div className="p-4 bg-[#C84B1A]/20 border border-[#C84B1A] rounded-2xl space-y-2 text-xs">
                        <div className="font-bold text-[#C84B1A] flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" /> Payment Receipt Rejected: {ord.payment_proof.rejection_reason}
                        </div>
                        <button
                          onClick={() => setSelectedRecord(ord)}
                          className="px-4 py-2 bg-[#C84B1A] text-white font-bold rounded-xl text-xs uppercase"
                        >
                          Re-upload Payment Proof
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <button onClick={() => setSelectedRecord(ord)} className="text-xs text-[#C8961E] font-bold hover:underline flex items-center gap-1">
                        View Status Timeline & Proof <Eye className="w-3.5 h-3.5" />
                      </button>
                      {ord.status === 'awaiting_payment' && (
                        <Link href={`/payment/instructions/${ord.id}`} className="px-4 py-2 bg-[#C8961E] text-[#080A0F] font-bold text-xs rounded-xl uppercase">
                          Pay Now & Upload Receipt →
                        </Link>
                      )}
                      {(ord.status === 'payment_submitted' || ord.status === 'proof_uploaded') && (
                        <span className="px-4 py-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl font-bold text-xs">
                          ✓ Receipt Under Review
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enquiries Tab */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-cormorant font-bold text-[#F4F1EC]">My Custom Package Enquiries</h2>
            {enquiries.length === 0 ? (
              <div className="bg-[#111318] p-8 rounded-3xl text-center text-xs text-[#8A9AAF]">No custom enquiries found.</div>
            ) : (
              <div className="space-y-4">
                {enquiries.map(enq => (
                  <div key={enq.id} className="bg-[#111318] border border-white/10 p-6 rounded-3xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-code text-xs font-bold text-[#2563EB]">{enq.id}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#2563EB]/20 text-[#2563EB]">{enq.division}</span>
                          {getStatusBadge(enq.status)}
                        </div>
                        <h3 className="text-lg font-bold text-[#F4F1EC] mt-1">{enq.item_title}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-[#C8961E] font-mono-code">
                          {enq.amount_due_etb > 0 ? `${enq.amount_due_etb.toLocaleString()} ETB` : 'Awaiting Official Quote'}
                        </div>
                      </div>
                    </div>

                    {enq.message && (
                      <div className="p-4 bg-[#080A0F] rounded-2xl text-xs text-[#8A9AAF] leading-relaxed">
                        <strong>My Message:</strong> &quot;{enq.message}&quot;
                      </div>
                    )}

                    {enq.quote_notes && (
                      <div className="p-4 bg-[#C8961E]/10 border border-[#C8961E]/30 rounded-2xl text-xs text-[#F4F1EC] space-y-1">
                        <div className="font-bold text-[#C8961E]">Division Staff Quote Note:</div>
                        <p className="text-[#8A9AAF]">{enq.quote_notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <button onClick={() => setSelectedRecord(enq)} className="text-xs text-[#C8961E] font-bold hover:underline flex items-center gap-1">
                        View Timeline & Quote Details <Eye className="w-3.5 h-3.5" />
                      </button>
                      {enq.status === 'awaiting_payment' && enq.amount_due_etb > 0 && (
                        <Link href={`/payment/instructions/${enq.id}`} className="px-4 py-2 bg-[#C8961E] text-[#080A0F] font-bold text-xs rounded-xl uppercase">
                          Pay Quoted Amount →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-cormorant font-bold text-[#F4F1EC]">Payment Proof Receipt History</h2>
            <div className="bg-[#111318] border border-white/10 rounded-3xl p-6 space-y-4">
              {customerRecords.filter(r => r.payment_proof).length === 0 ? (
                <div className="text-center py-8 text-xs text-[#8A9AAF]">No payment proof receipts uploaded yet.</div>
              ) : (
                <div className="space-y-3">
                  {customerRecords.filter(r => r.payment_proof).map(rec => (
                    <div key={rec.id} className="p-4 bg-[#080A0F] border border-white/10 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {rec.payment_proof?.file_url ? (
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
                            <img src={rec.payment_proof.file_url} alt="Proof" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <FileText className="w-8 h-8 text-[#C8961E]" />
                        )}
                        <div>
                          <div className="text-xs font-bold text-[#F4F1EC]">{rec.item_title} (#{rec.id})</div>
                          <div className="text-[10px] text-[#8A9AAF]">
                            Tx Ref: {rec.payment_proof?.tx_ref || 'N/A'} · Uploaded {new Date(rec.payment_proof!.uploaded_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div>{getStatusBadge(rec.status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-2xl font-cormorant font-bold text-[#F4F1EC]">Profile & Contact Settings</h2>
            <div className="bg-[#111318] border border-white/10 p-6 rounded-3xl space-y-4 text-xs font-jakarta">
              <div>
                <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Full Name</label>
                <input type="text" defaultValue={user.name} disabled className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC]" />
              </div>
              <div>
                <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Email Address</label>
                <input type="email" defaultValue={user.email} disabled className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC]" />
              </div>
              <div>
                <label className="block text-[#8A9AAF] uppercase font-bold mb-1">Phone Number</label>
                <input type="text" defaultValue={user.phone} disabled className="w-full p-3 bg-[#080A0F] border border-white/10 rounded-xl text-[#F4F1EC]" />
              </div>
            </div>
          </div>
        )}

        {/* Timeline & Re-upload Lightbox Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center">
            <div className="bg-[#111318] border border-white/15 p-6 sm:p-8 rounded-3xl max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
              >
                ✕
              </button>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#C8961E]">{selectedRecord.division} Division</span>
                <h3 className="text-2xl font-cormorant font-bold text-[#F4F1EC]">{selectedRecord.item_title} (#{selectedRecord.id})</h3>
              </div>

              {/* Timeline */}
              <div className="space-y-4 border-t border-b border-white/10 py-4">
                <h4 className="text-xs font-bold uppercase text-[#8A9AAF] tracking-wider">Status History Timeline</h4>
                <div className="space-y-3">
                  {selectedRecord.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C8961E] mt-1 shrink-0" />
                      <div>
                        <div className="font-bold text-[#F4F1EC]">{step.label}</div>
                        <div className="text-[10px] text-[#8A9AAF]">{new Date(step.timestamp).toLocaleString()}</div>
                        {step.note && <div className="text-[11px] text-[#C84B1A] italic mt-0.5">{step.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Proof Viewer — shows the receipt image if available */}
              {selectedRecord.payment_proof?.file_url && (
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-[#8A9AAF] tracking-wider">Uploaded Payment Receipt</h4>
                  <div className="relative w-full max-h-64 overflow-hidden rounded-2xl bg-black border border-white/10">
                    <img
                      src={selectedRecord.payment_proof.file_url}
                      alt="Payment receipt"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#8A9AAF]">
                    <span>Tx Ref: <strong className="text-[#06D6A0]">{selectedRecord.payment_proof.tx_ref || 'N/A'}</strong></span>
                    <span>Uploaded: {new Date(selectedRecord.payment_proof.uploaded_at).toLocaleDateString()}</span>
                  </div>
                  {selectedRecord.payment_proof.verified_by && (
                    <div className="p-3 bg-[#06D6A0]/10 border border-[#06D6A0]/30 rounded-xl text-xs text-[#06D6A0] font-bold">
                      ✓ Verified by {selectedRecord.payment_proof.verified_by}
                    </div>
                  )}
                  {selectedRecord.payment_proof.rejection_reason && (
                    <div className="p-3 bg-[#C84B1A]/10 border border-[#C84B1A]/30 rounded-xl text-xs text-[#C84B1A] font-bold">
                      ✗ Rejected: {selectedRecord.payment_proof.rejection_reason}
                    </div>
                  )}
                </div>
              )}

              {/* Re-upload Button if Rejected */}
              {selectedRecord.status === 'payment_rejected' && (
                <div className="space-y-3 p-4 bg-[#C84B1A]/10 border border-[#C84B1A]/30 rounded-2xl text-xs">
                  <h4 className="font-bold text-[#C84B1A]">Payment Receipt Rejected</h4>
                  <p className="text-[11px] text-[#8A9AAF]">Please upload a new clear screenshot or PDF receipt of your payment.</p>
                  <button
                    type="button"
                    onClick={() => router.push(`/payment/instructions/${selectedRecord.id}`)}
                    className="w-full py-2.5 bg-[#C84B1A] text-white font-bold rounded-xl uppercase hover:bg-[#C84B1A]/90 transition-colors"
                  >
                    Upload New Proof Receipt →
                  </button>
                </div>
              )}


            </div>
          </div>
        )}

      </div>
    </main>
  );
}
