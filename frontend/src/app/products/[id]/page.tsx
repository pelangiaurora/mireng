'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import { ShoppingCart, ArrowLeft, ChevronLeft, ChevronRight, Store } from 'lucide-react';

interface ProductImage {
  id: string;
  imageUrl: string;
  isThumbnail: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  images: ProductImage[];
  seller?: { id: string; name: string };
}

function resolveImageUrl(url: string) {
  if (!url) return null;
  if (url.startsWith('/uploads/')) return `http://localhost:3000${url}`;
  return url;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [addingCart, setAddingCart] = useState(false);
  const [cartMsg, setCartMsg] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => {
        const data = res.data.data ?? res.data;
        setProduct(data);
        const thumbIdx = data.images?.findIndex((i: ProductImage) => i.isThumbnail);
        if (thumbIdx > 0) setActiveIdx(thumbIdx);
      })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { router.push('/login'); return; }
    setAddingCart(true);
    try {
      await api.post('/cart/add', { productId: id, quantity: 1 });
      setCartMsg('Berhasil ditambahkan ke keranjang!');
      setTimeout(() => setCartMsg(''), 3000);
    } catch (e: any) {
      setCartMsg(e?.response?.data?.message || 'Gagal menambahkan ke keranjang');
      setTimeout(() => setCartMsg(''), 3000);
    } finally {
      setAddingCart(false);
    }
  };

  if (loading) return (
    <div className="mx-auto max-w-5xl px-4 py-10 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-video bg-gray-200 rounded-xl" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-10 bg-gray-200 rounded w-1/3 mt-4" />
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const images = product.images ?? [];
  const activeImage = images[activeIdx];
  const imageUrl = activeImage ? resolveImageUrl(activeImage.imageUrl) : null;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft size={16} /> Kembali
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveIdx((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setActiveIdx((i) => (i + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-2 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeIdx + 1}/{images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => {
                const thumbUrl = resolveImageUrl(img.imageUrl);
                return (
                  <button
                    key={img.id}
                    onClick={() => setActiveIdx(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === activeIdx ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    {thumbUrl ? (
                      <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xl">📦</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            {product.seller && (
              <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                <Store size={14} />
                <span>{product.seller.name}</span>
              </div>
            )}
          </div>

          <div className="text-3xl font-bold text-gray-900">{formattedPrice}</div>

          <div className="border-t pt-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Deskripsi</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {cartMsg && (
            <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
              cartMsg.startsWith('Berhasil')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {cartMsg}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={addingCart || !product.isActive}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart size={18} />
              {addingCart ? 'Menambahkan...' : 'Tambah ke Keranjang'}
            </button>
          </div>

          {!user && (
            <p className="text-xs text-gray-400 text-center">
              Silakan{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-black underline font-medium"
              >
                masuk
              </button>{' '}
              untuk membeli produk ini
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
