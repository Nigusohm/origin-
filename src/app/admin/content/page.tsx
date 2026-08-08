'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Eye, FilePlus2, ImagePlus, Pencil, Save, Send, Trash2, X, Loader2 } from 'lucide-react';
import { useAuth, getAdminAuthHeaders } from '@/context/AuthContext';
import { DivisionType } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────
type ContentStatus = 'draft' | 'published';

// Content kinds that exist in the admin UI
type UiKind = 'products' | 'gallery' | 'process' | 'case-studies' | 'services' | 'articles' | 'success-stories';

// Content kinds the backend accepts
type BackendKind = 'products' | 'case-studies' | 'articles' | 'testimonials';

// Map UI kinds to backend kinds
const UI_TO_BACKEND_KIND: Record<UiKind, BackendKind> = {
  'products':        'products',
  'gallery':         'products',
  'process':         'articles',
  'case-studies':    'case-studies',
  'services':        'products',
  'articles':        'articles',
  'success-stories': 'case-studies',
};

// Map frontend division type → backend division
const DIVISION_MAP: Record<DivisionType, string> = {
  garment:    'bvibe',
  digital:    'tx',
  consulting: 'consulting',
  branding:   'branding',
};

type ContentItem = {
  id: string;
  division: DivisionType;
  kind: UiKind;
  title: string;
  status: ContentStatus;
  body: string;
  image?: string;
  fields: Record<string, string>;
  updatedAt: string;
  updatedBy: string;
  backendId?: string; // real DB id from the backend
};

// ─── Division / content type config ──────────────────────────────────────────
const divisions: { value: DivisionType; label: string }[] = [
  { value: 'garment',    label: 'B-VIBE Garment' },
  { value: 'digital',    label: 'Tˣ Digital'    },
  { value: 'consulting', label: 'Strategic Consulting' },
  { value: 'branding',   label: 'Branding & Promotion' },
];

const contentTypes: Record<DivisionType, { key: UiKind; label: string; fields: string[] }[]> = {
  garment: [
    { key: 'products', label: 'Products',      fields: ['Category', 'Price (ETB)', 'Variants', 'Slug'] },
    { key: 'gallery',  label: 'Gallery',       fields: ['Caption', 'Collection'] },
    { key: 'process',  label: 'Process Steps', fields: ['Step number', 'Process area'] },
  ],
  digital: [
    { key: 'case-studies', label: 'Case Studies', fields: ['Client', 'Timeline', 'Metrics'] },
    { key: 'services',     label: 'Services',     fields: ['Service category', 'Slug', 'Starting price (ETB)'] },
  ],
  consulting: [
    { key: 'articles',        label: 'Research Articles', fields: ['Tags', 'Sector', 'Author', 'Slug'] },
    { key: 'process',         label: 'Training Programs', fields: ['Category', 'Badge', 'Target Audience', 'Duration', 'Key Modules (comma-separated)', 'Slug'] },
    { key: 'success-stories', label: 'Success Stories',   fields: ['Client', 'Timeline', 'Outcome metrics'] },
  ],
  branding: [
    // Portfolio entries save to case_studies table (via 'case-studies' backend kind).
    // Fields collected here map to: metadata.client_name (Client), metadata.timeline (Timeline),
    // metadata.metrics (Metrics). excerpt maps to the card description. image_url to the card image.
    // All three are rendered on BrandingHome.tsx portfolio cards — no unused/missing fields.
    { key: 'case-studies', label: 'Portfolio', fields: ['Client', 'Timeline', 'Metrics'] },
    // Service entries save to catalog_items table (via 'services'→'products' backend kind).
    // Fields: Service category → metadata.category (rendered as tag), Slug → slug,
    // Starting price (ETB) → price_etb (not rendered publicly; internal), Key Modules → features array
    // (rendered as bullet list on service card). Badge → metadata.badge (rendered as pill tag).
    { key: 'services', label: 'Services', fields: ['Service category', 'Badge', 'Slug', 'Starting price (ETB)', 'Key Modules (comma-separated)'] },
  ],
};

