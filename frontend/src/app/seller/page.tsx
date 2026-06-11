'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import type { Store } from '@/types/store';
import {
    Package, ShoppingBag, Star, Settings,
    ChevronRight, Shield, TrendingUp, Eye,
    AlertTriangle, Clock, CheckCircle,
    BarChart2, Store as StoreIcon,
} from 'lucide-react';

export default function SellerCentrePage() {
    const { user, initialized } = useAuthStore();
    const router = useRouter();
    const [store, setStore] = useState<Store | null>(null);
    const [stats, setStats] = useState({ products: 0, activeProducts: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!initialized) return;
        if (!user) { router.push('/login'); return; }
        if (user.role !== 'seller' && user.role !== 'admin') {
            router.push('/');
            return;
        }

        Promise.all([
            api.get('/stores/seller/mine').catch(() => null),
        ]).then(async ([storeRes]) => {
            if (!storeRes) {
                router.push('/stores/create');
                return;
            }
            const storeData = storeRes.data.data ?? storeRes.data;
            setStore(storeData);

            // Fetch stats produk
            const productsRes = await api.get(`/products?storeId=${storeData.id}&limit=1`)
                .catch(() => null);
            if (productsRes) {
                const meta = productsRes.data.data?.meta ?? {};
                setStats({
                    products: meta.total ?? 0,
                    activeProducts: 0,
                });
            }
        }).finally(() => setLoading(false));
    }, [user, initialized]);

    if (loading || !initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            </div>
        );
    }

    if (!store) return null;

    const tierConfig: Record<string, { label: string; color: string; icon: string }> = {
        regular: { label: 'Regular', color: 'text-gray-600 bg-gray-100', icon: '🏪' },
        star: { label: 'Star', color: 'text-amber-700 bg-amber-50', icon: '⭐' },
        star_plus: { label: 'Star+', color: 'text-amber-700 bg-amber-50', icon: '⭐⭐' },
        top: { label: 'Top Seller', color: 'text-violet-700 bg-violet-50', icon: '🏆' },
        official: { label: 'Official', color: 'text-blue-700 bg-blue-50', icon: '🏅' },
    };
    const verifConfig: Record<string, { label: string; color: string; icon: any }> = {
        unverified: { label: 'Belum Verifikasi', color: 'text-gray-500', icon: <AlertTriangle size={14} /> },
        pending: { label: 'Pending Review', color: 'text-amber-600', icon: <Clock size={14} /> },
        approved: { label: 'Terverifikasi', color: 'text-emerald-600', icon: <CheckCircle size={14} /> },
        rejected: { label: 'Ditolak', color: 'text-red-600', icon: <AlertTriangle size={14} /> },
    };

    const tier = tierConfig[store.sellerTier] ?? tierConfig.regular;
    const verif = verifConfig[store.verifStatus] ?? verifConfig.unverified;

    const menuItems = [
        {
            href: '/seller/products',
            icon: <Package size={22} className="text-blue-600" />,
            bg: 'bg-blue-50',
            title: 'Kelola Produk',
            desc: 'Tambah, edit, hapus produk',
            badge: stats.products > 0 ? `${stats.products} produk` : null,
        },
        {
            href: '/seller/tier',
            icon: <Star size={22} className="text-amber-600" />,
            bg: 'bg-amber-50',
            title: 'Tier & Progress',
            desc: 'Status dan target tier kamu',
            badge: tier.icon + ' ' + tier.label,
        },
        {
            href: '/orders',
            icon: <ShoppingBag size={22} className="text-violet-600" />,
            bg: 'bg-violet-50',
            title: 'Pesanan Masuk',
            desc: 'Kelola pesanan dari buyer',
            badge: null,
        },
        {
            href: `/stores/${store.slug}`,
            icon: <Eye size={22} className="text-emerald-600" />,
            bg: 'bg-emerald-50',
            title: 'Halaman Toko',
            desc: 'Lihat tampilan toko publikmu',
            badge: null,
        },
        {
            href: '/profile',
            icon: <Settings size={22} className="text-gray-600" />,
            bg: 'bg-gray-100',
            title: 'Pengaturan',
            desc: 'Profil & keamanan akun',
            badge: null,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
                            <StoreIcon size={18} className="text-violet-600" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-gray-900">Seller Centre</h1>
                            <p className="text-xs text-gray-400">Mireng Marketplace</p>
                        </div>
                    </div>
                    <Link href="/" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
                        Ke Beranda →
                    </Link>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
                {/* Store Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                            {store.logo
                                ? <img src={store.logo} alt="logo" className="w-full h-full object-cover" />
                                : <StoreIcon size={24} className="text-white/60" />}
                        </div>
                        <div>
                            <h2 className="text-lg font-black">{store.name}</h2>
                            <p className="text-gray-400 text-xs mt-0.5">
                                {store.sellerType === 'physical' ? '🛍️ Toko Fisik' : '💻 Toko Digital'}
                                {store.city && ` • ${store.city}`}
                            </p>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Transaksi', value: store.totalTransactions ?? 0 },
                            { label: 'Rating', value: Number(store.avgRating ?? 0).toFixed(1) },
                            { label: 'Respons', value: `${store.responseRate ?? 0}%` },
                        ].map(s => (
                            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                                <p className="text-lg font-black">{s.value}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${tier.color}`}>
                            {tier.icon} {tier.label}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 ${verif.color}`}>
                            {verif.icon} {verif.label}
                        </span>
                    </div>
                </div>

                {/* Verif Warning */}
                {store.verifStatus === 'unverified' && (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
                        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-amber-800">Toko belum terverifikasi</p>
                            <p className="text-xs text-amber-600 mt-0.5 mb-2">
                                Verifikasi untuk meningkatkan kepercayaan pembeli dan akses fitur lengkap.
                            </p>
                            <Link href="/stores/verify"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-all">
                                <Shield size={12} /> Mulai Verifikasi
                            </Link>
                        </div>
                    </div>
                )}

                {/* Menu */}
                <div className="space-y-3">
                    {menuItems.map(item => (
                        <Link key={item.href} href={item.href}
                            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-all">
                            <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                                    {item.badge && (
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                            </div>
                            <ChevronRight size={16} className="text-gray-300" />
                        </Link>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <TrendingUp size={14} />
                            <span className="text-xs">Progress Tier</span>
                        </div>
                        <p className="text-xl font-black text-gray-900">{store.tierProgress ?? 0}</p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                            <div className="h-1.5 bg-gray-900 rounded-full"
                                style={{ width: `${Math.min(100, (store.tierProgress ?? 0) / 5)}%` }} />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <BarChart2 size={14} />
                            <span className="text-xs">Total Produk</span>
                        </div>
                        <p className="text-xl font-black text-gray-900">{stats.products}</p>
                        <p className="text-xs text-gray-400 mt-1">di toko kamu</p>
                    </div>
                </div>
            </div>
        </div>
    );
}