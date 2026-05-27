'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import type { StoreVerification } from '@/types/store';
import {
  ArrowLeft, Shield, CheckCircle, XCircle,
  Clock, AlertTriangle, Eye, RefreshCw,
} from 'lucide-react';

/* ─── Status Badge ──────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    pending:       { label: 'Pending',        color: 'bg-amber-50 text-amber-700 border-amber-200' },
    approved:      { label: 'Approved',       color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    rejected:      { label: 'Rejected',       color: 'bg-red-50 text-red-700 border-red-200' },
    need_revision: { label: 'Perlu Revisi',   color: 'bg-blue-50 text-blue-700 border-blue-200' },
  };
  const c = config[status] ?? config.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${c.color}`}>
      {c.label}
    </span>
  );
}

/* ─── Review Modal ──────────────────────────── */
function ReviewModal({ verif, onClose, onDone }: {
  verif: StoreVerification;
  onClose: () => void;
  onDone: () => void;
}) {
  const [status, setStatus] = useState<'approved' | 'rejected' | 'need_revision'>('approved');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await api.patch(`/admin/verifications/${verif.id}/review`, {
        status,
        notesFromAdmin: notes,
      });
      onDone();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Gagal memproses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-gray-900">Review Verifikasi</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900">✕</button>
        </div>

        {/* Dokumen */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs">
          <p className="font-semibold text-gray-700">Dokumen yang diupload:</p>
          {[
            { label: 'KTP', url: verif.documentKtp },
            { label: 'Selfie', url: verif.documentSelfie },
            { label: 'NIB', url: verif.documentNib },
            { label: 'SIUP', url: verif.documentSiup },
            { label: 'Akta', url: verif.documentAkta },
            { label: 'NPWP', url: verif.documentNpwp },
          ].filter(d => d.url).map(doc => (
            <a key={doc.label} href={doc.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline">
              <Eye size={12} /> {doc.label}
            </a>
          ))}
          {verif.notesFromSeller && (
            <p className="text-gray-500 mt-2">Catatan seller: {verif.notesFromSeller}</p>
          )}
        </div>

        {/* Keputusan */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Keputusan</p>
          <div className="grid grid-cols-3 gap-2">
            {(['approved', 'rejected', 'need_revision'] as const).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all ${
                  status === s ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}>
                {s === 'approved' ? '✓ Approve' : s === 'rejected' ? '✗ Reject' : '↻ Revisi'}
              </button>
            ))}
          </div>
        </div>

        {/* Catatan */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Catatan Admin {status !== 'approved' && <span className="text-red-400">*</span>}
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={status === 'approved' ? 'Opsional...' : 'Jelaskan alasan...'}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-all resize-none"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 rounded-xl px-4 py-3 text-sm text-red-600">
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 disabled:opacity-50 transition-all">
            {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</> : 'Simpan Keputusan'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────── */
export default function AdminVerificationsPage() {
  const { user, initialized } = useAuthStore();
  const router = useRouter();
  const [verifs, setVerifs] = useState<StoreVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selected, setSelected] = useState<StoreVerification | null>(null);

  const fetchVerifs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/verifications?status=${filter}`);
      const data = res.data.data ?? [];
      setVerifs(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!initialized) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }
    fetchVerifs();
  }, [user, initialized, filter]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {selected && (
        <ReviewModal
          verif={selected}
          onClose={() => setSelected(null)}
          onDone={() => { setSelected(null); fetchVerifs(); }}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">Verifikasi Toko</h1>
            <p className="text-xs text-gray-400">{verifs.length} antrian</p>
          </div>
          <button onClick={fetchVerifs} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <RefreshCw size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['pending', 'approved', 'rejected', 'need_revision'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}>
              {s === 'pending' ? 'Pending' : s === 'approved' ? 'Approved' : s === 'rejected' ? 'Rejected' : 'Perlu Revisi'}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : verifs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Shield size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Tidak ada antrian {filter}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {verifs.map(verif => (
              <div key={verif.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900 text-sm">
                        {(verif as any).store?.name ?? verif.storeId}
                      </p>
                      <StatusBadge status={verif.status} />
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-gray-400 capitalize">{verif.sellerType}</span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-400 capitalize">{verif.storeType}</span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-400">
                        {new Date(verif.submittedAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    {verif.notesFromAdmin && (
                      <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 rounded-lg px-3 py-1.5">
                        Catatan: {verif.notesFromAdmin}
                      </p>
                    )}
                  </div>
                  {verif.status === 'pending' || verif.status === 'need_revision' ? (
                    <button onClick={() => setSelected(verif)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-700 transition-all flex-shrink-0">
                      <Eye size={12} /> Review
                    </button>
                  ) : (
                    <div className="flex-shrink-0">
                      {verif.status === 'approved'
                        ? <CheckCircle size={20} className="text-emerald-500" />
                        : <XCircle size={20} className="text-red-400" />
                      }
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}