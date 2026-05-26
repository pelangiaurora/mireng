'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import type { SellerType, StoreType } from '@/types/store';
import {
  Store, MapPin, Phone, FileText, Check, ArrowRight,
  ArrowLeft, Sparkles, Shield, Zap, Star, Package,
  AlertTriangle, ShoppingBag, Monitor,
} from 'lucide-react';

/* ─── Step Indicator ────────────────────────── */
function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            i + 1 < step ? 'bg-gray-900 text-white' :
            i + 1 === step ? 'bg-gray-900 text-white ring-4 ring-gray-900/20' :
            'bg-gray-100 text-gray-400'
          }`}>
            {i + 1 < step ? <Check size={14} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`w-10 h-0.5 transition-all ${i + 1 < step ? 'bg-gray-900' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Field ─────────────────────────────────── */
function Field({ label, value, onChange, placeholder, required, type = 'text' }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition-all"
      />
    </div>
  );
}

/* ─── Step 1: Upgrade ke Seller ─────────────── */
function StepUpgrade({ onNext, loading, setLoading }: any) {
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await api.patch('/users/me/upgrade-seller');
      onNext();
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      if (msg?.includes('sudah menjadi seller')) {
        onNext();
      } else {
        setError(msg || 'Gagal upgrade akun');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Store size={36} className="text-violet-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Mulai Berjualan</h2>
        <p className="text-gray-400 text-sm mt-2">Upgrade akun kamu dan buka toko pertamamu di Mireng</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
          <AlertTriangle size={15} className="flex-shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: <Package size={18} className="text-violet-600" />, title: 'Jual Produk Fisik', desc: 'Pakaian, elektronik, aksesoris' },
          { icon: <Zap size={18} className="text-blue-600" />, title: 'Jual Produk Digital', desc: 'Akun, file, lisensi, template' },
          { icon: <Shield size={18} className="text-emerald-600" />, title: 'Transaksi Aman', desc: 'Dilindungi sistem escrow' },
          { icon: <Star size={18} className="text-amber-600" />, title: 'Dashboard Lengkap', desc: 'Statistik, pesanan, keuangan' },
        ].map(item => (
          <div key={item.title} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="mb-2">{item.icon}</div>
            <p className="text-sm font-semibold text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-700 disabled:opacity-50 transition-all"
      >
        {loading
          ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
          : <><Sparkles size={18} /> Upgrade ke Seller — Gratis</>}
      </button>
    </div>
  );
}

/* ─── Step 2: Pilih Tipe Seller ─────────────── */
function StepSellerType({ sellerType, setSellerType, onNext, onBack }: any) {
  const [error, setError] = useState('');

  const options: { value: SellerType; icon: any; title: string; desc: string; items: string[] }[] = [
    {
      value: 'physical',
      icon: <ShoppingBag size={28} className="text-violet-600" />,
      title: 'Toko Fisik',
      desc: 'Jual produk yang dikirim ke pembeli',
      items: ['Pakaian & Fashion', 'Elektronik & Gadget', 'Makanan & Minuman', 'Semua produk fisik'],
    },
    {
      value: 'digital',
      icon: <Monitor size={28} className="text-blue-600" />,
      title: 'Toko Digital',
      desc: 'Jual produk yang dikirim secara digital',
      items: ['Akun Premium', 'Software & Lisensi', 'Template & Desain', 'Ebook & Kursus'],
    },
  ];

  const handleNext = () => {
    if (!sellerType) { setError('Pilih tipe toko terlebih dahulu'); return; }
    setError('');
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Tipe Toko</h2>
        <p className="text-gray-400 text-sm mt-1">Pilih tipe toko yang sesuai. <strong>Tidak bisa diubah setelah dibuat.</strong></p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
          <AlertTriangle size={15} className="flex-shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-3">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => setSellerType(opt.value)}
            className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
              sellerType === opt.value
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                opt.value === 'physical' ? 'bg-violet-50' : 'bg-blue-50'
              }`}>
                {opt.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900">{opt.title}</p>
                  {sellerType === opt.value && (
                    <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {opt.items.map(item => (
                    <span key={item} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
          <ArrowLeft size={16} /> Kembali
        </button>
        <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-all">
          Lanjut <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 3: Pilih Tipe Toko ───────────────── */
function StepStoreType({ sellerType, storeType, setStoreType, onNext, onBack }: any) {
  const [error, setError] = useState('');

  const physicalOptions: { value: StoreType; title: string; desc: string; docs: string }[] = [
    { value: 'personal', title: 'Perorangan', desc: 'Penjual individu', docs: 'KTP + Foto Selfie' },
    { value: 'umkm', title: 'UMKM', desc: 'CV, UD, Firma, Koperasi', docs: 'KTP + NIB/SIUP + Akta' },
    { value: 'official', title: 'Official Store', desc: 'PT, Tbk, Brand resmi', docs: 'NPWP + SIUP + Akta PT' },
  ];

  const handleNext = () => {
    if (!storeType) { setError('Pilih tipe akun penjual terlebih dahulu'); return; }
    setError('');
    onNext();
  };

  if (sellerType === 'digital') {
    // Digital hanya ada 1 tipe: personal
    if (storeType !== 'personal') setStoreType('personal');
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-gray-900">Tipe Akun Penjual</h2>
          <p className="text-gray-400 text-sm mt-1">Untuk toko digital, semua penjual menggunakan tipe Perorangan.</p>
        </div>
        <div className="p-5 rounded-2xl border-2 border-gray-900 bg-gray-50">
          <div className="flex items-center gap-3">
            <Monitor size={24} className="text-blue-600" />
            <div>
              <p className="font-bold text-gray-900">Perorangan Digital</p>
              <p className="text-xs text-gray-400 mt-0.5">Email terverifikasi + KTP</p>
            </div>
            <div className="ml-auto w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
              <Check size={12} className="text-white" />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            <ArrowLeft size={16} /> Kembali
          </button>
          <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-all">
            Lanjut <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Tipe Akun Penjual</h2>
        <p className="text-gray-400 text-sm mt-1">Pilih sesuai status usaha kamu.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
          <AlertTriangle size={15} className="flex-shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-3">
        {physicalOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setStoreType(opt.value)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
              storeType === opt.value ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 text-sm">{opt.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                <p className="text-xs text-gray-500 mt-1">📄 {opt.docs}</p>
              </div>
              {storeType === opt.value && (
                <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
          <ArrowLeft size={16} /> Kembali
        </button>
        <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-all">
          Lanjut <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 4: Info Toko ─────────────────────── */
function StepStoreInfo({ form, setForm, onNext, onBack, loading }: any) {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!form.name?.trim()) { setError('Nama toko wajib diisi'); return; }
    if (form.name.length < 3) { setError('Nama toko minimal 3 karakter'); return; }
    setError('');
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Informasi Toko</h2>
        <p className="text-gray-400 text-sm mt-1">Isi detail toko kamu. Bisa diubah nanti.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
          <AlertTriangle size={15} className="flex-shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-4">
        <Field label="Nama Toko" required value={form.name}
          onChange={(v: string) => setForm((p: any) => ({ ...p, name: v }))}
          placeholder="cth. Toko Serbaguna Aurora"
        />
        {form.name && (
          <p className="text-xs text-gray-400 -mt-2 pl-1">
            URL: <span className="font-mono text-gray-600">mireng.com/stores/{form.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}</span>
          </p>
        )}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Deskripsi Toko</label>
          <textarea
            value={form.description ?? ''}
            onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))}
            placeholder="Ceritakan tentang toko kamu..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-all resize-none"
          />
        </div>
        <Field label="No. HP Toko" value={form.phone}
          onChange={(v: string) => setForm((p: any) => ({ ...p, phone: v }))}
          placeholder="08xxxxxxxxxx"
        />
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
          <ArrowLeft size={16} /> Kembali
        </button>
        <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-all">
          Lanjut <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 5: Lokasi ────────────────────────── */
function StepLocation({ form, setForm, sellerType, onNext, onBack }: any) {
  if (sellerType === 'digital') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-gray-900">Lokasi Toko</h2>
          <p className="text-gray-400 text-sm mt-1">Toko digital tidak memerlukan lokasi fisik. Langsung ke review!</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
          ℹ️ Produk digital dikirim otomatis ke pembeli setelah pembayaran berhasil.
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            <ArrowLeft size={16} /> Kembali
          </button>
          <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-all">
            Lanjut <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Lokasi Toko</h2>
        <p className="text-gray-400 text-sm mt-1">Digunakan untuk estimasi ongkos kirim ke pembeli.</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Kota" required value={form.city} onChange={(v: string) => setForm((p: any) => ({ ...p, city: v }))} placeholder="Surabaya" />
          <Field label="Provinsi" required value={form.province} onChange={(v: string) => setForm((p: any) => ({ ...p, province: v }))} placeholder="Jawa Timur" />
        </div>
        <Field label="Kecamatan" value={form.district} onChange={(v: string) => setForm((p: any) => ({ ...p, district: v }))} placeholder="Sukolilo" />
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Alamat Lengkap</label>
          <textarea
            value={form.address ?? ''}
            onChange={e => setForm((p: any) => ({ ...p, address: e.target.value }))}
            placeholder="Jl. Nama Jalan No. XX..."
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-all resize-none"
          />
        </div>
        <Field label="Kode Pos" value={form.postalCode} onChange={(v: string) => setForm((p: any) => ({ ...p, postalCode: v }))} placeholder="60111" />
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
          <ArrowLeft size={16} /> Kembali
        </button>
        <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-all">
          Lanjut <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 6: Review & Submit ───────────────── */
function StepReview({ form, sellerType, storeType, onBack, onSubmit, loading }: any) {
  const typeLabel: Record<string, string> = {
    physical: '🛍️ Toko Fisik', digital: '💻 Toko Digital',
    personal: 'Perorangan', umkm: 'UMKM', official: 'Official Store',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Review & Buka Toko</h2>
        <p className="text-gray-400 text-sm mt-1">Pastikan semua informasi sudah benar.</p>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <Store size={28} />
          </div>
          <div>
            <h3 className="text-lg font-black">{form.name || 'Nama Toko'}</h3>
            <p className="text-gray-400 text-xs mt-0.5">
              {form.city && form.province ? `${form.city}, ${form.province}` : 'Toko Digital'}
            </p>
          </div>
        </div>
        {form.description && <p className="text-gray-300 text-sm">{form.description}</p>}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
        {[
          { label: 'Nama Toko', value: form.name },
          { label: 'Tipe Seller', value: typeLabel[sellerType] || sellerType },
          { label: 'Tipe Toko', value: typeLabel[storeType] || storeType },
          { label: 'Kota', value: form.city || '-' },
          { label: 'Provinsi', value: form.province || '-' },
          { label: 'No. HP', value: form.phone || '-' },
        ].map(item => (
          <div key={item.label} className="flex justify-between px-4 py-3">
            <span className="text-xs text-gray-400">{item.label}</span>
            <span className="text-xs font-semibold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
        ⚠️ Tipe toko <strong>tidak bisa diubah</strong> setelah toko dibuat.
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
          <ArrowLeft size={16} /> Kembali
        </button>
        <button onClick={onSubmit} disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 disabled:opacity-50 transition-all">
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Membuat Toko...</>
            : <><Check size={16} /> Buka Toko Sekarang</>}
        </button>
      </div>
    </div>
  );
}

/* ─── Step 7: Sukses ────────────────────────── */
function StepSuccess({ storeName }: { storeName: string }) {
  const router = useRouter();
  return (
    <div className="text-center space-y-6 py-4">
      <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
        <Check size={44} className="text-white" strokeWidth={3} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-gray-900">Toko Berhasil Dibuka! 🎉</h2>
        <p className="text-gray-400 text-sm mt-2">
          Selamat! <span className="font-semibold text-gray-700">{storeName}</span> sudah aktif di Mireng.
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 text-left">
        <p className="font-semibold mb-1">📋 Langkah Selanjutnya</p>
        <p className="text-xs leading-relaxed">Lengkapi verifikasi toko kamu untuk mulai berjualan. Verifikasi diperlukan untuk memastikan keamanan transaksi.</p>
      </div>
      <div className="flex flex-col gap-3">
        <button onClick={() => router.push('/dashboard/products')}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-700 transition-all">
          <Package size={18} /> Ke Dashboard Seller
        </button>
        <button onClick={() => router.push('/')}
          className="w-full py-3 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────── */
export default function CreateStorePage() {
  const { user, fetchProfile, initialized } = useAuthStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [checkingStore, setCheckingStore] = useState(true);
  const [sellerType, setSellerType] = useState<SellerType | ''>('');
  const [storeType, setStoreType] = useState<StoreType | ''>('');
  const [form, setForm] = useState({
    name: '', description: '', phone: '',
    city: '', province: '', district: '',
    address: '', postalCode: '',
  });

  // Step 1=Upgrade, 2=SellerType, 3=StoreType, 4=Info, 5=Lokasi, 6=Review, 7=Sukses
  const isSeller = user?.role === 'seller' || user?.role === 'admin';
  const totalSteps = isSeller ? 5 : 6; // tanpa step upgrade

  useEffect(() => {
    if (!initialized) return;
    if (!user) { router.push('/login'); return; }

    api.get('/stores/seller/mine')
      .then(res => {
        const store = res.data.data ?? res.data;
        if (store?.id) router.push('/dashboard/products');
      })
      .catch(() => {
        if (isSeller) setStep(2);
      })
      .finally(() => setCheckingStore(false));
  }, [user, initialized]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        sellerType,
        storeType,
      };
      const res = await api.post('/stores', payload);
      const store = res.data.data ?? res.data;
      setStoreName(store.name ?? form.name);
      await fetchProfile();
      setStep(8); // sukses
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Gagal membuat toko');
    } finally {
      setLoading(false);
    }
  };

  if (checkingStore || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Memuat...</p>
        </div>
      </div>
    );
  }

  const isSuccess = step >= 8;
  const displayStep = isSeller ? step - 1 : step;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-gray-900">Buka Toko Baru</h1>
            <p className="text-xs text-gray-400">Mireng Marketplace</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
          {!isSuccess && <StepIndicator step={displayStep} total={totalSteps} />}

          {step === 1 && !isSeller && (
            <StepUpgrade loading={loading} setLoading={setLoading} onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <StepSellerType sellerType={sellerType} setSellerType={setSellerType}
              onNext={() => setStep(3)} onBack={() => isSeller ? null : setStep(1)} />
          )}
          {step === 3 && (
            <StepStoreType sellerType={sellerType} storeType={storeType} setStoreType={setStoreType}
              onNext={() => setStep(4)} onBack={() => setStep(2)} />
          )}
          {step === 4 && (
            <StepStoreInfo form={form} setForm={setForm} loading={loading}
              onNext={() => setStep(5)} onBack={() => setStep(3)} />
          )}
          {step === 5 && (
            <StepLocation form={form} setForm={setForm} sellerType={sellerType}
              onNext={() => setStep(6)} onBack={() => setStep(4)} />
          )}
          {step === 6 && (
            <StepReview form={form} sellerType={sellerType} storeType={storeType}
              onBack={() => setStep(5)} onSubmit={handleSubmit} loading={loading} />
          )}
          {isSuccess && <StepSuccess storeName={storeName} />}
        </div>
      </div>
    </div>
  );
}