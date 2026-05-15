'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { ShoppingCart, LogOut, Store } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const displayName = user?.name || user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-black">
          <Store size={24} />
          Mireng
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-gray-600 hover:text-black transition-colors">Produk</Link>
          {(user?.role === 'admin' || user?.role === 'seller') && (
            <Link href="/dashboard" className="text-gray-600 hover:text-black transition-colors">Dashboard Seller</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/cart" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ShoppingCart size={20} />
              </Link>
              <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors text-sm">
                <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                  {initial}
                </div>
                <span className="hidden md:inline">{displayName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Keluar</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                Masuk
              </Link>
              <Link href="/register" className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
