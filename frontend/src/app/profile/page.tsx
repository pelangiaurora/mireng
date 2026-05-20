"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import {
  ShoppingBag,
  Package,
  CreditCard,
  ChevronRight,
  Star,
  Shield,
  LogOut,
  LayoutDashboard,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Hash,
  User,
} from "lucide-react";

/* ─── Types ────────────────────────────────── */
interface Order {
  id: string;
  items: { product: { name: string; imageUrl: string }; quantity: number }[];
  total: string;
  status: string;
  createdAt: string;
}

/* ─── Helpers ──────────────────────────────── */
const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const resolveImg = (url?: string) => {
  if (!url) return null;
  return url.startsWith("/uploads/") ? `http://localhost:3000${url}` : url;
};

const statusConfig: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  pending: {
    label: "Menunggu",
    icon: <Clock size={11} />,
    color: "text-amber-600 bg-amber-50",
  },
  paid: {
    label: "Dibayar",
    icon: <CheckCircle size={11} />,
    color: "text-blue-600 bg-blue-50",
  },
  completed: {
    label: "Selesai",
    icon: <CheckCircle size={11} />,
    color: "text-emerald-600 bg-emerald-50",
  },
  cancelled: {
    label: "Batal",
    icon: <XCircle size={11} />,
    color: "text-red-600 bg-red-50",
  },
};

const roleConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  seller: {
    label: "Seller",
    color: "from-violet-600 to-indigo-600",
    icon: <Star size={12} />,
  },
  admin: {
    label: "Admin",
    color: "from-rose-600 to-pink-600",
    icon: <Shield size={12} />,
  },
  customer: {
    label: "Customer",
    color: "from-sky-600 to-cyan-600",
    icon: <User size={12} />,
  },
};

/* ─── Avatar ───────────────────────────────── */
function Avatar({ email, size = "lg" }: { email: string; size?: "sm" | "lg" }) {
  const initial = email.charAt(0).toUpperCase();
  const colors = [
    "from-violet-500 to-indigo-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
    "from-sky-500 to-cyan-600",
  ];
  const color = colors[email.charCodeAt(0) % colors.length];

  if (size === "sm")
    return (
      <div
        className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
      >
        {initial}
      </div>
    );

  return (
    <div className="relative">
      <div
        className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-black text-4xl shadow-2xl`}
      >
        {initial}
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white" />
    </div>
  );
}

/* ─── Stat Card ────────────────────────────── */
function StatCard({
  icon,
  value,
  label,
  sub,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 p-5 text-center hover:bg-white/80 transition-all hover:shadow-md">
      <div className="flex justify-center mb-2 text-gray-400">{icon}</div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ─── Quick Link ───────────────────────────── */
function QuickLink({
  icon,
  label,
  href,
  desc,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100"
    >
      <div className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-gray-900 transition-colors flex items-center justify-center text-gray-600 group-hover:text-white flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
      <ChevronRight
        size={16}
        className="text-gray-300 group-hover:text-gray-600 transition-colors"
      />
    </Link>
  );
}

/* ─── Main ─────────────────────────────────── */
export default function ProfilePage() {
  const { user, logout } = useAuthStore();
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

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  const totalSpent = orders.reduce((s, o) => s + parseFloat(o.total), 0);
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const role = roleConfig[user.role] ?? roleConfig.customer;
  const displayName = user.email.split("@")[0];
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl" />

        <div className="relative max-w-3xl mx-auto px-6 pt-10 pb-20">
          <div className="flex items-end gap-6">
            <Avatar email={user.email} size="lg" />
            <div className="pb-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${role.color} shadow-lg`}
                >
                  {role.icon} {role.label}
                </span>
              </div>
              <h1 className="text-2xl font-black text-white capitalize">
                {displayName}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-6 -mt-10 pb-12 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<ShoppingBag size={20} />}
            value={String(orders.length)}
            label="Total Order"
          />
          <StatCard
            icon={<CreditCard size={20} />}
            value={fmt(totalSpent)}
            label="Total Belanja"
            sub={`${completedOrders} selesai`}
          />
          <StatCard
            icon={<Package size={20} />}
            value={String(completedOrders)}
            label="Selesai"
          />
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900">Informasi Akun</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { icon: <Mail size={15} />, label: "Email", value: user.email },
              {
                icon: <Hash size={15} />,
                label: "User ID",
                value: user.userId?.slice(0, 16) + "...",
              },
              { icon: <Shield size={15} />, label: "Role", value: role.label },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-4">
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900">Pesanan Terbaru</h2>
            <Link
              href="/orders"
              className="text-xs text-gray-400 hover:text-gray-900 transition-colors font-medium"
            >
              Lihat semua →
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                  </div>
                  <div className="h-5 bg-gray-100 rounded-full w-16" />
                </div>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-2xl mb-2">🛍️</p>
              <p className="text-sm text-gray-400">Belum ada pesanan</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order) => {
                const first = order.items[0];
                const imgUrl = resolveImg(first?.product?.imageUrl);
                const st = statusConfig[order.status] ?? statusConfig.pending;
                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {first?.product?.name}
                        {order.items.length > 1 && (
                          <span className="text-gray-400 font-normal">
                            {" "}
                            +{order.items.length - 1}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400">
                        {fmtDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">
                        {fmt(parseFloat(order.total))}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${st.color}`}
                      >
                        {st.icon}
                        {st.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-900">Menu Cepat</h2>
          </div>
          <div className="p-3 space-y-1">
            <QuickLink
              icon={<ShoppingBag size={18} />}
              label="Keranjang"
              href="/cart"
              desc="Lihat item di keranjang belanja"
            />
            <QuickLink
              icon={<Package size={18} />}
              label="Riwayat Pesanan"
              href="/orders"
              desc="Semua transaksi pembelian kamu"
            />
            {(user.role === "seller" || user.role === "admin") && (
              <QuickLink
                icon={<LayoutDashboard size={18} />}
                label="Dashboard Seller"
                href="/dashboard/products"
                desc="Kelola produk dan laporan"
              />
            )}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all font-semibold text-sm group"
        >
          <LogOut
            size={17}
            className="group-hover:translate-x-0.5 transition-transform"
          />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