// ─── Utilities ────────────────────────────────────────────────────────────────
const readableDate = (v: string) =>
  new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(v));

function buildPayload(item: ContentItem, body: string, user: any): Record<string, unknown> {
  const { kind, division: uiDivision, fields } = item;

  const base = {
    division: DIVISION_MAP[uiDivision],
    title: item.title,
    body,
    excerpt: body.replace(/<[^>]*>/g, '').slice(0, 300) || null,
    image_url: item.image || null,
    status: item.status,
    metadata: { ...fields, uiKind: kind, updatedBy: user?.name || 'Staff' },
  };

  // Enrich with structured fields where the backend has dedicated columns
  if (kind === 'products' || kind === 'services') {
    const priceRaw = fields['Price (ETB)'] || fields['Starting price (ETB)'] || '';
    const priceNum = priceRaw ? parseFloat(priceRaw.replace(/,/g, '')) : null;
    const modulesRaw = fields['Key Modules (comma-separated)'] || fields['Variants'] || '';
    const features = modulesRaw ? modulesRaw.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    return {
      ...base,
      slug: (fields['Slug'] || item.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      price_etb: isNaN(priceNum as any) ? null : priceNum,
      order_mode: 'enquiry' as const,
      features,
      metadata: {
        ...base.metadata,
        category: fields['Category'] || fields['Service category'] || '',
        badge: fields['Badge'] || '',
        targetAudience: fields['Target Audience'] || '',
        duration: fields['Duration'] || '',
      },
    };
  }

  // Training Programs or Process steps
  if (kind === 'process' || kind === 'articles') {
    const modulesRaw = fields['Key Modules (comma-separated)'] || '';
    const features = modulesRaw ? modulesRaw.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    return {
      ...base,
      slug: (fields['Slug'] || item.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      order_mode: 'enquiry' as const,
      features,
      metadata: {
        ...base.metadata,
        category: fields['Category'] || fields['Sector'] || '',
        badge: fields['Badge'] || '',
        targetAudience: fields['Target Audience'] || '',
        duration: fields['Duration'] || '',
      },
    };
  }

  return base;
}

function mapBackendRecord(record: any, uiKind: UiKind, uiDivision: DivisionType): ContentItem {
  return {
    id: record.id,
    backendId: record.id,
    division: uiDivision,
    kind: uiKind,
    title: record.title || '',
    status: record.status || 'draft',
    body: record.body || record.description || '',
    image: record.image_url || undefined,
    fields: record.metadata || {},
    updatedAt: record.updated_at || new Date().toISOString(),
    updatedBy: record.updated_by || 'Staff',
  };
}

// ─── Image uploader (Cloudinary via admin API) ────────────────────────────────
async function uploadImage(file: File, division: string): Promise<string> {
  const backendDiv = division === 'garment' ? 'bvibe' : division === 'digital' ? 'tx' : division;
  const form = new FormData();
  form.append('file', file);
  form.append('division', backendDiv);

  const res = await fetch('/api/admin/content/images', {
    method: 'POST',
    headers: getAdminAuthHeaders(),
    body: form,
  });
  const data = await res.json();
  const url = data.imageUrl || data.url;
  if (!res.ok || !url) throw new Error(data.error || 'Image upload failed');
  return url;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminContentPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [division, setDivision] = useState<DivisionType>(user?.division || 'garment');
  const [kind, setKind] = useState<UiKind>((contentTypes[user?.division || 'garment'][0]).key);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [previewing, setPreviewing] = useState<ContentItem | null>(null);
  const [productCategories, setProductCategories] = useState<string[]>(['traditional', 'corporate', 'mini-me', 'custom']);
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync division lock for non-super-admin
  useEffect(() => {
    if (!isSuperAdmin && user?.division) setDivision(user.division);
  }, [isSuperAdmin, user?.division]);

  // Reset kind when division changes
  useEffect(() => { setKind(contentTypes[division][0].key); }, [division]);

  // Set editor HTML when editing item changes
  useEffect(() => {
    if (editing && editorRef.current) editorRef.current.innerHTML = editing.body;
  }, [editing?.id]);

  // Fetch content from backend
  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    const backendKind = UI_TO_BACKEND_KIND[kind];
    try {
      const res = await fetch(`/api/admin/content/${backendKind}`, {
        headers: getAdminAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch content');

      const records: ContentItem[] = (data.records || [])
        .filter((r: any) => {
          // Filter by backend division matching current UI division
          const backendDiv = DIVISION_MAP[division];
          return r.division === backendDiv;
        })
        .map((r: any) => mapBackendRecord(r, kind, division));

      setItems(records);
    } catch (err: any) {
      setError(err.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [kind, division]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  // The public endpoint returns products from both the operational catalogue and
  // the CMS. This keeps the admin category picker current without a separate
  // manually-maintained category list, while still allowing a new value.
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.ok ? res.json() : [])
      .then(products => {
        if (!Array.isArray(products)) return;
        const categories = Array.from(new Set(products.map((product: any) => String(product.category || '').trim()).filter(Boolean))).sort();
        if (categories.length) setProductCategories(categories);
      })
      .catch(() => undefined);
  }, []);

  const type = contentTypes[division].find(e => e.key === kind) || contentTypes[division][0];
  const canEdit = user?.role === 'super_admin' || user?.role === 'division_staff';

  const newItem = (): ContentItem => ({
    id: `new-${Date.now()}`,
    division,
    kind,
    title: '',
    status: 'draft',
    body: '<p></p>',
    fields: Object.fromEntries(type.fields.map(f => [f, ''])),
    updatedAt: new Date().toISOString(),
    updatedBy: user?.name || 'Staff',
  });

  const openEditor = (item: ContentItem) => setEditing({ ...item, fields: { ...item.fields } });

  const save = async (status: ContentStatus) => {
    if (!editing || !editing.title.trim()) return;
    setSaving(true);
    setError(null);
    const body = editorRef.current?.innerHTML || '';
    const updated = { ...editing, status, body, updatedAt: new Date().toISOString(), updatedBy: user?.name || 'Staff' };
    const payload = buildPayload(updated, body, user);
    const backendKind = UI_TO_BACKEND_KIND[kind];
    const isNew = !editing.backendId;

    try {
      const url = isNew
        ? `/api/admin/content/${backendKind}`
        : `/api/admin/content/${backendKind}/${editing.backendId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${isNew ? 'create' : 'update'} content`);

      const saved = mapBackendRecord(data.record, kind, division);
      setItems(prev =>
        prev.some(i => i.backendId === saved.backendId)
          ? prev.map(i => i.backendId === saved.backendId ? saved : i)
          : [saved, ...prev]
      );
      setEditing(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: ContentItem) => {
    if (!item.backendId || !confirm(`Delete "${item.title}"?`)) return;
    const backendKind = UI_TO_BACKEND_KIND[kind];
    try {
      const res = await fetch(`/api/admin/content/${backendKind}/${item.backendId}`, {
        method: 'DELETE',
        headers: getAdminAuthHeaders(),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Delete failed');
      }
      setItems(prev => prev.filter(i => i.backendId !== item.backendId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const execute = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const handleImage = async (file?: File) => {
    if (!file || !editing) return;
    const backendDiv = DIVISION_MAP[division];
    try {
      const url = await uploadImage(file, backendDiv);
      setEditing(c => c ? { ...c, image: url } : c);
    } catch (err: any) {
      setError(`Image upload failed: ${err.message}`);
    }
  };

  if (!user || user.role === 'customer') return null;
  if (user.role === 'finance_reviewer') {
    return (
      <div className="bg-[#111318] border border-white/10 rounded-2xl p-8 text-center text-sm text-[#8A9AAF]">
        Content management is available to Division Staff and Super Admins.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-[#06D6A0] tracking-wider">Content operations</span>
          <h1 className="text-3xl font-cormorant font-bold text-[#F4F1EC]">
            {isSuperAdmin ? 'Content Across Divisions' : 'My Division Content'}
          </h1>
          <p className="text-xs text-[#8A9AAF] mt-1">
            Create, review, preview, and publish content — saved live to the database.
          </p>
        </div>
        {isSuperAdmin && (
          <select
            value={division}
            onChange={e => setDivision(e.target.value as DivisionType)}
            className="bg-[#111318] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F4F1EC] outline-none"
          >
            {divisions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}
      </div>

      {/* Kind tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {contentTypes[division].map(tab => (
          <button
            key={tab.key}
            onClick={() => setKind(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${kind === tab.key ? 'bg-[#06D6A0] text-[#080A0F]' : 'bg-[#111318] border border-white/10 text-[#8A9AAF]'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="px-4 py-3 bg-[#C84B1A]/20 border border-[#C84B1A]/50 rounded-xl text-xs text-[#C84B1A] font-bold">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8A9AAF] flex items-center gap-2">
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {items.length} {type.label.toLowerCase()}
        </p>
        {canEdit && (
          <button
            onClick={() => openEditor(newItem())}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#06D6A0] text-[#080A0F] rounded-xl text-xs font-bold uppercase"
          >
            <FilePlus2 className="w-4 h-4" /> New {type.label.slice(0, -1) || type.label}
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111318]">
        <table className="w-full min-w-[680px] text-left text-xs">
          <thead className="text-[#8A9AAF] border-b border-white/10">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last updated</th>
              <th className="p-4">Updated by</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center text-[#8A9AAF]"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></td></tr>
            ) : items.length ? items.map(item => (
              <tr key={item.id} className="border-b border-white/5 last:border-0">
                <td className="p-4 font-bold text-[#F4F1EC]">{item.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full uppercase text-[10px] font-bold ${item.status === 'published' ? 'bg-[#06D6A0]/15 text-[#06D6A0]' : 'bg-[#C8961E]/15 text-[#C8961E]'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-[#8A9AAF]">{readableDate(item.updatedAt)}</td>
                <td className="p-4 text-[#8A9AAF]">{item.updatedBy}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => setPreviewing(item)} className="p-2 text-[#06D6A0] hover:bg-white/5 rounded-lg" title="Preview">
                      <Eye className="w-4 h-4" />
                    </button>
                    {canEdit && (
                      <>
                        <button onClick={() => openEditor(item)} className="p-2 text-[#F4F1EC] hover:bg-white/5 rounded-lg" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => remove(item)} className="p-2 text-[#C84B1A] hover:bg-white/5 rounded-lg" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-10 text-center text-[#8A9AAF]">No {type.label.toLowerCase()} yet. Create the first one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="max-w-5xl mx-auto my-6 bg-[#111318] border border-white/10 rounded-3xl p-5 sm:p-8 space-y-6">
            <div className="flex justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#06D6A0]">{division} · {type.label}</span>
                <h2 className="text-2xl font-cormorant font-bold text-[#F4F1EC]">
                  {editing.title ? 'Edit content' : `New ${type.label.slice(0, -1)}`}
                </h2>
                <p className="text-xs text-[#8A9AAF]">
                  Last edited by {editing.updatedBy} on {readableDate(editing.updatedAt)}
                </p>
              </div>
              <button onClick={() => setEditing(null)} className="p-2 text-[#8A9AAF]"><X /></button>
            </div>

            {error && (
              <div className="px-3 py-2 bg-[#C84B1A]/20 border border-[#C84B1A]/50 rounded-xl text-xs text-[#C84B1A]">
                {error}
              </div>
            )}

            <input
              value={editing.title}
              onChange={e => setEditing({ ...editing, title: e.target.value })}
              placeholder="Content title"
              className="w-full bg-[#080A0F] border border-white/10 rounded-xl px-4 py-3 text-[#F4F1EC] outline-none"
            />

            <div className="grid sm:grid-cols-2 gap-4">
              {type.fields.map(field => (
                <label key={field} className="text-xs text-[#8A9AAF]">
                  {field}
                  {kind === 'products' && field === 'Category' ? (
                    <>
                      <input
                        list="product-categories"
                        value={editing.fields[field] || ''}
                        onChange={e => setEditing({ ...editing, fields: { ...editing.fields, [field]: e.target.value } })}
                        placeholder="Choose or enter a new category"
                        className="mt-1 w-full bg-[#080A0F] border border-white/10 rounded-xl px-3 py-2.5 text-[#F4F1EC] outline-none"
                      />
                      <datalist id="product-categories">
                        {productCategories.map(category => <option key={category} value={category} />)}
                      </datalist>
                    </>
                  ) : (
                    <input
                      value={editing.fields[field] || ''}
                      onChange={e => setEditing({ ...editing, fields: { ...editing.fields, [field]: e.target.value } })}
                      className="mt-1 w-full bg-[#080A0F] border border-white/10 rounded-xl px-3 py-2.5 text-[#F4F1EC] outline-none"
                    />
                  )}
                </label>
              ))}
            </div>

            {/* Rich text editor */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => execute('formatBlock', 'h2')} className="editor-command" title="Heading">H</button>
                <button onClick={() => execute('bold')} className="editor-command font-bold">B</button>
                <button onClick={() => execute('italic')} className="editor-command italic">I</button>
                <button onClick={() => execute('insertUnorderedList')} className="editor-command">• List</button>
                <button onClick={() => execute('insertOrderedList')} className="editor-command">1. List</button>
              </div>
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="min-h-44 bg-[#080A0F] border border-white/10 rounded-xl p-4 text-sm text-[#F4F1EC] outline-none prose-invert"
              />
            </div>

            {/* Image upload */}
            <label className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-[#8A9AAF] cursor-pointer">
              <ImagePlus className="w-4 h-4" /> Upload image (Cloudinary)
              <input type="file" accept="image/*" className="hidden" onChange={e => handleImage(e.target.files?.[0])} />
            </label>
            {editing.image && <img src={editing.image} alt="Content upload preview" className="max-h-52 rounded-xl border border-white/10" />}

            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={() => { const preview = { ...editing, body: editorRef.current?.innerHTML || '' }; setPreviewing(preview); }}
                className="px-4 py-2.5 border border-white/15 rounded-xl text-xs font-bold text-[#F4F1EC]"
              >
                <Eye className="inline w-4 h-4 mr-1" /> Preview
              </button>
              <button
                onClick={() => save('draft')}
                disabled={saving}
                className="px-4 py-2.5 bg-white/10 rounded-xl text-xs font-bold text-[#F4F1EC] disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save draft
              </button>
              <button
                onClick={() => save('published')}
                disabled={saving}
                className="px-4 py-2.5 bg-[#06D6A0] text-[#080A0F] rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview modal */}
      {previewing && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <article className="max-w-3xl mx-auto my-10 bg-[#F8FAFC] text-slate-900 rounded-3xl p-8 sm:p-12 relative">
            <button onClick={() => setPreviewing(null)} className="absolute top-5 right-5 p-2 text-slate-500"><X /></button>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
              Live preview · {previewing.status}
            </span>
            <h1 className="text-4xl font-cormorant font-bold mt-3">{previewing.title || 'Untitled content'}</h1>
            <p className="text-sm text-slate-500 mt-2">
              Last edited by {previewing.updatedBy} on {readableDate(previewing.updatedAt)}
            </p>
            {previewing.image && <img src={previewing.image} alt="Content preview" className="w-full rounded-2xl mt-6" />}
            <div
              className="mt-8 text-slate-700 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: previewing.body }}
            />
          </article>
        </div>
      )}
    </div>
  );
}
