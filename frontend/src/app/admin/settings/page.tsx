'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import type { PlatformSetting } from '@/types/store';
import {
  ArrowLeft, Settings, Save, RefreshCw,
  AlertTriangle, CheckCircle, ToggleLeft, ToggleRight,
} from 'lucide-react';

/* ─── Setting Row ───────────────────────────── */
function SettingRow({ setting, onSave }: {
  setting: PlatformSetting;
  onSave: (key: string, value: string) => Promise<void>;
}) {
  const [value, setValue] = useState(setting.value);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isDirty = value !== setting.value;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(setting.key, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  // Boolean toggle
  if (setting.dataType === 'boolean') {
    const isTrue = value === 'true';
    return (
      <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{setting.key}</p>
          {setting.description && (
            <p className="text-xs text-gray-400 mt-0.5">{setting.description}</p>
          )}
        </div>
        <button
          onClick={() => {
            const newVal = isTrue ? 'false' : 'true';
            setValue(newVal);
            onSave(setting.key, newVal);
          }}
          className="flex items-center gap-2 ml-4"
        >
          {isTrue
            ? <ToggleRight size={32} className="text-emerald-500" />
            : <ToggleLeft size={32} className="text-gray-300" />
          }
        </button>
      </div>
    );
  }

  // Number / string input
  return (
    <div className="py-4 border-b border-gray-50 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">{setting.key}</p>
          {setting.description && (
            <p className="text-xs text-gray-400 mt-0.5">{setting.description}</p>
          )}
        </div>
        {saved && <CheckCircle size={16} className="text-emerald-500" />}
      </div>
      <div className="flex gap-2">
        <input
          type={setting.dataType === 'number' ? 'number' : 'text'}
          value={value}
          onChange={e => setValue(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-900 transition-all"
        />
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-700 disabled:opacity-40 transition-all"
        >
          {saving
            ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Save size={13} />}
          Simpan
        </button>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────── */
export default function AdminSettingsPage() {
  const { user, initialized } = useAuthStore();
  const router = useRouter();
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/platform-settings');
      const data = res.data.data ?? [];
      setSettings(Array.isArray(data) ? data : []);
    } catch {
      setError('Gagal memuat settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, value: string) => {
    await api.patch(`/admin/platform-settings/${key}`, { value });
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  useEffect(() => {
    if (!initialized) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }
    fetchSettings();
  }, [user, initialized]);

  // Group settings by prefix
  const groups: Record<string, PlatformSetting[]> = {};
  settings.forEach(s => {
    const prefix = s.key.startsWith('commission') ? 'Komisi'
      : s.key.startsWith('tier') ? 'Kriteria Tier'
      : s.key.startsWith('max_products') ? 'Limit Produk'
      : s.key.startsWith('seller') ? 'Pendaftaran Seller'
      : 'Umum';
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(s);
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">Platform Settings</h1>
            <p className="text-xs text-gray-400">{settings.length} pengaturan</p>
          </div>
          <button onClick={fetchSettings} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <RefreshCw size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 rounded-xl px-4 py-3 text-sm text-red-600">
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : (
          Object.entries(groups).map(([group, items]) => (
            <div key={group} className="bg-white rounded-2xl border border-gray-100 px-5">
              <div className="flex items-center gap-2 py-4 border-b border-gray-50">
                <Settings size={14} className="text-gray-400" />
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{group}</h3>
              </div>
              {items.map(setting => (
                <SettingRow key={setting.key} setting={setting} onSave={handleSave} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}