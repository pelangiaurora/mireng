'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { Eye, EyeOff, ArrowRight, Store, ShieldCheck, Zap, Globe } from 'lucide-react';

/* ─── Feature Badge ─────────────────────────── */
function FeatureBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-white/70 text-sm">
      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      {text}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Email wajib diisi'); return; }
    if (!password) { setError('Password wajib diisi'); return; }
    setError('');
    try {
      await login(email, password);
      const redirect = searchParams.get('redirect');
      router.push(redirect || '/');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel — Brand ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-950 flex-col justify-between p-12">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 text-white font-bold text-xl">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Store size={18} />
            </div>
            Mireng
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold text-white/80 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Marketplace Digital #1
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
              Selamat datang<br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                kembali! 👋
              </span>
            </h1>
            <p className="text-white/50 mt-4 text-base leading-relaxed max-w-sm">
              Masuk ke akun kamu dan mulai jual beli produk digital dengan mudah dan aman.
            </p>
          </div>

          <div className="space-y-3">
            <FeatureBadge icon={<ShieldCheck size={14} />} text="Transaksi aman & terenkripsi" />
            <FeatureBadge icon={<Zap size={14} />} text="Pengiriman produk digital instan" />
            <FeatureBadge icon={<Globe size={14} />} text="Ribuan produk dari seller terpercaya" />
          </div>
        </div>

        {/* Bottom testimonial */}
        <div className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
          <div className="flex gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-amber-400 text-sm">★</span>)}
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            "Mireng adalah marketplace terbaik yang pernah saya gunakan. Produknya lengkap dan transaksinya sangat cepat!"
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Ahlam Aurora</p>
              <p className="text-white/40 text-xs">Verified Seller</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 font-bold text-xl text-gray-900 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            Mireng
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900">Masuk</h2>
            <p className="text-gray-400 text-sm mt-1.5">
              Belum punya akun?{' '}
              <Link href="/register" className="text-gray-900 font-semibold hover:underline underline-offset-2">
                Daftar gratis
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3.5 rounded-2xl mb-6">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-500 font-bold text-xs">!</div>
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className={`relative rounded-2xl border-2 transition-all duration-200 bg-white ${focused === 'email' ? 'border-gray-900 shadow-lg shadow-gray-900/5' : 'border-gray-100'
                }`}>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent px-5 py-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <button type="button" className="text-xs text-gray-400 hover:text-gray-900 transition-colors font-medium">
                  Lupa password?
                </button>
              </div>
              <div className={`relative rounded-2xl border-2 transition-all duration-200 bg-white ${focused === 'password' ? 'border-gray-900 shadow-lg shadow-gray-900/5' : 'border-gray-100'
                }`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit(e as any)}
                  className="w-full bg-transparent px-5 py-4 pr-12 text-sm text-gray-900 placeholder-gray-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="relative w-full overflow-hidden rounded-2xl bg-gray-900 py-4 text-sm font-bold text-white transition-all hover:bg-gray-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group mt-2"
            >
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk ke Akun
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300 font-medium">atau</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Demo login */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Demo Akun</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Seller', email: 'seller2@mireng.com', pass: '123456' },
                { label: 'Admin', email: 'admin@mireng.com', pass: '123456' },
              ].map(acc => (
                <button
                  key={acc.label}
                  onClick={() => { setEmail(acc.email); setPassword(acc.pass); setError(''); }}
                  className="flex flex-col items-start p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all text-left group"
                >
                  <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900">{acc.label}</span>
                  <span className="text-xs text-gray-400 truncate w-full mt-0.5">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-300 mt-8">
            Dengan masuk, kamu menyetujui{' '}
            <span className="text-gray-500 font-medium cursor-pointer hover:text-gray-900 transition-colors">Syarat & Ketentuan</span>
            {' '}dan{' '}
            <span className="text-gray-500 font-medium cursor-pointer hover:text-gray-900 transition-colors">Kebijakan Privasi</span>
          </p>
        </div>
      </div>
    </div>
  );
}
