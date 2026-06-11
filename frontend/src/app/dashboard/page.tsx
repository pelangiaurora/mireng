'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import {
  Package, Heart, Wallet, MapPin,
  ChevronRight, ShoppingBag,
} from 'lucide-react';

export default function BuyerDashboardPage() {
  const { user, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
    if (!user) { router.push('/login'); return; }
    // Seller & admin punya dashboard sendiri di /seller
    if (user.role === 'seller' || user.role === 'admin') {
      router.push('/seller');
    }
  }, [user, initialized]);

  if (!initialized || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { href: '/orders', icon: <ShoppingBag size={22} className="text-violet-600" />, bg: 'bg-violet-50', title: 'Pesanan Saya', desc: 'Lacak & lihat riwayat pesanan' },
    { href: '/wishlist', icon: <Heart size={22} className="text-rose-600" />, bg: 'bg-rose-50', title: 'Wishlist', desc: 'Produk favorit kamu' },
    { href: '/wallet', icon: <Wallet size={22} className="text-emerald-600" />, bg: 'bg-emerald-50', title: 'Saldo & Wallet', desc: 'Saldo refund dan cashback' },
    { href: '/profile', icon: <MapPin size={22} className="text-blue-600" />, bg: 'bg-blue-50', title: 'Alamat Tersimpan', desc: 'Kelola alamat pengiriman' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-base font-bold text-gray-900">Dashboard Saya</h1>
          <p className="text-xs text-gray-400">Halo, {user.name || user.email?.split('@')[0]}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {menuItems.map(item => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-all">
            <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">{item.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}