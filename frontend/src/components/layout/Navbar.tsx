'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import {
  Store, Search, ShoppingCart, ChevronDown, LogOut,
  User, Package, LayoutDashboard, Bell, Menu, X,
  Zap, Shield, Star,
} from 'lucide-react';
import api from '@/lib/axios';

/* ─── Cart Count Hook ───────────────────────── */
function useCartCount() {
  const { user } = useAuthStore();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) { setCount(0); return; }
    api.get('/cart')
      .then(res => setCount(res.data.data?.items?.length ?? 0))
      .catch(() => setCount(0));
  }, [user]);

  return count;
}

/* ─── User Dropdown ─────────────────────────── */
function UserDropdown({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const roleConfig: Record<string, { label: string; color: string }> = {
    seller: { label: 'Seller', color: 'text-violet-600 bg-violet-50' },
    admin: { label: 'Admin', color: 'text-rose-600 bg-rose-50' },
    buyer: { label: 'Buyer', color: 'text-sky-600 bg-sky-50' },
    customer: { label: 'Customer', color: 'text-sky-600 bg-sky-50' },
  };

  const role = roleConfig[user?.role ?? 'buyer'];
  const initial = (user?.email ?? 'U').charAt(0).toUpperCase();
  const displayName = user?.email?.split('@')[0] ?? '';

  const handleLogout = () => {
    logout();
    onClose();
    router.push('/login');
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
      {/* User Info Header */}
      <div className="px-4 py-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 capitalize truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${role.color}`}>
          <Star size={10} /> {role.label}
        </span>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {[
          { icon: <User size={15} />, label: 'Profil Saya', href: '/profile' },
          { icon: <Package size={15} />, label: 'Riwayat Pesanan', href: '/orders' },
          { icon: <ShoppingCart size={15} />, label: 'Keranjang', href: '/cart' },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <span className="text-gray-400">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {(user?.role === 'seller' || user?.role === 'admin') && (
          <>
            <div className="mx-4 my-1.5 border-t border-gray-100" />
            <Link
              href="/dashboard/products"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-violet-600 hover:bg-violet-50 transition-colors font-medium"
            >
              <LayoutDashboard size={15} />
              Dashboard Seller
            </Link>
          </>
        )}
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 p-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={15} />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}

/* ─── Main Navbar ───────────────────────────── */
export default function Navbar() {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = useCartCount();

  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/?q=${encodeURIComponent(search.trim())}`);
  };

  const initial = (user?.email ?? '').charAt(0).toUpperCase();
  const displayName = user?.email?.split('@')[0] ?? '';

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div className="bg-gray-900 text-white text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
        <Zap size={11} className="text-yellow-400 flex-shrink-0" />
        <span className="text-gray-300">Selamat datang di <span className="text-white font-semibold">Mireng Marketplace</span> — Jual beli produk digital terpercaya</span>
        <Shield size={11} className="text-emerald-400 flex-shrink-0" />
      </div>

      {/* ── Main Navbar ── */}
      <nav className={`sticky top-0 z-40 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-black text-xl text-gray-900 flex-shrink-0 group">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                <Store size={16} className="text-white" />
              </div>
              <span className="hidden sm:inline">Mireng</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className="relative group">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                <input
                  type="text"
                  placeholder="Cari produk digital..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5 transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {user ? (
                <>
                  {/* Cart */}
                  <Link
                    href="/cart"
                    className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors group"
                    title="Keranjang"
                  >
                    <ShoppingCart size={20} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>

                  {/* Notification (placeholder) */}
                  <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors group hidden md:flex">
                    <Bell size={20} className="text-gray-600 group-hover:text-gray-900 transition-colors" />
                  </button>

                  {/* User Menu */}
                  <div className="relative ml-1" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(v => !v)}
                      className={`flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl transition-all ${showDropdown ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white text-xs font-bold">
                        {initial}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 hidden md:inline max-w-[100px] truncate">
                        {displayName}
                      </span>
                      <ChevronDown size={14} className={`text-gray-400 transition-transform hidden md:block ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDropdown && <UserDropdown onClose={() => setShowDropdown(false)} />}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors hidden sm:block"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    Daftar
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors ml-1 md:hidden"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* ── Bottom Nav (Desktop) ── */}
          <div className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto">
            {[
              { label: 'Semua Produk', href: '/' },
              { label: 'Akun Premium', href: '/?type=account' },
              { label: 'File Digital', href: '/?type=file' },
              { label: 'Lisensi', href: '/?type=license' },
              ...(user?.role === 'seller' || user?.role === 'admin'
                ? [{ label: '⚡ Dashboard Seller', href: '/dashboard/products' }]
                : []),
            ].map(item => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${pathname === item.href && !item.href.includes('?')
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {user ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
                      {initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 capitalize">{displayName}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  {[
                    { icon: <User size={16} />, label: 'Profil', href: '/profile' },
                    { icon: <ShoppingCart size={16} />, label: `Keranjang${cartCount > 0 ? ` (${cartCount})` : ''}`, href: '/cart' },
                    { icon: <Package size={16} />, label: 'Pesanan', href: '/orders' },
                    ...(user.role === 'seller' || user.role === 'admin'
                      ? [{ icon: <LayoutDashboard size={16} />, label: 'Dashboard Seller', href: '/dashboard/products' }]
                      : []),
                  ].map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <span className="text-gray-400">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link href="/login" className="text-center py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Masuk</Link>
                  <Link href="/register" className="text-center py-2.5 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors">Daftar</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
