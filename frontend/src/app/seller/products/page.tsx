'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import type { Store } from '@/types/store';
import {
  Plus, Search, Edit2, Trash2, X, Check,
  Package, DollarSign, Eye, MoreVertical, ImageIcon,
  BarChart2, ArrowUpRight, Store as StoreIcon,
  Shield, Star, Settings, ChevronRight, AlertTriangle,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────── */
interface ProductImage { id: string; imageUrl: string; isThumbnail: boolean; }
interface Product {
  id: string; name: string; description: string; price: number;
  isActive: boolean; type: string; images: ProductImage[];
  seller?: { id: string; name: string }; createdAt: string;
}

/* ─── Helpers ───────────────────────────────── */
const fmt = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const resolveImg = (url?: string) => {
  if (!url) return null;
  return url.startsWith('/uploads/') ? `http://localhost:3000${url}` : url;
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const typeLabel: Record<string, string> = {
  physical: '📦 Fisik', digital: '💾 Digital', service: '🛠️ Jasa',
  account: '👤 Akun', file: '📁 File', license: '🔑 Lisensi',
};

/* ─── Store Banner ──────────────────────────── */
function StoreBanner({ store }: { store: Store }) {
  const tierConfig: Record<string, { label: string; color: string }> = {
    regular: { label: 'Regular', color: 'text-gray-500 bg-gray-100' },
    star: { label: '⭐ Star', color: 'text-amber-700 bg-amber-50' },
    star_plus: { label: '⭐⭐ Star+', color: 'text-amber-700 bg-amber-50' },
    top: { label: '🏆 Top', color: 'text-violet-700 bg-violet-50' },
    official: { label: '🏅 Official', color: 'text-blue-700 bg-blue-50' },
  };
  const verifConfig: Record<string, { label: string; color: string }> = {
    unverified: { label: 'Belum Verifikasi', color: 'text-gray-500 bg-gray-100' },
    pending: { label: 'Verifikasi Pending', color: 'text-amber-700 bg-amber-50' },
    approved: { label: '✓ Terverifikasi', color: 'text-emerald-700 bg-emerald-50' },
    rejected: { label: 'Ditolak', color: 'text-red-700 bg-red-50' },
  };

  const tier = tierConfig[store.sellerTier] ?? tierConfig.regular;
  const verif = verifConfig[store.verifStatus] ?? verifConfig.unverified;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
            {store.logo
              ? <img src={store.logo} alt="logo" className="w-full h-full object-cover" />
              : <StoreIcon size={22} className="text-gray-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-gray-900">{store.name}</h2>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tier.color}`}>
                {tier.label}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${verif.color}`}>
                {verif.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {store.sellerType === 'physical' ? '🛍️ Toko Fisik' : '💻 Toko Digital'}
              {store.city && ` • ${store.city}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/stores/${store.slug}`}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            <Eye size={13} /> Lihat Toko
          </Link>
          <Link href="/dashboard/tier"
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-amber-600 hover:bg-amber-50 transition-all">
            <Star size={13} /> Tier
          </Link>
          {store.verifStatus === 'unverified' && (
            <Link href="/stores/verify"
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all">
              <Shield size={13} /> Verifikasi
            </Link>
          )}
        </div>
      </div>

      {/* Warning kalau belum verifikasi */}
      {store.verifStatus === 'unverified' && (
        <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            Toko belum terverifikasi. Lengkapi verifikasi untuk meningkatkan kepercayaan pembeli.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Stat Card ─────────────────────────────── */
function StatCard({ icon, label, value, sub, accent }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; accent: string;
}) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5 ${accent}`} />
      <div className={`inline-flex p-2.5 rounded-xl ${accent} bg-opacity-10 mb-3`}>
        <span className="opacity-70">{icon}</span>
      </div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      {sub && (
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <ArrowUpRight size={11} className="text-emerald-500" />{sub}
        </p>
      )}
    </div>
  );
}

/* ─── Product Row ───────────────────────────── */
function ProductRow({ product, onEdit, onDelete }: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const thumb = product.images?.find(i => i.isThumbnail) ?? product.images?.[0];
  const imgUrl = resolveImg(thumb?.imageUrl);

  return (
    <tr className="group border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="py-3.5 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
            {imgUrl
              ? <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={14} className="text-gray-300" /></div>}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{product.name}</p>
            <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-3">
        <span className="text-sm font-bold text-gray-900">{fmt(product.price)}</span>
      </td>
      <td className="py-3.5 px-3">
        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
          {typeLabel[product.type] ?? product.type}
        </span>
      </td>
      <td className="py-3.5 px-3">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${product.isActive
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
          : 'bg-gray-100 text-gray-500 border border-gray-200'
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${product.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          {product.isActive ? 'Aktif' : 'Nonaktif'}
        </span>
      </td>
      <td className="py-3.5 px-3">
        <span className="text-xs text-gray-400">{product.images?.length ?? 0} foto</span>
      </td>
      <td className="py-3.5 px-3">
        <span className="text-xs text-gray-400">{fmtDate(product.createdAt)}</span>
      </td>
      <td className="py-3.5 pl-3 pr-6">
        <div className="relative flex justify-end">
          <button onClick={() => setMenuOpen(v => !v)}
            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical size={16} className="text-gray-500" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white rounded-xl border border-gray-100 shadow-xl py-1.5 w-36">
                <button onClick={() => { onEdit(product); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Edit2 size={14} /> Edit Produk
                </button>
                <div className="border-t border-gray-50 my-1" />
                <button onClick={() => { onDelete(product); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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

/* ─── Product Modal ─────────────────────────── */
function ProductModal({ product, onClose, onSave }: {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ? String(product.price) : '',
    type: product?.type ?? 'digital',
    isActive: product?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Nama produk wajib diisi'); return; }
    if (!form.price || isNaN(Number(form.price))) { setError('Harga tidak valid'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, price: Number(form.price) };
      if (isEdit) {
        await api.patch(`/products/${product.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      onSave();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Gagal menyimpan produk');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          {/* Nama */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Nama Produk <span className="text-red-400">*</span>
            </label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="cth. Akun Netflix Premium 1 Bulan"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-all" />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Deskripsi
            </label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Jelaskan detail produk kamu..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-all resize-none" />
          </div>

          {/* Harga */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Harga (Rp) <span className="text-red-400">*</span>
            </label>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
              placeholder="50000"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-all" />
            {form.price && !isNaN(Number(form.price)) && Number(form.price) > 0 && (
              <p className="text-xs text-gray-400 mt-1 pl-1">{fmt(Number(form.price))}</p>
            )}
          </div>

          {/* Tipe */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Tipe Produk
            </label>
            <select value={form.type} onChange={e => set('type', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-all bg-white">
              <option value="digital">💾 Digital</option>
              <option value="physical">📦 Fisik</option>
              <option value="account">👤 Akun</option>
              <option value="file">📁 File</option>
              <option value="license">🔑 Lisensi</option>
              <option value="service">🛠️ Jasa</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-800">Status Produk</p>
              <p className="text-xs text-gray-400">Produk aktif akan tampil di marketplace</p>
            </div>
            <button onClick={() => set('isActive', !form.isActive)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.isActive ? 'bg-gray-900' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            Batal
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition-all flex items-center gap-2">
            {saving
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
              : <><Check size={15} /> {isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Modal ──────────────────────────── */
function DeleteModal({ product, onClose, onConfirm }: {
  product: Product; onClose: () => void; onConfirm: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const handleConfirm = async () => { setDeleting(true); await onConfirm(); setDeleting(false); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Hapus Produk?</h3>
        <p className="text-sm text-gray-500 mt-1.5">
          <span className="font-semibold text-gray-700">"{product.name}"</span> akan dihapus permanen.
        </p>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
            Batal
          </button>
          <button onClick={handleConfirm} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {deleting
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Trash2 size={14} />}
            {deleting ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────── */
export default function DashboardProductsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [editProduct, setEditProduct] = useState<Product | null | undefined>(undefined);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const fetchData = async () => {
    try {
      // Fetch toko milik seller dulu
      const storeRes = await api.get('/stores/seller/mine');
      const storeData = storeRes.data.data ?? storeRes.data;
      setStore(storeData);

      // Fetch produk milik toko ini saja
      const productsRes = await api.get(`/products?storeId=${storeData.id}&limit=100`);
      const result = productsRes.data.data ?? productsRes.data;
      setProducts(Array.isArray(result) ? result : result.data ?? []);
    } catch (e: any) {
      // Seller belum punya toko → redirect ke buka toko
      if (e?.response?.status === 404) {
        router.push('/stores/create');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'seller' && user.role !== 'admin') { router.push('/'); return; }
    fetchData();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteProduct) return;
    await api.delete(`/products/${deleteProduct.id}`);
    setDeleteProduct(null);
    fetchData();
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterActive === 'all' || (filterActive === 'active' ? p.isActive : !p.isActive);
    return matchSearch && matchFilter;
  });

  const activeCount = products.filter(p => p.isActive).length;
  const totalRevenue = products.reduce((s, p) => s + p.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard Seller</h1>
            <p className="text-xs text-gray-400 mt-0.5">Kelola produk & toko kamu</p>
          </div>
          <button onClick={() => setEditProduct(null)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all shadow-sm active:scale-95">
            <Plus size={16} /> Tambah Produk
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Store Banner */}
        {store && <StoreBanner store={store} />}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Package size={18} />} label="Total Produk"
            value={String(products.length)} sub={`${activeCount} aktif`} accent="bg-blue-500" />
          <StatCard icon={<Eye size={18} />} label="Produk Aktif"
            value={String(activeCount)} sub="tampil di marketplace" accent="bg-emerald-500" />
          <StatCard icon={<DollarSign size={18} />} label="Total Nilai"
            value={fmt(totalRevenue)} sub="nilai semua produk" accent="bg-violet-500" />
          <StatCard icon={<BarChart2 size={18} />} label="Tidak Aktif"
            value={String(products.length - activeCount)} sub="tersembunyi" accent="bg-amber-500" />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/seller/tier', icon: <Star size={16} className="text-amber-600" />, label: 'Tier & Progress', bg: 'bg-amber-50' },
            { href: `/stores/${store?.slug}`, icon: <Eye size={16} className="text-blue-600" />, label: 'Lihat Toko', bg: 'bg-blue-50' },
            { href: '/orders', icon: <Package size={16} className="text-violet-600" />, label: 'Pesanan', bg: 'bg-violet-50' },
            { href: '/seller', icon: <StoreIcon size={16} className="text-violet-600" />, label: 'Seller Centre', bg: 'bg-violet-50' },
            { href: '/profile', icon: <Settings size={16} className="text-gray-600" />, label: 'Pengaturan', bg: 'bg-gray-100' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-all">
              <div className={`w-8 h-8 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {item.icon}
              </div>
              <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              <ChevronRight size={14} className="text-gray-300 ml-auto" />
            </Link>
          ))}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-6 py-4 border-b border-gray-50">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari produk..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors" />
            </div>
            <div className="flex items-center gap-2">
              {(['all', 'active', 'inactive'] as const).map(f => (
                <button key={f} onClick={() => setFilterActive(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterActive === f ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
                    }`}>
                  {f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : 'Nonaktif'}
                </button>
              ))}
            </div>
            <span className="ml-auto text-xs text-gray-400 hidden sm:block">{filtered.length} produk</span>
          </div>

          {/* Table Body */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-600">
                {search ? `Tidak ada produk "${search}"` : 'Belum ada produk'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {search ? 'Coba kata kunci lain' : "Klik 'Tambah Produk' untuk mulai"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Produk</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Harga</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tipe</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Foto</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Dibuat</th>
                    <th className="py-3 pl-3 pr-6" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <ProductRow key={p.id} product={p}
                      onEdit={setEditProduct} onDelete={setDeleteProduct} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-50">
              <p className="text-xs text-gray-400">
                Menampilkan <span className="font-semibold text-gray-600">{filtered.length}</span> dari{' '}
                <span className="font-semibold text-gray-600">{products.length}</span> produk
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {editProduct !== undefined && (
        <ProductModal product={editProduct} onClose={() => setEditProduct(undefined)}
          onSave={() => { setEditProduct(undefined); fetchData(); }} />
      )}
      {deleteProduct && (
        <DeleteModal product={deleteProduct} onClose={() => setDeleteProduct(null)}
          onConfirm={handleDelete} />
      )}
    </div>
  );
}