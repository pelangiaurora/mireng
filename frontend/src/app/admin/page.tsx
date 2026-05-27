'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import {
  Shield, Users, Store, Settings,
  FileText, ChevronRight, AlertTriangle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, initialized } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({
    pendingVerifications: 0,
    pendingApplications: 0,
  });

  useEffect(() => {
    if (!initialized) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }

    // Ambil stats
    Promise.all([
      api.get('/admin/verifications?status=pending').catch(() => ({ data: { data: [] } })),
      api.get('/admin/seller-applications?status=pending').catch(() => ({ data: { data: [] } })),
    ]).then(([verifRes, appRes]) => {
      const verifs = verifRes.data.data ?? [];
      const apps = appRes.data.data ?? [];
      setStats({
        pendingVerifications: Array.isArray(verifs) ? verifs.length : 0,
        pendingApplications: Array.isArray(apps) ? apps.length : 0,
      });
    });
  }, [user, initialized]);

  const menus = [
    {
      href: '/admin/verifications',
      icon: <Shield size={22} className="text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: 'Verifikasi Toko',
      desc: 'Review dokumen & approve/reject toko',
      badge: stats.pendingVerifications,
    },
    {
      href: '/admin/seller-applications',
      icon: <FileText size={22} className="text-violet-600" />,
      bg: 'bg-violet-50',
      title: 'Permohonan Seller',
      desc: 'Review permohonan seller saat ditutup',
      badge: stats.pendingApplications,
    },
    {
      href: '/admin/settings',
      icon: <Settings size={22} className="text-blue-600" />,
      bg: 'bg-blue-50',
      title: 'Platform Settings',
      desc: 'Komisi, buka/tutup pendaftaran, tier',
      badge: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-rose-600" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-400">Mireng Marketplace</p>
            </div>
          </div>
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
            Ke Beranda →
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Welcome */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Selamat datang</p>
          <h2 className="text-xl font-black mt-1">{user?.email}</h2>
          <div className="flex items-center gap-2 mt-3">
            {stats.pendingVerifications > 0 && (
              <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {stats.pendingVerifications} verifikasi pending
              </span>
            )}
            {stats.pendingApplications > 0 && (
              <span className="bg-violet-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {stats.pendingApplications} permohonan pending
              </span>
            )}
            {stats.pendingVerifications === 0 && stats.pendingApplications === 0 && (
              <span className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-full">
                Semua antrian kosong ✓
              </span>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-3">
          {menus.map(menu => (
            <Link
              key={menu.href}
              href={menu.href}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-all"
            >
              <div className={`w-12 h-12 ${menu.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                {menu.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900 text-sm">{menu.title}</p>
                  {menu.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {menu.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{menu.desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}