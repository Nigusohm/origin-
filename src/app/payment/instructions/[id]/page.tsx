'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, Upload, CheckCircle2, ShieldCheck, Copy, ArrowLeft, CloudUpload, X, FileText, Loader2 } from 'lucide-react';
import { useOrderEnquiry } from '@/context/OrderEnquiryContext';

export default function PaymentInstructionsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const { records, divisionAccounts, refreshRecords } = useOrderEnquiry();

  const record = records.find(r => r.id === id);
  const divisionAccount = divisionAccounts.find(a => a.division === record?.division) || divisionAccounts[0];

  const [copied, setCopied] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [txRef, setTxRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!record) {
    return (
      <main className="min-h-screen bg-[#080A0F] text-[#F4F1EC] py-20 px-4 text-center space-y-4 font-jakarta">
        <h1 className="text-3xl font-cormorant font-bold">Record Not Found</h1>
        <p className="text-xs text-[#8A9AAF]">Order or enquiry reference <strong>#{id}</strong> could not be retrieved.</p>
        <Link href="/account" className="inline-block px-6 py-3 bg-[#C8961E] text-[#080A0F] font-bold text-xs rounded-xl uppercase">
          Return to Customer Dashboard
        </Link>
      </main>
    );
  }

  const copyAcc = () => {
    navigator.clipboard.writeText(divisionAccount.account_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSet(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
  };

  const validateAndSet = (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG, PNG, WEBP, or PDF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }
    setError('');
    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) { setError('Please select a file to upload.'); return; }
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('targetType', record.type);
      formData.append('amount', String(record.amount_due_etb));
      formData.append('paymentMethod', 'bank_transfer');
      if (txRef) formData.append('transactionReference', txRef);

      const endpoint = record.type === 'order'
        ? `/api/orders/${record.id}/payment-proof`
        : `/api/enquiries/${record.id}/payment-proof`;

      const res = await fetch(endpoint, { method: 'POST', body: formData });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Upload failed (${res.status})`);
      }

      setSubmittedSuccess(true);
      // Re-fetch records so the dashboard immediately reflects the new status + proof
      await refreshRecords();
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedSuccess) {
    return (
      <main data-division="corporate" className="bg-[#080A0F] text-[#F4F1EC] min-h-screen py-16 px-4 flex items-center justify-center font-jakarta">
        <div className="bg-[#111318] border border-[#06D6A0] p-8 rounded-3xl max-w-md text-center space-y-4 shadow-2xl">
          <CheckCircle2 className="w-12 h-12 text-[#06D6A0] mx-auto" />
          <h1 className="text-2xl font-bold font-cormorant text-[#F4F1EC]">Payment Proof Submitted!</h1>
          <p className="text-xs text-[#8A9AAF]">
            Reference <strong>#{record.id}</strong> has been updated. Our division finance team will review your receipt within 2–4 business hours.
          </p>
          <Link href="/account" className="inline-block px-6 py-3 bg-[#C8961E] text-[#080A0F] font-bold text-xs rounded-xl uppercase">
            Track Order Status in Dashboard →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main data-division="corporate" className="bg-[#080A0F] text-[#F4F1EC] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-jakarta">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <Link href="/account" className="inline-flex items-center gap-1.5 text-xs text-[#8A9AAF] hover:text-[#C8961E]">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8961E]">{record.division} Division Payment</span>
          <h1 className="text-3xl sm:text-4xl font-cormorant font-bold text-[#F4F1EC] mt-1">
            Payment Instructions for #{record.id}
          </h1>
        </div>

        {/* Amount Summary Card */}
        <div className="bg-[#111318] border border-[#C8961E]/40 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="text-xs text-[#8A9AAF] uppercase font-bold">Total Amount Due</div>
            <div className="text-3xl font-bold text-[#C8961E] font-mono-code mt-0.5">
              {record.amount_due_etb.toLocaleString()} ETB
            </div>
            <div className="text-xs text-[#8A9AAF] mt-0.5">${record.amount_due_usd} USD Equivalent</div>
          </div>
          <div className="p-3 bg-[#080A0F] border border-white/10 rounded-2xl text-xs space-y-1">
            <div className="text-[#8A9AAF]">Transfer Memo / Reference #</div>
            <div className="font-mono-code font-bold text-[#06D6A0] text-sm">{record.id}</div>
          </div>
        </div>

        {/* Division Specific Payment Accounts */}
        <div className="bg-[#111318] border border-white/10 p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-[#C8961E]" />
            <h2 className="text-xl font-cormorant font-bold text-[#F4F1EC]">Division Payment Accounts</h2>
          </div>

          <div className="p-6 bg-[#080A0F] border border-white/10 rounded-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[#8A9AAF]">Bank Name:</span>
              <span className="font-bold text-[#F4F1EC]">{divisionAccount.bank_name}</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[#8A9AAF]">Account Name:</span>
              <span className="font-bold text-[#F4F1EC]">{divisionAccount.account_name}</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[#8A9AAF]">Account Number:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono-code font-bold text-[#C8961E] text-sm">{divisionAccount.account_number}</span>
                <button onClick={copyAcc} className="p-1 text-[#8A9AAF] hover:text-white" title="Copy">
                  <Copy className="w-4 h-4" />
                </button>
                {copied && <span className="text-[10px] text-[#06D6A0]">Copied!</span>}
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[#8A9AAF]">Mobile Money:</span>
              <span className="font-bold text-[#06D6A0]">{divisionAccount.mobile_money_number}</span>
            </div>

            <div className="text-[11px] text-[#8A9AAF] leading-relaxed pt-1">
              <strong>Note:</strong> {divisionAccount.notes}
            </div>
          </div>

          {!showUploadForm ? (
            <button
              onClick={() => setShowUploadForm(true)}
              className="w-full py-4 bg-[#C8961E] text-[#080A0F] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#C8961E]/90 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Upload className="w-4 h-4" /> I&apos;ve Made The Payment — Upload Receipt Proof
            </button>
          ) : (
            <form onSubmit={handleUploadSubmit} className="space-y-5 p-6 bg-[#080A0F] border border-white/10 rounded-2xl text-xs">
              <h3 className="text-base font-bold text-[#F4F1EC] flex items-center gap-2">
                <CloudUpload className="w-4 h-4 text-[#C8961E]" /> Upload Payment Screenshot or Receipt PDF
              </h3>

              {/* Drag & Drop Zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById('proof-file-input')?.click()}
                className={`relative w-full min-h-[180px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  dragOver
                    ? 'border-[#C8961E] bg-[#C8961E]/10'
                    : selectedFile
                    ? 'border-[#06D6A0] bg-[#06D6A0]/5'
                    : 'border-white/20 bg-[#111318] hover:border-white/40'
                }`}
              >
                <input
                  id="proof-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden"
                  onChange={handleFileInput}
                />

                {selectedFile ? (
                  <div className="text-center space-y-2 px-4">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-[#06D6A0]/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#06D6A0]" />
                    </div>
                    <p className="font-bold text-[#F4F1EC] text-sm truncate max-w-[260px]">{selectedFile.name}</p>
                    <p className="text-[#8A9AAF]">{(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type}</p>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setSelectedFile(null); }}
                      className="inline-flex items-center gap-1 text-[#ff6b6b] hover:text-red-400 mt-1"
                    >
                      <X className="w-3 h-3" /> Remove file
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-2 px-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center">
                      <CloudUpload className="w-7 h-7 text-[#8A9AAF]" />
                    </div>
                    <p className="font-bold text-[#F4F1EC]">Drag & drop your receipt here</p>
                    <p className="text-[#8A9AAF]">or <span className="text-[#C8961E] underline underline-offset-2">click to browse files</span></p>
                    <p className="text-[10px] text-[#8A9AAF]/60">Accepted: JPEG, PNG, WEBP, PDF · Max 5 MB</p>
                  </div>
                )}
              </div>

              {/* Transaction Reference */}
              <div>
                <label className="block text-[#8A9AAF] uppercase font-bold mb-1.5">
                  Optional Bank Transaction Reference #
                </label>
                <input
                  type="text"
                  value={txRef}
                  onChange={e => setTxRef(e.target.value)}
                  placeholder="e.g. CBE-TX-984210492"
                  className="w-full p-3 bg-[#111318] border border-white/10 rounded-xl text-[#F4F1EC] outline-none focus:border-[#C8961E] transition-colors"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowUploadForm(false); setSelectedFile(null); setError(''); }}
                  className="flex-1 py-3.5 border border-white/20 text-[#8A9AAF] rounded-xl font-bold text-xs uppercase tracking-wider hover:border-white/40 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedFile}
                  className="flex-1 py-3.5 bg-[#06D6A0] text-[#080A0F] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#06D6A0]/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                  ) : (
                    <>Submit Receipt for Verification</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="flex items-start gap-3 p-5 bg-[#111318] border border-white/10 rounded-2xl text-xs text-[#8A9AAF]">
          <ShieldCheck className="w-5 h-5 text-[#06D6A0] shrink-0 mt-0.5" />
          <div>
            <p><strong className="text-[#F4F1EC]">Secure & Verified:</strong> Your uploaded receipt is encrypted, stored securely, and reviewed by our finance team within 2–4 business hours. You will receive an email confirmation once verified.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
