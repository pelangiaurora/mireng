"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { Trash2, ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";

interface CartProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
}

interface CartItem {
  id: string;
  product: CartProduct;
  quantity: number;
}

interface Cart {
  cartId: string;
  items: CartItem[];
  total: number;
}

function resolveImageUrl(url: string) {
  if (!url) return null;
  if (url.startsWith("/uploads/")) return `http://localhost:3000${url}`;
  return url;
}

export default function CartPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const fetchCart = () => {
    api
      .get("/cart")
      .then((res) => setCart(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchCart();
  }, [user]);

  const handleDelete = async (itemId: string) => {
    setDeletingId(itemId);
    try {
      await api.delete(`/cart/item/${itemId}`);
      fetchCart();
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateQty = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      handleDelete(item.id);
      return;
    }
    try {
      await api.post("/cart/add", {
        productId: item.product.id,
        quantity: delta,
      });
      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await api.post("/orders/checkout");
      router.push("/orders");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Checkout gagal");
    } finally {
      setCheckingOut(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  if (loading)
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 animate-pulse space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4 bg-white rounded-xl p-4 border">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-5 bg-gray-200 rounded w-1/4 mt-3" />
            </div>
          </div>
        ))}
      </div>
    );

  const items = cart?.items ?? [];
  const total = cart?.total ?? 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Keranjang Belanja</h1>
        {items.length > 0 && (
          <span className="ml-auto text-sm text-gray-500">
            {items.length} item
          </span>
        )}
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <div className="text-center py-24 space-y-4">
          <div className="text-6xl">🛒</div>
          <h2 className="text-xl font-semibold text-gray-700">
            Keranjang masih kosong
          </h2>
          <p className="text-gray-400 text-sm">
            Tambahkan produk dari halaman utama
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-4 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            <ShoppingCart size={16} />
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-3">
            {items.map((item) => {
              const imgUrl = resolveImageUrl(item.product.imageUrl);
              return (
                <div
                  key={item.id}
                  className="flex gap-4 bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${item.product.id}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          📦
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:underline truncate">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 truncate">
                      {item.product.description}
                    </p>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      {formatPrice(item.product.price)}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 border rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleUpdateQty(item, -1)}
                          className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors text-gray-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-semibold min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item, 1)}
                          className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors text-gray-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Subtotal + Delete */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border p-5 space-y-4 sticky top-24">
              <h2 className="font-bold text-gray-900">Ringkasan Pesanan</h2>

              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-gray-600"
                  >
                    <span className="truncate mr-2">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut || items.length === 0}
                className="w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {checkingOut ? "Memproses..." : "Checkout Sekarang"}
              </button>

              <Link
                href="/"
                className="block text-center text-sm text-gray-500 hover:text-black transition-colors"
              >
                Lanjut Belanja
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
