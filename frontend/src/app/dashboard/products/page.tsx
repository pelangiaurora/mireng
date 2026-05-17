"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Package,
  TrendingUp,
  DollarSign,
  Eye,
  MoreVertical,
  ImageIcon,
  Upload,
  ChevronDown,
  BarChart2,
  ArrowUpRight,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */
interface ProductImage {
  id: string;
  imageUrl: string;
  isThumbnail: boolean;
}
interface Seller {
  id: string;
  name: string;
}
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  images: ProductImage[];
  seller?: Seller;
  createdAt: string;
}

/* ─── Helpers ────────────────────────────────────────────── */
const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

const resolveImg = (url?: string) => {
  if (!url) return null;
  return url.startsWith("/uploads/") ? `http://localhost:3000${url}` : url;
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/* ─── Stat Card ──────────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5 ${accent}`}
      />
      <div
        className={`inline-flex p-2.5 rounded-xl ${accent} bg-opacity-10 mb-3`}
      >
        <span className="opacity-70">{icon}</span>
      </div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      {sub && (
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <ArrowUpRight size={11} className="text-emerald-500" />
          {sub}
        </p>
      )}
    </div>
  );
}

/* ─── Product Row ────────────────────────────────────────── */
function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const thumb =
    product.images?.find((i) => i.isThumbnail) ?? product.images?.[0];
  const imgUrl = resolveImg(thumb?.imageUrl);

  return (
    <tr className="group border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="py-3.5 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon size={14} className="text-gray-300" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
              {product.name}
            </p>
            <p className="text-xs text-gray-400 truncate max-w-[200px]">
              {product.description}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-3">
        <span className="text-sm font-bold text-gray-900">
          {fmt(product.price)}
        </span>
      </td>
      <td className="py-3.5 px-3">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            product.isActive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "bg-gray-100 text-gray-500 border border-gray-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${product.isActive ? "bg-emerald-500" : "bg-gray-400"}`}
          />
          {product.isActive ? "Aktif" : "Nonaktif"}
        </span>
      </td>
      <td className="py-3.5 px-3">
        <span className="text-xs text-gray-400">
          {product.images?.length ?? 0} foto
        </span>
      </td>
      <td className="py-3.5 px-3">
        <span className="text-xs text-gray-400">
          {fmtDate(product.createdAt)}
        </span>
      </td>
      <td className="py-3.5 pl-3 pr-6">
        <div className="relative flex justify-end">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={16} className="text-gray-500" />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 z-20 bg-white rounded-xl border border-gray-100 shadow-xl py-1.5 w-36 overflow-hidden">
                <button
                  onClick={() => {
                    onEdit(product);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 size={14} /> Edit Produk
                </button>
                <div className="border-t border-gray-50 my-1" />
                <button
                  onClick={() => {
                    onDelete(product);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ─── Modal Form ─────────────────────────────────────────── */
function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    isActive: product?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string | boolean) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError("");
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Nama produk wajib diisi");
      return;
    }
    if (!form.price || isNaN(Number(form.price))) {
      setError("Harga harus berupa angka");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        isActive: form.isActive,
      };
      if (isEdit) {
        await api.patch(`/products/${product!.id}`, body);
      } else {
        await api.post("/products", body);
      }
      onSave();
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      setError(
        Array.isArray(msg) ? msg.join(", ") : msg || "Gagal menyimpan produk",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit
                ? `ID: ${product!.id.slice(0, 8)}...`
                : "Isi detail produk di bawah"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <AlertTriangle
                size={15}
                className="text-red-500 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Nama Produk
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="cth. Netflix Premium 1 Bulan"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Jelaskan detail produk..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Harga (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                Rp
              </span>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="79000"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition-all"
              />
            </div>
            {form.price &&
              !isNaN(Number(form.price)) &&
              Number(form.price) > 0 && (
                <p className="text-xs text-gray-400 mt-1 pl-1">
                  {fmt(Number(form.price))}
                </p>
              )}
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Status Produk
              </p>
              <p className="text-xs text-gray-400">
                Produk aktif akan tampil di marketplace
              </p>
            </div>
            <button
              onClick={() => set("isActive", !form.isActive)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.isActive ? "bg-gray-900" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${form.isActive ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Menyimpan...
              </>
            ) : (
              <>
                <Check size={15} />{" "}
                {isEdit ? "Simpan Perubahan" : "Tambah Produk"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Confirm ─────────────────────────────────────── */
function DeleteModal({
  product,
  onClose,
  onConfirm,
}: {
  product: Product;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Hapus Produk?</h3>
        <p className="text-sm text-gray-500 mt-1.5">
          <span className="font-semibold text-gray-700">"{product.name}"</span>{" "}
          akan dihapus permanen dan tidak bisa dikembalikan.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {deleting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {deleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function DashboardProductsPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [editProduct, setEditProduct] = useState<Product | null | undefined>(
    undefined,
  );
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const fetchProducts = () => {
    api
      .get("/products")
      .then((res) => setProducts(res.data.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "seller" && user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchProducts();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteProduct) return;
    await api.delete(`/products/${deleteProduct.id}`);
    setDeleteProduct(null);
    fetchProducts();
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterActive === "all" ||
      (filterActive === "active" ? p.isActive : !p.isActive);
    return matchSearch && matchFilter;
  });

  const totalRevenue = products.reduce((s, p) => s + p.price, 0);
  const activeCount = products.filter((p) => p.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Dashboard Seller
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Kelola semua produk kamu di sini
            </p>
          </div>
          <button
            onClick={() => setEditProduct(null)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Plus size={16} />
            Tambah Produk
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Package size={18} />}
            label="Total Produk"
            value={String(products.length)}
            sub={`${activeCount} aktif`}
            accent="bg-blue-500"
          />
          <StatCard
            icon={<Eye size={18} />}
            label="Produk Aktif"
            value={String(activeCount)}
            sub="tampil di marketplace"
            accent="bg-emerald-500"
          />
          <StatCard
            icon={<DollarSign size={18} />}
            label="Total Nilai"
            value={fmt(totalRevenue)}
            sub="nilai semua produk"
            accent="bg-violet-500"
          />
          <StatCard
            icon={<BarChart2 size={18} />}
            label="Tdk Aktif"
            value={String(products.length - activeCount)}
            sub="tersembunyi"
            accent="bg-amber-500"
          />
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-6 py-4 border-b border-gray-50">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              {(["all", "active", "inactive"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterActive(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterActive === f
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {f === "all"
                    ? "Semua"
                    : f === "active"
                      ? "Aktif"
                      : "Nonaktif"}
                </button>
              ))}
            </div>
            <span className="ml-auto text-xs text-gray-400 hidden sm:block">
              {filtered.length} produk
            </span>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-100 rounded-lg w-1/3" />
                    <div className="h-3 bg-gray-100 rounded-lg w-1/4" />
                  </div>
                  <div className="h-3.5 bg-gray-100 rounded-lg w-20" />
                  <div className="h-6 bg-gray-100 rounded-full w-14" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-600">
                {search ? `Tidak ada produk "${search}"` : "Belum ada produk"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {search
                  ? "Coba kata kunci lain"
                  : "Klik tombol 'Tambah Produk' untuk mulai"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Produk
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Harga
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Foto
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Dibuat
                    </th>
                    <th className="py-3 pl-3 pr-6" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <ProductRow
                      key={p.id}
                      product={p}
                      onEdit={setEditProduct}
                      onDelete={setDeleteProduct}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          {filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Menampilkan{" "}
                <span className="font-semibold text-gray-600">
                  {filtered.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-gray-600">
                  {products.length}
                </span>{" "}
                produk
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {editProduct !== undefined && (
        <ProductModal
          product={editProduct}
          onClose={() => setEditProduct(undefined)}
          onSave={() => {
            setEditProduct(undefined);
            fetchProducts();
          }}
        />
      )}
      {deleteProduct && (
        <DeleteModal
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
