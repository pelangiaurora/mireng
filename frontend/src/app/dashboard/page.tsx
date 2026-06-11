'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import {
  Package, Heart, Wallet, MapPin, Store,
  ChevronRight, Clock, Truck, CheckCircle,
  CreditCard, Star, Sparkles,
} from 'lucide-react';

/* ─── Section Header ────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">
      {children}
    </p>
  );
}

/* ─── Menu Item ─────────────────────────────── */
function MenuItem({ href, icon, bg, title, desc, badge, comingSoon }: {
  href: string; icon: React.ReactNode; bg: string;
  title: string; desc: string; badge?: string | number; comingSoon?: boolean;
}) {
  const content = (
    <div className={`flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 transition-all ${comingSoon ? 'opacity-60' : 'hover:shadow-sm'
      }`}>
      <div className={`w-11 h-11 ${bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-gray-900 text-sm">{title}</p>
          {badge !== undefined && Number(badge) > 0 && (
            <span className="bg-gray-900 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {badge}
            </span>
          )}
          {comingSoon && (
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
              Segera Hadir
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      {!comingSoon && <ChevronRight size={16} className="text-gray-300" />}
    </div>
  );

  if (comingSoon) return <div className="cursor-not-allowed">{content}</div>;
  return <Link href={href}>{content}</Link>;
}

/* ─── Order Status Quick Access ─────────────── */
function OrderStatusBar({ counts }: { counts: Record<string, number> }) {
  const statuses = [
    { key: 'pending', label: 'Belum Bayar', icon: <CreditCard size={18} />, color: 'text-amber-600' },
    { key: 'processing', label: 'Diproses', icon: <Package size={18} />, color: 'text-blue-600' },
    { key: 'shipped', label: 'Dikirim', icon: <Truck size={18} />, color: 'text-violet-600' },
    { key: 'completed', label: 'Selesai', icon: <CheckCircle size={18} />, color: 'text-emerald-600' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-gray-900">Pesanan Saya</p>
        <Link href="/orders" className="text-xs text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1">
          Lihat Semua <ChevronRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {statuses.map(s => (
          <Link key={s.key} href={`/orders?status=${s.key}`}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition-colors relative">
            <span className={s.color}>{s.icon}</span>
            <span className="text-xs text-gray-500 text-center leading-tight">{s.label}</span>
            {counts[s.key] > 0 && (
              <span className="absolute top-1 right-1/4 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {counts[s.key] > 9 ? '9+' : counts[s.key]}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────── */
export default function BuyerDashboardPage() {
  const { user, initialized } = useAuthStore();
  const router = useRouter();
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialized) return;
    if (!user) { router.push('/login'); return; }

    // Seller & admin punya pusat sendiri
    if (user.role === 'seller' || user.role === 'admin') {
      router.push('/seller');
      return;
    }

    // Ambil data pesanan untuk badge counter
    api.get('/orders')
      .then(res => {
        const orders = res.data.data?.data ?? res.data.data ?? [];
        const counts: Record<string, number> = {};
        if (Array.isArray(orders)) {
          orders.forEach((o: any) => {
            const status = o.status ?? 'pending';
            counts[status] = (counts[status] ?? 0) + 1;
          });
        }
        setOrderCounts(counts);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [user, initialized]);

  if (!initialized || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = user.name || user.email?.split('@')[0] || 'Pembeli';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-base font-bold text-gray-900">Akun Saya</h1>
          <p className="text-xs text-gray-400">Kelola pesanan, favorit, dan akun kamu</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-black overflow-hidden flex-shrink-0">
              {user.avatar
                ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                : initial}
            </div>
            <div>
              <h2 className="text-lg font-black capitalize">{displayName}</h2>
              <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <OrderStatusBar counts={orderCounts} />

        {/* Favorit */}
        <div>
          <SectionLabel>Favorit</SectionLabel>
          <div className="space-y-3">
            <MenuItem
              href="/wishlist"
              icon={<Heart size={20} className="text-rose-600" />}
              bg="bg-rose-50"
              title="Wishlist Produk"
              desc="Produk yang kamu simpan"
              comingSoon
            />
            <MenuItem
              href="/following"
              icon={<Store size={20} className="text-violet-600" />}
              bg="bg-violet-50"
              title="Toko Diikuti"
              desc="Toko favorit kamu"
              comingSoon
            />
          </div>
        </div>

        {/* Keuangan */}
        <div>
          <SectionLabel>Keuangan</SectionLabel>
          <div className="space-y-3">
            <MenuItem
              href="/wallet"
              icon={<Wallet size={20} className="text-emerald-600" />}
              bg="bg-emerald-50"
              title="Saldo Mireng"
              desc="Saldo refund & cashback"
              comingSoon
            />
          </div>
        </div>

        {/* Akun */}
        <div>
          <SectionLabel>Akun</SectionLabel>
          <div className="space-y-3">
            <MenuItem
              href="/profile"
              icon={<MapPin size={20} className="text-blue-600" />}
              bg="bg-blue-50"
              title="Alamat Tersimpan"
              desc="Kelola alamat pengiriman"
            />
            <MenuItem
              href="/profile"
              icon={<Star size={20} className="text-amber-600" />}
              bg="bg-amber-50"
              title="Profil & Keamanan"
              desc="Ubah data diri & password"
            />
          </div>
        </div>

        {/* CTA Jadi Seller */}
        {user.role === 'buyer' && (
          <Link href="/stores/create"
            className="flex items-center gap-4 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-5 text-white hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles size={22} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Mulai Berjualan di Mireng</p>
              <p className="text-xs text-white/70 mt-0.5">Buka toko gratis, jual produk fisik atau digital</p>
            </div>
            <ChevronRight size={18} />
          </Link>
        )}
      </div>
    </div>
  );
}