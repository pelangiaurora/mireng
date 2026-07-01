'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Search, RefreshCw, Package, Truck, CheckCircle,
    Clock, XCircle, ChevronRight, X, AlertCircle,
    MapPin, Phone, User, Copy, Check, Eye,
    ArrowRight, FileText,
} from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge, OrderStatusBadge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Avatar } from '@/components/ui/avatar';
import { cn, formatPrice, formatNumber, formatRelativeTime } from '@/lib/utils';

/* ── Types ────────────────────────────────────────────────────── */
interface OrderItem {
    id: string | number;
    productId: string | number;
    name: string;
    image?: string;
    price: number | string;
    quantity: number;
    variant?: string;
}

interface ShippingAddress {
    recipientName: string;
    phone: string;
    fullAddress: string;
    district?: string;
    city: string;
    province: string;
    postalCode: string;
}

interface Order {
    id: string | number;
    orderNumber?: string;
    status: string;
    total: number | string;
    createdAt: string;
    updatedAt?: string;
    items: OrderItem[];
    buyer?: {
        id: string | number;
        name: string;
        email?: string;
        avatar?: string;
    };
    shipping?: {
        courier?: string;
        service?: string;
        trackingNumber?: string;
        cost: number | string;
        address: ShippingAddress;
    };
    note?: string;
    paymentMethod?: string;
}

/* ── Status Tabs ──────────────────────────────────────────────── */
const STATUS_TABS = [
    { key: 'all', label: 'Semua', icon: Package },
    { key: 'paid', label: 'Perlu Diproses', icon: Clock },
    { key: 'processing', label: 'Dikemas', icon: Package },
    { key: 'shipped', label: 'Dikirim', icon: Truck },
    { key: 'delivered', label: 'Selesai', icon: CheckCircle },
    { key: 'cancelled', label: 'Dibatalkan', icon: XCircle },
];

/* ── Copy Button ──────────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="p-1 rounded hover:bg-subtle transition-colors text-text-faint hover:text-text-muted"
            title="Salin"
        >
            {copied ? <Check size={12} className="text-success-500" /> : <Copy size={12} />}
        </button>
    );
}

/* ================================================================
   SHIP MODAL — Input nomor resi
   ================================================================ */
