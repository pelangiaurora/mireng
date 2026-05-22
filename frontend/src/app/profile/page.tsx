'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import {
  User, MapPin, Shield, Store, Camera, Plus, Edit2,
  Trash2, Check, X, Star, ChevronRight, Eye, EyeOff,
  Phone, Mail, Calendar, Users, AlertTriangle, Home,
  Briefcase, Navigation,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────── */
interface Address {
  id: string; label: string; recipientName: string;
  phone: string; address: string; city: string;
  province: string; district?: string; postalCode: string;
  isDefault: boolean;
}

/* ─── Tab Button ────────────────────────────── */
function TabBtn({ id, active, icon, label, onClick }: any) {
  return (
    <button onClick={() => onClick(id)}
      className={`flex items-center gap-2.5 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${active ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }`}>
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

/* ─── Input Field ───────────────────────────── */
function Field({ label, value, onChange, type = 'text', placeholder, disabled }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition-all disabled:bg-gray-50 disabled:text-gray-400" />
    </div>
  );
}

/* ─── Section: Profil ───────────────────────── */
function ProfileSection({ user, onRefresh }: { user: any; onRefresh: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', bio: '', gender: '', dateOfBirth: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) setForm({
      name: user.name ?? '',
      phone: user.phone ?? '',
      bio: user.bio ?? '',
      gender: user.gender ?? '',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
    });
  }, [user]);

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try {
      await api.patch('/users/me', form);
      setMsg('✅ Profil berhasil disimpan');
      onRefresh();
    } catch (e: any) {
      setMsg('❌ ' + (e?.response?.data?.message || 'Gagal menyimpan'));
    } finally { setSaving(false); setTimeout(() => setMsg(''), 3000); }
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      await api.patch('/users/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onRefresh();
    } catch { } finally { setUploadingAvatar(false); }
  };

  const initial = (user?.email ?? 'U').charAt(0).toUpperCase();
  const avatarUrl = user?.avatar ? `http://localhost:3000${user.avatar}` : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Informasi Pribadi</h2>
        <p className="text-sm text-gray-400 mt-0.5">Kelola informasi profil kamu</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white text-2xl font-black overflow-hidden">
            {avatarUrl ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : initial}
          </div>
          <button onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
            <Camera size={13} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{user?.name || user?.email}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
          <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${user?.role === 'seller' ? 'bg-violet-50 text-violet-700' :
              user?.role === 'admin' ? 'bg-rose-50 text-rose-700' : 'bg-sky-50 text-sky-700'
            }`}>
            <Star size={10} /> {user?.role}
          </span>
        </div>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {msg}
        </div>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nama Lengkap" value={form.name} onChange={(v: string) => setForm(p => ({ ...p, name: v }))} placeholder="Nama kamu" />
        <Field label="Email" value={user?.email} onChange={() => { }} disabled placeholder="Email" />
        <Field label="No. HP" value={form.phone} onChange={(v: string) => setForm(p => ({ ...p, phone: v }))} placeholder="08xxxxxxxxxx" />
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Gender</label>
          <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-all">
            <option value="">Pilih gender</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
            <option value="other">Lainnya</option>
          </select>
        </div>
        <Field label="Tanggal Lahir" type="date" value={form.dateOfBirth} onChange={(v: string) => setForm(p => ({ ...p, dateOfBirth: v }))} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
        <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
          placeholder="Ceritakan sedikit tentang dirimu..." rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-all resize-none" />
      </div>

      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 disabled:opacity-50 transition-all">
        {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </div>
  );
}

/* ─── Section: Alamat ───────────────────────── */
function AddressSection() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const emptyForm = { label: 'Rumah', recipientName: '', phone: '', address: '', city: '', province: '', district: '', postalCode: '', isDefault: false };
  const [form, setForm] = useState(emptyForm);

  const fetchAddresses = () => {
    api.get('/addresses').then(res => setAddresses(res.data.data ?? res.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { fetchAddresses(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editId) await api.patch(`/addresses/${editId}`, form);
      else await api.post('/addresses', form);
      setShowForm(false); setEditId(null); setForm(emptyForm);
      fetchAddresses();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Gagal menyimpan alamat');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus alamat ini?')) return;
    setDeletingId(id);
    try { await api.delete(`/addresses/${id}`); fetchAddresses(); }
    catch { } finally { setDeletingId(null); }
  };

  const handleSetDefault = async (id: string) => {
    await api.patch(`/addresses/${id}/set-default`);
    fetchAddresses();
  };

  const handleEdit = (addr: Address) => {
    setEditId(addr.id);
    setForm({ label: addr.label, recipientName: addr.recipientName, phone: addr.phone, address: addr.address, city: addr.city, province: addr.province, district: addr.district ?? '', postalCode: addr.postalCode, isDefault: addr.isDefault });
    setShowForm(true);
  };

  const labelIcons: Record<string, React.ReactNode> = {
    'Rumah': <Home size={14} />, 'Kantor': <Briefcase size={14} />,
  };

  if (loading) return <div className="animate-pulse space-y-3">{[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl" />)}</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Alamat Saya</h2>
          <p className="text-sm text-gray-400 mt-0.5">{addresses.length} alamat tersimpan</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all">
          <Plus size={16} /> Tambah Alamat
        </button>
      </div>

      {/* Form Tambah/Edit */}
      {showForm && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">{editId ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h3>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Label</label>
              <select value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 bg-white">
                {['Rumah', 'Kantor', 'Kos', 'Lainnya'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <Field label="Nama Penerima" value={form.recipientName} onChange={(v: string) => setForm(p => ({ ...p, recipientName: v }))} placeholder="Nama lengkap" />
          </div>
          <Field label="No. HP Penerima" value={form.phone} onChange={(v: string) => setForm(p => ({ ...p, phone: v }))} placeholder="08xxxxxxxxxx" />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Alamat Lengkap</label>
            <textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
              placeholder="Jl. Nama Jalan No. XX, RT/RW, Kelurahan..." rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 resize-none bg-white" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kota" value={form.city} onChange={(v: string) => setForm(p => ({ ...p, city: v }))} placeholder="Surabaya" />
            <Field label="Provinsi" value={form.province} onChange={(v: string) => setForm(p => ({ ...p, province: v }))} placeholder="Jawa Timur" />
            <Field label="Kecamatan" value={form.district} onChange={(v: string) => setForm(p => ({ ...p, district: v }))} placeholder="Sukolilo" />
            <Field label="Kode Pos" value={form.postalCode} onChange={(v: string) => setForm(p => ({ ...p, postalCode: v }))} placeholder="60111" />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={e => setForm(p => ({ ...p, isDefault: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300" />
            <span className="text-sm text-gray-700">Jadikan alamat utama</span>
          </label>
          <div className="flex gap-3">
            <button onClick={() => { setShowForm(false); setEditId(null); }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Batal</button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 disabled:opacity-50">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={15} />}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      )}

      {/* List Alamat */}
      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500">Belum ada alamat</p>
          <p className="text-xs text-gray-400 mt-1">Tambahkan alamat pengiriman kamu</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr.id} className={`bg-white rounded-2xl border-2 p-4 transition-all ${addr.isDefault ? 'border-gray-900' : 'border-gray-100 hover:border-gray-200'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                      {labelIcons[addr.label] ?? <Navigation size={14} />} {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-xs font-bold text-gray-900 bg-gray-900/10 px-2.5 py-1 rounded-full">Utama</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mt-2">{addr.recipientName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{addr.phone}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{addr.address}, {addr.district && `${addr.district}, `}{addr.city}, {addr.province} {addr.postalCode}</p>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => handleEdit(addr)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"><Edit2 size={15} /></button>
                  <button onClick={() => handleDelete(addr.id)} disabled={deletingId === addr.id}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"><Trash2 size={15} /></button>
                </div>
              </div>
              {!addr.isDefault && (
                <button onClick={() => handleSetDefault(addr.id)}
                  className="mt-3 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors underline-offset-2 hover:underline">
                  Jadikan alamat utama
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Section: Keamanan ─────────────────────── */
function SecuritySection() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async () => {
    if (form.newPassword.length < 6) { setMsg('❌ Password minimal 6 karakter'); return; }
    if (form.newPassword !== form.confirmPassword) { setMsg('❌ Konfirmasi password tidak cocok'); return; }
    setSaving(true); setMsg('');
    try {
      await api.patch('/users/me/password', form);
      setMsg('✅ Password berhasil diubah');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e: any) {
      setMsg('❌ ' + (e?.response?.data?.message || 'Gagal mengubah password'));
    } finally { setSaving(false); setTimeout(() => setMsg(''), 4000); }
  };

  const PasswordInput = ({ label, field, showKey }: any) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <input type={show[showKey as keyof typeof show] ? 'text' : 'password'} value={form[field as keyof typeof form]}
          onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-gray-900 transition-all" />
        <button type="button" onClick={() => setShow(p => ({ ...p, [showKey]: !p[showKey as keyof typeof show] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show[showKey as keyof typeof show] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Keamanan Akun</h2>
        <p className="text-sm text-gray-400 mt-0.5">Kelola keamanan akun kamu</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2"><Shield size={16} /> Ubah Password</h3>
        {msg && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>{msg}</div>
        )}
        <PasswordInput label="Password Lama" field="currentPassword" showKey="current" />
        <PasswordInput label="Password Baru" field="newPassword" showKey="new" />
        <PasswordInput label="Konfirmasi Password Baru" field="confirmPassword" showKey="confirm" />
        {form.newPassword && form.confirmPassword && (
          <p className={`text-xs font-medium ${form.newPassword === form.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
            {form.newPassword === form.confirmPassword ? '✓ Password cocok' : '✗ Password tidak cocok'}
          </p>
        )}
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 disabled:opacity-50 transition-all">
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Shield size={16} />}
          {saving ? 'Menyimpan...' : 'Ubah Password'}
        </button>
      </div>
    </div>
  );
}

/* ─── Section: Akun & Seller ────────────────── */
function AccountSection({ user, onRefresh }: { user: any; onRefresh: () => void }) {
  const { logout } = useAuthStore();
  const router = useRouter();
  const [upgrading, setUpgrading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleUpgrade = async () => {
    if (!confirm('Upgrade akun kamu menjadi seller? Kamu tetap bisa berbelanja sebagai buyer.')) return;
    setUpgrading(true);
    try {
      await api.patch('/users/me/upgrade-seller');
      setMsg('✅ Selamat! Akun kamu berhasil diupgrade ke Seller. Silakan buka toko.');
      onRefresh();
      setTimeout(() => router.push('/stores/create'), 2000);
    } catch (e: any) {
      setMsg('❌ ' + (e?.response?.data?.message || 'Gagal upgrade akun'));
    } finally { setUpgrading(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Akun & Seller</h2>
        <p className="text-sm text-gray-400 mt-0.5">Kelola akun dan status seller kamu</p>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>{msg}</div>
      )}

      {/* Status Akun */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <h3 className="text-sm font-bold text-gray-800">Status Akun</h3>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-semibold text-gray-900">Role saat ini</p>
            <p className="text-xs text-gray-400">Hak akses yang kamu miliki</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${user?.role === 'seller' ? 'bg-violet-100 text-violet-700' :
              user?.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'
            }`}>{user?.role?.toUpperCase()}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-gray-50">
          <div>
            <p className="text-sm font-semibold text-gray-900">Status verifikasi</p>
            <p className="text-xs text-gray-400">KYC & identitas</p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
            {user?.kycStatus ?? 'Belum Verifikasi'}
          </span>
        </div>
      </div>

      {/* Upgrade ke Seller */}
      {user?.role === 'buyer' && (
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border border-violet-100 p-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Store size={20} className="text-violet-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900">Mulai Berjualan</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Upgrade akun kamu menjadi seller dan buka toko sendiri. Jual produk fisik maupun digital ke ribuan pembeli.
              </p>
              <ul className="mt-3 space-y-1.5">
                {['Buka toko gratis', 'Jual produk fisik & digital', 'Terima pembayaran langsung', 'Dashboard penjualan lengkap'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <Check size={12} className="text-violet-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={handleUpgrade} disabled={upgrading}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 transition-all">
                {upgrading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Store size={16} />}
                {upgrading ? 'Memproses...' : 'Upgrade ke Seller — Gratis'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sudah seller */}
      {user?.role === 'seller' && (
        <div className="bg-violet-50 rounded-2xl border border-violet-100 p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Store size={20} className="text-violet-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">Kamu adalah Seller ✓</p>
            <p className="text-xs text-gray-500 mt-0.5">Kelola toko dan produkmu di dashboard seller</p>
          </div>
          <Link href="/dashboard/products" className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-800">
            Dashboard <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────── */
export default function ProfilePage() {
  const { user, fetchProfile } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [fullUser, setFullUser] = useState<any>(null);

  const fetchFullProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setFullUser(res.data.data ?? res.data);
    } catch { }
  };

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchFullProfile();
  }, [user]);

  const tabs = [
    { id: 'profile', icon: <User size={18} />, label: 'Profil Saya' },
    { id: 'addresses', icon: <MapPin size={18} />, label: 'Alamat Saya' },
    { id: 'security', icon: <Shield size={18} />, label: 'Keamanan' },
    { id: 'account', icon: <Store size={18} />, label: 'Akun & Seller' },
  ];

  const handleRefresh = () => { fetchFullProfile(); fetchProfile(); };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Akun Saya</h1>
          <p className="text-xs text-gray-400 mt-0.5">Kelola profil, alamat, dan pengaturan akun</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-16 md:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-2 space-y-1 sticky top-24">
              {tabs.map(tab => (
                <TabBtn key={tab.id} id={tab.id} active={activeTab === tab.id}
                  icon={tab.icon} label={tab.label} onClick={setActiveTab} />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              {activeTab === 'profile' && <ProfileSection user={fullUser ?? user} onRefresh={handleRefresh} />}
              {activeTab === 'addresses' && <AddressSection />}
              {activeTab === 'security' && <SecuritySection />}
              {activeTab === 'account' && <AccountSection user={fullUser ?? user} onRefresh={handleRefresh} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
