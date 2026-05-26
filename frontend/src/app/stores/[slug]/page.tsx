'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import type { Store as StoreType } from '@/types/store';
import {
  ArrowLeft, Star, Package, MessageCircle,
  MapPin, Phone, Shield, ShoppingBag, Monitor,
  CheckCircle, Clock, AlertTriangle, Store,
} from 'lucide-react';

/* ─── Tier Badge ────────────────────────────── */
function TierBadge({ tier, visible }: { tier: string; visible: boolean }) {
  if (!visible || tier === 'regular') return null;

  const config: Record<string, { label: string; color: string }> = {
    star:      { label: '⭐ Star',        color: 'bg-amber-50 text-amber-700 border-amber-200' },
    star_plus: { label: '⭐⭐ Star+',     color: 'bg-amber-50 text-amber-700 border-amber-200' },
    top:       { label: '🏆 Top Seller',  color: 'bg-violet-50 text-violet-700 border-violet-200' },
    official:  { label: '🏅 Official',    color: 'bg-blue-50 text-blue-700 border-blue-200' },
  };

  const c = config[tier];
  if (!c) return null;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${c.color}`}>
      {c.label}
    </span>
  );
}

/* ─── Verif Badge ───────────────────────────── */
function VerifBadge({ status }: { status: string }) {
  if (status !== 'approved') return null;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle size={11} /> Terverifikasi
    </span>
  );
}

/* ─── Seller Type Badge ─────────────────────── */
function SellerTypeBadge({ type }: { type: string }) {
  if (type === 'physical') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-violet-50 text-violet-600">
        <ShoppingBag size={10} /> Toko Fisik
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600">
      <Monitor size={10} /> Toko Digital
    </span>
  );
}

/* ─── Product Card ──────────────────────────── */
function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const image = product.images?.[0]?.url ?? product.thumbnail;

  return (
    <div
      onClick={() => router.push(`/products/${product.id}`)}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {image
          ? <img src={image} alt={product.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-200"><Package size={32} /></div>
        }
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">{product.name}</p>
        <p className="text-sm font-black text-gray-900 mt-1">
          Rp {Number(product.price).toLocaleString('id-ID')}
        </p>
        {product.totalSold > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">{product.totalSold} terjual</p>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────── */
export default function StorePublicPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [store, setStore] = useState<StoreType | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    Promise.all([
      api.get(`/stores/${slug}`),
      api.get(`/products?storeSlug=${slug}&limit=20`).catch(() => ({ data: { data: [] } })),
    ])
      .then(([storeRes, productsRes]) => {
        const storeData = storeRes.data.data ?? storeRes.data;
        const productsData = productsRes.data.data?.data ?? productsRes.data.data ?? [];
        setStore(storeData);
        setProducts(Array.isArray(productsData) ? productsData : []);
      })
      .catch(() => setError('Toko tidak ditemukan'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Memuat toko...</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertTriangle size={40} className="text-gray-300 mx-auto" />
          <p className="text-gray-500 font-medium">Toko tidak ditemukan</p>
          <Link href="/" className="text-sm text-gray-900 underline">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <p className="text-sm font-semibold text-gray-900">{store.name}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Store Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 relative">
            {store.banner && (
              <img src={store.banner} alt="banner" className="w-full h-full object-cover" />
            )}
            {store.holidayMode && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
                  <Clock size={14} /> Mode Liburan
                </div>
              </div>
            )}
          </div>

          {/* Store Info */}
          <div className="px-6 pb-6">
            {/* Logo */}
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div className="w-16 h-16 bg-white rounded-2xl border-2 border-gray-100 shadow-sm flex items-center justify-center overflow-hidden">
                {store.logo
                  ? <img src={store.logo} alt="logo" className="w-full h-full object-cover" />
                  : <Store size={28} className="text-gray-400" />
                }
              </div>
              <div className="flex gap-2">
                <VerifBadge status={store.verifStatus} />
                <TierBadge tier={store.sellerTier} visible={store.badgeVisible} />
              </div>
            </div>

            {/* Name & Type */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-gray-900">{store.name}</h1>
                <SellerTypeBadge type={store.sellerType} />
              </div>

              {store.description && (
                <p className="text-sm text-gray-500 leading-relaxed">{store.description}</p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-gray-900">
                    {Number(store.avgRating || store.rating).toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400">({store.totalReviews} ulasan)</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Package size={12} />
                  <span>{store.totalTransactions} transaksi</span>
                </div>
                {store.responseRate > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MessageCircle size={12} />
                    <span>{store.responseRate}% respon</span>
                  </div>
                )}
              </div>

              {/* Location & Contact */}
              <div className="flex flex-wrap gap-3 pt-1">
                {(store.city || store.province) && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={12} />
                    <span>{[store.city, store.province].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {store.phone && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Phone size={12} />
                    <span>{store.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Holiday Notice */}
        {store.holidayMode && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
            <Clock size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Toko sedang libur</p>
              {store.holidayNote && (
                <p className="text-xs text-amber-600 mt-0.5">{store.holidayNote}</p>
              )}
            </div>
          </div>
        )}

        {/* Verif Warning */}
        {store.verifStatus !== 'approved' && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
            <Shield size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Toko belum terverifikasi</p>
              <p className="text-xs text-blue-600 mt-0.5">Transaksi tetap aman. Verifikasi sedang diproses.</p>
            </div>
          </div>
        )}

        {/* Products */}
        <div>
          <h2 className="text-base font-black text-gray-900 mb-4">
            Produk ({products.length})
          </h2>
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Package size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Belum ada produk di toko ini</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}