function ShipModal({
    order, onClose, onShipped,
}: {
    order: Order;
    onClose: () => void;
    onShipped: (orderId: string | number, tracking: string, courier: string) => void;
}) {
    const [courier, setCourier] = useState(order.shipping?.courier ?? '');
    const [tracking, setTracking] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const COURIERS = ['JNE', 'J&T Express', 'SiCepat', 'Anteraja', 'POS Indonesia', 'Ninja Express', 'Wahana', 'Tiki', 'GoSend', 'GrabExpress'];

    const handleSubmit = async () => {
        if (!courier.trim()) { setError('Pilih kurir pengiriman.'); return; }
        if (!tracking.trim()) { setError('Nomor resi tidak boleh kosong.'); return; }
        setLoading(true); setError('');
        try {
            await api.patch(`/dashboard/orders/${order.id}/ship`, {
                courier, trackingNumber: tracking,
            });
            onShipped(order.id, tracking, courier);
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'Gagal memperbarui pesanan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-surface w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl animate-slide-down">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div>
                        <h3 className="text-[15px] font-medium text-text">Kirim Pesanan</h3>
                        <p className="text-[12px] text-text-muted mt-0.5">
                            #{order.orderNumber ?? String(order.id).padStart(6, '0')}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-subtle text-text-muted">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Alamat tujuan */}
                    {order.shipping?.address && (
                        <div className="p-3.5 bg-subtle rounded-xl border border-border-subtle text-[13px]">
                            <div className="flex items-center gap-1.5 text-text-muted mb-2">
                                <MapPin size={13} className="text-brand-500" />
                                <span className="font-medium">Alamat Pengiriman</span>
                            </div>
                            <p className="text-text font-medium">{order.shipping.address.recipientName}</p>
                            <p className="text-text-muted text-[12px] mt-0.5">{order.shipping.address.phone}</p>
                            <p className="text-text-muted text-[12px] mt-0.5 leading-relaxed">
                                {order.shipping.address.fullAddress}
                                {order.shipping.address.district && `, ${order.shipping.address.district}`},
                                {' '}{order.shipping.address.city}, {order.shipping.address.province} {order.shipping.address.postalCode}
                            </p>
                        </div>
                    )}

                    {/* Kurir */}
                    <div>
                        <label className="block text-[13px] font-medium text-text mb-1.5">
                            Kurir Pengiriman <span className="text-danger-500">*</span>
                        </label>
                        <select
                            value={courier}
                            onChange={e => setCourier(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-[14px] border border-border rounded-lg bg-surface text-text focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        >
                            <option value="">— Pilih Kurir —</option>
                            {COURIERS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Nomor Resi */}
                    <Input
                        label="Nomor Resi / Tracking"
                        placeholder="Contoh: JNE123456789"
                        value={tracking}
                        onChange={e => setTracking(e.target.value.toUpperCase())}
                        hint="Nomor resi dari ekspedisi yang kamu pakai"
                        required
                    />

                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-50 border border-danger-200 text-[13px] text-danger-700">
                            <AlertCircle size={13} /> {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-5 pb-5">
                    <Button variant="outline" fullWidth onClick={onClose}>Batal</Button>
                    <Button fullWidth loading={loading} leftIcon={<Truck size={14} />} onClick={handleSubmit}>
                        Konfirmasi Kirim
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ================================================================
   ORDER DETAIL DRAWER — Slide dari kanan
   ================================================================ */
function OrderDrawer({ order, onClose, onProcess, onShip }: {
    order: Order;
    onClose: () => void;
    onProcess: (id: string | number) => void;
    onShip: (order: Order) => void;
}) {
    const subtotal = order.items.reduce((s, i) => s + (Number(i.price) || 0) * i.quantity, 0);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-neutral-900/40" onClick={onClose} />
            <div className="relative w-full max-w-md bg-surface shadow-xl flex flex-col animate-slide-down overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-surface z-10">
                    <div>
                        <h2 className="text-[15px] font-medium text-text">
                            #{order.orderNumber ?? String(order.id).padStart(6, '0')}
                        </h2>
                        <p className="text-[12px] text-text-faint mt-0.5">{formatRelativeTime(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <OrderStatusBadge status={order.status} />
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-subtle text-text-muted">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-5 space-y-5">

                    {/* Pembeli */}
                    {order.buyer && (
                        <div>
                            <p className="text-[11px] text-text-faint uppercase tracking-wider mb-2">Pembeli</p>
                            <div className="flex items-center gap-3 p-3.5 bg-subtle rounded-xl border border-border-subtle">
                                <Avatar name={order.buyer.name} src={order.buyer.avatar} size="sm" />
                                <div>
                                    <p className="text-[13px] font-medium text-text">{order.buyer.name}</p>
                                    {order.buyer.email && <p className="text-[11px] text-text-faint">{order.buyer.email}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Item produk */}
                    <div>
                        <p className="text-[11px] text-text-faint uppercase tracking-wider mb-2">
                            Produk ({order.items.length} item)
                        </p>
                        <div className="space-y-2">
                            {order.items.map(item => (
                                <div key={item.id} className="flex items-center gap-3 p-3 bg-subtle rounded-xl border border-border-subtle">
                                    <div className="w-10 h-10 rounded-lg bg-neutral-200 flex-shrink-0 overflow-hidden">
                                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] text-text line-clamp-1">{item.name}</p>
                                        {item.variant && <p className="text-[11px] text-text-faint">Varian: {item.variant}</p>}
                                        <p className="text-[12px] text-text-muted">{item.quantity}x {formatPrice(Number(item.price) || 0)}</p>
                                    </div>
                                    <p className="text-[13px] font-medium text-text flex-shrink-0">
                                        {formatPrice((Number(item.price) || 0) * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ringkasan harga */}
                    <div className="border border-border rounded-xl overflow-hidden">
                        <div className="px-4 py-3 bg-subtle border-b border-border-subtle">
                            <p className="text-[12px] font-medium text-text-muted uppercase tracking-wider">Ringkasan Pembayaran</p>
                        </div>
                        <div className="px-4 py-3 space-y-2">
                            <div className="flex justify-between text-[13px]">
                                <span className="text-text-muted">Subtotal produk</span>
                                <span className="text-text">{formatPrice(subtotal)}</span>
                            </div>
                            {order.shipping?.cost !== undefined && (
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-text-muted">Ongkos kirim</span>
                                    <span className="text-text">{formatPrice(Number(order.shipping.cost) || 0)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-[14px] font-medium pt-2 border-t border-border-subtle">
                                <span className="text-text">Total</span>
                                <span className="text-brand-600">{formatPrice(Number(order.total) || 0)}</span>
                            </div>
                            {order.paymentMethod && (
                                <p className="text-[11px] text-text-faint">Dibayar via: {order.paymentMethod}</p>
                            )}
                        </div>
                    </div>

                    {/* Alamat pengiriman */}
                    {order.shipping?.address && (
                        <div>
                            <p className="text-[11px] text-text-faint uppercase tracking-wider mb-2">Alamat Pengiriman</p>
                            <div className="p-3.5 bg-subtle rounded-xl border border-border-subtle space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-[13px] font-medium text-text">{order.shipping.address.recipientName}</p>
                                    <CopyButton text={`${order.shipping.address.recipientName}\n${order.shipping.address.phone}\n${order.shipping.address.fullAddress}, ${order.shipping.address.city}`} />
                                </div>
                                <p className="text-[12px] text-text-muted flex items-center gap-1">
                                    <Phone size={11} /> {order.shipping.address.phone}
                                </p>
                                <p className="text-[12px] text-text-muted leading-relaxed">
                                    {order.shipping.address.fullAddress}
                                    {order.shipping.address.district && `, ${order.shipping.address.district}`},
                                    {' '}{order.shipping.address.city}, {order.shipping.address.province} {order.shipping.address.postalCode}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Info resi (kalau sudah dikirim) */}
                    {order.shipping?.trackingNumber && (
                        <div>
                            <p className="text-[11px] text-text-faint uppercase tracking-wider mb-2">Info Pengiriman</p>
                            <div className="p-3.5 bg-success-50 rounded-xl border border-success-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <Truck size={14} className="text-success-600" />
                                    <span className="text-[13px] font-medium text-success-700">{order.shipping.courier}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] text-success-700">Resi: <strong>{order.shipping.trackingNumber}</strong></span>
                                    <CopyButton text={order.shipping.trackingNumber} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Catatan pembeli */}
                    {order.note && (
                        <div>
                            <p className="text-[11px] text-text-faint uppercase tracking-wider mb-2">Catatan Pembeli</p>
                            <p className="text-[13px] text-text-muted p-3.5 bg-subtle rounded-xl border border-border-subtle italic">
                                "{order.note}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Action footer */}
                <div className="sticky bottom-0 bg-surface border-t border-border p-4 space-y-2">
                    {order.status === 'paid' && (
                        <Button fullWidth leftIcon={<Package size={14} />} onClick={() => onProcess(order.id)}>
                            Proses Pesanan
                        </Button>
                    )}
                    {order.status === 'processing' && (
                        <Button fullWidth leftIcon={<Truck size={14} />} onClick={() => onShip(order)}>
                            Input Nomor Resi & Kirim
                        </Button>
                    )}
                    {order.status === 'shipped' && (
                        <div className="flex items-center justify-center gap-2 text-[13px] text-success-600 py-2">
                            <CheckCircle size={14} /> Pesanan sedang dalam pengiriman
                        </div>
                    )}
                    {order.status === 'delivered' && (
                        <div className="flex items-center justify-center gap-2 text-[13px] text-success-600 py-2">
                            <CheckCircle size={14} /> Pesanan telah selesai
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── Order Row ────────────────────────────────────────────────── */
function OrderRow({ order, onClick }: { order: Order; onClick: () => void }) {
    const firstItem = order.items?.[0];
    const total = Number(order.total) || 0;

    return (
        <tr
            className="border-b border-border-subtle hover:bg-subtle/50 transition-colors cursor-pointer"
            onClick={onClick}
        >
            <td className="py-4 px-4 pl-0">
                <p className="text-[13px] font-medium text-brand-500">
                    #{order.orderNumber ?? String(order.id).padStart(6, '0')}
                </p>
                <p className="text-[11px] text-text-faint mt-0.5">{formatRelativeTime(order.createdAt)}</p>
            </td>
            <td className="py-4 px-4 hidden md:table-cell">
                {order.buyer && (
                    <div className="flex items-center gap-2">
                        <Avatar name={order.buyer.name} size="xs" />
                        <span className="text-[13px] text-text-muted">{order.buyer.name}</span>
                    </div>
                )}
            </td>
            <td className="py-4 px-4">
                <p className="text-[13px] text-text line-clamp-1 max-w-[200px]">
                    {firstItem?.name ?? '—'}
                    {(order.items?.length ?? 0) > 1 && (
                        <span className="text-text-faint"> +{order.items.length - 1}</span>
                    )}
                </p>
                <p className="text-[11px] text-text-faint mt-0.5">{order.items.length} item</p>
            </td>
            <td className="py-4 px-4">
                <p className="text-[13px] font-medium text-text">{formatPrice(total)}</p>
            </td>
            <td className="py-4 px-4">
                <OrderStatusBadge status={order.status} />
            </td>
            <td className="py-4 px-4 pr-0">
                {order.shipping?.trackingNumber ? (
                    <div className="flex items-center gap-1 text-[11px] text-success-600">
                        <Truck size={11} />
                        <span className="hidden lg:inline truncate max-w-[80px]">{order.shipping.trackingNumber}</span>
                    </div>
                ) : (
                    <span className="text-[11px] text-text-faint">—</span>
                )}
            </td>
        </tr>
    );
}

/* ── Page (INNER) ───────────────────────────────────────────── */
function DashboardOrdersInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuthStore();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState(searchParams.get('status') ?? 'all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [shipOrder, setShipOrder] = useState<Order | null>(null);
    const [processing, setProcessing] = useState<string | number | null>(null);
    const [error, setError] = useState('');

    const fetchOrders = useCallback(async () => {
        if (!user) return;
        setLoading(true); setError('');
        try {
            const res = await api.get('/dashboard/orders');
            const raw = res.data.data ?? res.data;
            const list = Array.isArray(raw) ? raw : (raw.data ?? raw.items ?? []);
            setOrders(list);
        } catch {
            setError('Gagal memuat pesanan.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) { router.push('/login'); return; }
        if (user.role !== 'seller' && user.role !== 'admin') { router.push('/'); return; }
        fetchOrders();
    }, [user, fetchOrders]);

    /* ── Process order ── */
    const handleProcess = async (id: string | number) => {
        setProcessing(id);
        try {
            await api.patch(`/dashboard/orders/${id}/process`);
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'processing' } : o));
            if (selectedOrder?.id === id) setSelectedOrder(prev => prev ? { ...prev, status: 'processing' } : null);
        } catch {
            setError('Gagal memproses pesanan.');
        } finally {
            setProcessing(null);
        }
    };

    /* ── After shipped ── */
    const handleShipped = (orderId: string | number, tracking: string, courier: string) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId
                ? { ...o, status: 'shipped', shipping: { ...o.shipping!, trackingNumber: tracking, courier } }
                : o
        ));
        if (selectedOrder?.id === orderId) {
            setSelectedOrder(prev => prev ? {
                ...prev, status: 'shipped',
                shipping: { ...prev.shipping!, trackingNumber: tracking, courier }
            } : null);
        }
    };

    /* ── Filter ── */
    const filtered = orders.filter(o => {
        const matchTab = activeTab === 'all' || o.status === activeTab;
        const matchSearch = !search || (
            (o.orderNumber ?? String(o.id)).includes(search) ||
            o.buyer?.name?.toLowerCase().includes(search.toLowerCase()) ||
            o.items?.some(i => i.name.toLowerCase().includes(search.toLowerCase()))
        );
        return matchTab && matchSearch;
    });

    /* ── Tab counts ── */
    const counts = STATUS_TABS.reduce((acc, tab) => {
        acc[tab.key] = tab.key === 'all'
            ? orders.length
            : orders.filter(o => o.status === tab.key).length;
        return acc;
    }, {} as Record<string, number>);

    const pendingCount = counts['paid'] ?? 0;

    if (!user) return null;

    return (
        <div className="page-container py-6 sm:py-8 space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-[20px] font-medium text-text">Pesanan Masuk</h1>
                    <p className="text-[13px] text-text-muted mt-0.5">
                        {pendingCount > 0 && (
                            <span className="text-warning-600 font-medium">{pendingCount} pesanan perlu diproses · </span>
                        )}
                        {orders.length} total pesanan
                    </p>
                </div>
                <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchOrders}>
                    Refresh
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint pointer-events-none" />
                <input
                    type="search"
                    placeholder="Cari nomor pesanan, nama pembeli, atau produk..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-[14px] border border-border rounded-xl bg-surface text-text placeholder:text-text-faint focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                />
            </div>

            {/* Status tabs */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                {STATUS_TABS.map(tab => {
                    const TabIcon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                'flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium transition-all',
                                activeTab === tab.key
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-surface border border-border text-text-muted hover:text-text hover:border-brand-300'
                            )}
                        >
                            <TabIcon size={13} />
                            {tab.label}
                            {counts[tab.key] > 0 && (
                                <span className={cn(
                                    'text-[10px] px-1.5 py-0.5 rounded-full font-medium leading-none',
                                    activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-text-muted'
                                )}>
                                    {counts[tab.key]}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 p-3.5 rounded-lg bg-danger-50 border border-danger-200 text-[13px] text-danger-700">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex gap-4 py-3 border-b border-border-subtle">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 flex-1" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-4">
                        <EmptyState
                            preset="orders"
                            title={search ? 'Pesanan tidak ditemukan' : 'Belum ada pesanan'}
                            description={search ? undefined : 'Pesanan dari pembeli akan muncul di sini.'}
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-subtle text-[11px] font-medium text-text-faint uppercase tracking-wider">
                                    <th className="text-left py-3 px-4 pl-0">No. Pesanan</th>
                                    <th className="text-left py-3 px-4 hidden md:table-cell">Pembeli</th>
                                    <th className="text-left py-3 px-4">Produk</th>
                                    <th className="text-left py-3 px-4">Total</th>
                                    <th className="text-left py-3 px-4">Status</th>
                                    <th className="text-left py-3 px-4 pr-0">Resi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(order => (
                                    <OrderRow
                                        key={order.id}
                                        order={order}
                                        onClick={() => setSelectedOrder(order)}
                                    />
                                ))}
                            </tbody>
                        </table>
                        <div className="px-4 py-3 border-t border-border-subtle text-[12px] text-text-faint">
                            {filtered.length} dari {orders.length} pesanan ditampilkan
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail Drawer */}
            {selectedOrder && (
                <OrderDrawer
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onProcess={handleProcess}
                    onShip={(order) => { setShipOrder(order); setSelectedOrder(null); }}
                />
            )}

            {/* Ship Modal */}
            {shipOrder && (
                <ShipModal
                    order={shipOrder}
                    onClose={() => setShipOrder(null)}
                    onShipped={handleShipped}
                />
            )}
        </div>
    );
}

export default function DashboardOrdersPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-text-muted">Memuat...</div>}>
            <DashboardOrdersInner />
        </Suspense>
    );
}
