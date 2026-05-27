'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import type { TierInfo } from '@/types/store';
import {
  ArrowLeft, Star, Trophy, Shield, TrendingUp,
  Eye, EyeOff, CheckCircle, Clock, AlertTriangle,
  Package, MessageCircle, ThumbsUp,
} from 'lucide-react';

/* ─── Tier Config ───────────────────────────── */
const TIER_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  regular:   { label: 'Regular',     color: 'text-gray-600',   bg: 'bg-gray-100',    icon: '🏪' },
  star:      { label: 'Star',        color: 'text-amber-600',  bg: 'bg-amber-50',    icon: '⭐' },
  star_plus: { label: 'Star+',       color: 'text-amber-600',  bg: 'bg-amber-50',    icon: '⭐⭐' },
  top:       { label: 'Top Seller',  color: 'text-violet-600', bg: 'bg-violet-50',   icon: '🏆' },
  official:  { label: 'Official',    color: 'text-blue-600',   bg: 'bg-blue-50',     icon: '🏅' },
};

/* ─── Progress Bar ──────────────────────────── */
function ProgressBar({ value, max, color = 'bg-gray-900' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ─── Metric Card ───────────────────────────── */
function MetricCard({ icon, label, value, suffix = '' }: {
  icon: React.ReactNode; label: string; value: string | number; suffix?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-2 text-gray-400">{icon}<span className="text-xs">{label}</span></div>
      <p className="text-xl font-black text-gray-900">{value}<span className="text-sm font-normal text-gray-400 ml-1">{suffix}</span></p>
    </div>
  );
}

/* ─── Tier Journey ──────────────────────────── */
function TierJourney({ currentTier }: { currentTier: string }) {
  const tiers = ['regular', 'star', 'star_plus', 'top', 'official'];
  const currentIdx = tiers.indexOf(currentTier);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Perjalanan Tier</h3>
      <div className="flex items-center justify-between">
        {tiers.map((tier, idx) => {
          const cfg = TIER_CONFIG[tier];
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={tier} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                  isDone ? 'bg-gray-900' :
                  isCurrent ? `${cfg.bg} ring-2 ring-offset-2 ring-gray-900` :
                  'bg-gray-100'
                }`}>
                  {isDone ? <CheckCircle size={18} className="text-white" /> : cfg.icon}
                </div>
                <p className={`text-xs mt-1.5 font-semibold ${isCurrent ? cfg.color : 'text-gray-400'}`}>
                  {cfg.label}
                </p>
              </div>
              {idx < tiers.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 mb-5 ${idx < currentIdx ? 'bg-gray-900' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────── */
export default function TierDashboardPage() {
  const { user, initialized } = useAuthStore();
  const router = useRouter();
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'seller') { router.push('/'); return; }

    api.get('/stores/seller/mine/tier')
      .then(res => setTierInfo(res.data.data ?? res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, initialized]);

  const handleToggleBadge = async () => {
    setToggling(true);
    try {
      const res = await api.patch('/stores/seller/mine/badge-toggle');
      const { badgeVisible } = res.data.data ?? res.data;
      setTierInfo(prev => prev ? { ...prev, badgeVisible } : prev);
    } catch {}
    finally { setToggling(false); }
  };

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!tierInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertTriangle size={40} className="text-gray-300 mx-auto" />
          <p className="text-gray-500">Gagal memuat info tier</p>
          <Link href="/dashboard/products" className="text-sm text-gray-900 underline">Ke Dashboard</Link>
        </div>
      </div>
    );
  }

  const currentCfg = TIER_CONFIG[tierInfo.currentTier] ?? TIER_CONFIG.regular;
  const isTopTier = tierInfo.currentTier === 'official' || tierInfo.nextTier === null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/dashboard/products" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-gray-900">Tier & Progress</h1>
            <p className="text-xs text-gray-400">Status dan perkembangan toko kamu</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Current Tier Card */}
        <div className={`${currentCfg.bg} rounded-3xl p-6 border border-gray-100`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tier Saat Ini</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl">{currentCfg.icon}</span>
                <h2 className={`text-2xl font-black ${currentCfg.color}`}>{currentCfg.label}</h2>
              </div>
            </div>
            <button
              onClick={handleToggleBadge}
              disabled={toggling}
              className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {tierInfo.badgeVisible
                ? <><Eye size={13} /> Badge Terlihat</>
                : <><EyeOff size={13} /> Badge Tersembunyi</>
              }
            </button>
          </div>

          {!isTopTier && tierInfo.nextTier && (
            <div className="bg-white/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-600">
                  Progress menuju {TIER_CONFIG[tierInfo.nextTier]?.label}
                </p>
                <p className="text-xs font-bold text-gray-900">{tierInfo.tierProgress} poin</p>
              </div>
              <ProgressBar value={tierInfo.tierProgress} max={
                tierInfo.nextTier === 'star' ? 50 :
                tierInfo.nextTier === 'star_plus' ? 150 :
                tierInfo.nextTier === 'top' ? 500 : 100
              } />
            </div>
          )}

          {isTopTier && (
            <div className="bg-white/60 rounded-2xl p-4 text-center">
              <Trophy size={24} className="text-violet-600 mx-auto mb-1" />
              <p className="text-sm font-bold text-gray-900">Tier Tertinggi! 🎉</p>
              <p className="text-xs text-gray-500 mt-0.5">Kamu sudah mencapai tier puncak.</p>
            </div>
          )}
        </div>

        {/* Tier Journey */}
        <TierJourney currentTier={tierInfo.currentTier} />

        {/* Metrics */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Metrik Toko</h3>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              icon={<Package size={14} />}
              label="Total Transaksi"
              value={tierInfo.metrics.totalTransactions}
            />
            <MetricCard
              icon={<Star size={14} />}
              label="Rating Rata-rata"
              value={Number(tierInfo.metrics.avgRating).toFixed(1)}
              suffix="/ 5.0"
            />
            <MetricCard
              icon={<MessageCircle size={14} />}
              label="Tingkat Respons"
              value={Number(tierInfo.metrics.responseRate).toFixed(0)}
              suffix="%"
            />
            <MetricCard
              icon={<ThumbsUp size={14} />}
              label="Tingkat Komplain"
              value={Number(tierInfo.metrics.complaintRate).toFixed(1)}
              suffix="%"
            />
          </div>
        </div>

        {/* Next Tier Criteria */}
        {!isTopTier && tierInfo.criteria && tierInfo.nextTier && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Syarat Naik ke {TIER_CONFIG[tierInfo.nextTier]?.label}
            </h3>
            <div className="space-y-3">
              {tierInfo.criteria.minTransactions && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package size={14} className="text-gray-400" />
                    <span>Transaksi berhasil</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {tierInfo.metrics.totalTransactions} / {tierInfo.criteria.minTransactions}
                    </span>
                    {tierInfo.metrics.totalTransactions >= Number(tierInfo.criteria.minTransactions)
                      ? <CheckCircle size={14} className="text-emerald-500" />
                      : <Clock size={14} className="text-gray-300" />
                    }
                  </div>
                </div>
              )}
              {tierInfo.criteria.minRating && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star size={14} className="text-gray-400" />
                    <span>Rating minimum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {Number(tierInfo.metrics.avgRating).toFixed(1)} / {tierInfo.criteria.minRating}
                    </span>
                    {tierInfo.metrics.avgRating >= Number(tierInfo.criteria.minRating)
                      ? <CheckCircle size={14} className="text-emerald-500" />
                      : <Clock size={14} className="text-gray-300" />
                    }
                  </div>
                </div>
              )}
              {tierInfo.criteria.minMonths && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp size={14} className="text-gray-400" />
                    <span>Bulan aktif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      min. {tierInfo.criteria.minMonths} bulan
                    </span>
                    <Shield size={14} className="text-gray-300" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}