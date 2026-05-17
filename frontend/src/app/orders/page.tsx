"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface OrderProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface OrderItem {
  id: string;
  product: OrderProduct;
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: string;
  status: "pending" | "paid" | "completed" | "cancelled";
  createdAt: string;
}

function resolveImageUrl(url: string) {
  if (!url) return null;
  if (url.startsWith("/uploads/")) return `http://localhost:3000${url}`;
  return url;
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Menunggu Pembayaran",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: <Clock size={14} />,
  },
  paid: {
    label: "Sudah Dibayar",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <CheckCircle size={14} />,
  },
  completed: {
    label: "Selesai",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle size={14} />,
  },
  cancelled: {
    label: "Dibatalkan",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle size={14} />,
  },
};

function formatPrice(val: string | number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(parseFloat(String(val)));
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[order.status] ?? statusConfig.pending;
  const firstItem = order.items[0];
  const imgUrl = firstItem ? resolveImageUrl(firstItem.product.imageUrl) : null;

  return (
    <div className="bg-white rounded-xl border overflow-hidden hover:shadow-sm transition-shadow">
      {/* Order Header */}
      <div className="p-4 flex items-start gap-4">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={firstItem.product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              📦
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-semibold text-gray-900 truncate">
                {firstItem?.product.name}
                {order.items.length > 1 && (
                  <span className="text-gray-400 font-normal text-sm ml-1">
                    +{order.items.length - 1} produk lain
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${status.color}`}
            >
              {status.icon}
              {status.label}
            </span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-xs text-gray-400">Total Pembayaran</span>
              <p className="font-bold text-gray-900">
                {formatPrice(order.total)}
              </p>
            </div>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors"
            >
              {expanded ? "Sembunyikan" : "Lihat Detail"}
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Items */}
      {expanded && (
        <div className="border-t bg-gray-50 px-4 py-3 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Detail Produk
          </p>
          {order.items.map((item) => {
            const itemImg = resolveImageUrl(item.product.imageUrl);
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {itemImg ? (
                    <img
                      src={itemImg}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm">
                      📦
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.product.description}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(item.price)}
                  </p>
                  <p className="text-xs text-gray-400">x{item.quantity}</p>
                </div>
              </div>
            );
          })}

          {/* Order ID */}
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-400">
              ID Pesanan:{" "}
              <span className="font-mono text-gray-600">{order.id}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    api
      .get("/orders")
      .then((res) => setOrders(res.data.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading)
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border p-4 flex gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-5 bg-gray-200 rounded w-1/4 mt-2" />
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Pesanan</h1>
        {orders.length > 0 && (
          <span className="ml-auto text-sm text-gray-500">
            {orders.length} pesanan
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 space-y-4">
          <div className="text-6xl">📋</div>
          <h2 className="text-xl font-semibold text-gray-700">
            Belum ada pesanan
          </h2>
          <p className="text-gray-400 text-sm">
            Mulai belanja dan pesananmu akan muncul di sini
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-4 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            <Package size={16} />
            Lihat Produk
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
