'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/products')
      .then((res) => setProducts(res.data.data ?? res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-black px-8 py-12 text-center text-white">
        <h1 className="text-3xl font-bold mb-2">Mireng Marketplace</h1>
        <p className="text-gray-400 mb-6">Temukan akun, file, dan lisensi digital terpercaya</p>
        <div className="relative mx-auto max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-white/10 border border-white/20 py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-white"
          />
        </div>
      </div>

      {/* Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {search ? `Hasil "${search}"` : 'Semua Produk'}
          </h2>
          <span className="text-sm text-gray-500">{filtered.length} produk</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl border bg-white overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg font-medium">Produk tidak ditemukan</p>
            <p className="text-sm mt-1">Coba kata kunci lain atau tambah produk baru</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
