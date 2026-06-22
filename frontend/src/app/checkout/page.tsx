'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    MapPin, Truck, CreditCard, ChevronDown, ChevronRight,
    Plus, Check, Store, AlertCircle, ShieldCheck, Tag,
    Clock, Package,
} from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn, formatPrice } from '@/lib/utils';

/* ================================================================
   TYPES
   ================================================================ */
interface Address {
    id: string | number;
    label: string;
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    postalCode: string;
    fullAddress: string;
    isDefault: boolean;
    rajaongkirDestinationId?: string; // ← tambah ini
}

interface ShippingCourier {
    code: string;
    name: string;
    service: string;
    description: string;
    cost: number;
    etd: string;
}

interface CheckoutItem {
    id: string | number;
    productId: string | number;
    name: string;
    image?: string;
    price: number;
    quantity: number;
    weight?: number; // ← tambah ini (gram)
    store?: {
        id: string | number;
        name: string;
    };
}

interface CheckoutGroup {
    storeId: string | number;
    storeName: string;
    items: CheckoutItem[];
    courier?: ShippingCourier;
    note: string;
}

/* ================================================================
   SECTION WRAPPER
   ================================================================ */
function Section({
    step, title, icon: Icon, children, done,
}: {
    step: number;
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    done?: boolean;
}) {
    return (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border-subtle bg-subtle">
                <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-medium flex-shrink-0',
                    done ? 'bg-success-500 text-white' : 'bg-brand-500 text-white'
                )}>
                    {done ? <Check size={13} strokeWidth={3} /> : step}
                </div>
                <div className="flex items-center gap-2 flex-1">
                    <Icon size={16} className="text-text-muted" />
                    <h2 className="text-[15px] font-medium text-text">{title}</h2>
                </div>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

/* ================================================================
   ADDRESS CARD
   ================================================================ */
function AddressCard({
    address, selected, onSelect,
}: {
    address: Address;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all',
                selected
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-border hover:border-brand-300 bg-surface'
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[14px] font-medium text-text">{address.recipientName}</span>
                        <span className="text-[13px] text-text-muted">{address.phone}</span>
                        {address.isDefault && (
                            <Badge variant="brand" size="xs">Utama</Badge>
                        )}
                        <Badge variant="neutral" size="xs">{address.label}</Badge>
                    </div>
                    <p className="text-[13px] text-text-muted leading-relaxed">
                        {address.fullAddress}, {address.district}, {address.city}, {address.province} {address.postalCode}
                    </p>
                </div>
                <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all',
                    selected ? 'border-brand-500 bg-brand-500' : 'border-border'
                )}>
                    {selected && <Check size={11} className="text-white" strokeWidth={3} />}
                </div>
            </div>
        </button>
    );
}

/* ================================================================
   COURIER OPTION
   ================================================================ */
function CourierOption({
    courier, selected, onSelect,
}: {
    courier: ShippingCourier;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className={cn(
                'w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between gap-3',
                selected ? 'border-brand-500 bg-brand-50' : 'border-border hover:border-brand-300'
            )}
        >
            <div className="flex items-center gap-3">
                <div className={cn(
                    'w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                    selected ? 'border-brand-500 bg-brand-500' : 'border-border'
                )}>
                    {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                    <p className="text-[13px] font-medium text-text">
                        {courier.name} {courier.service}
                    </p>
                    <p className="text-[11px] text-text-faint flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        Estimasi {courier.etd}
                    </p>
                </div>
            </div>
            <span className="text-[14px] font-medium text-text flex-shrink-0">
                {courier.cost === 0 ? (
                    <span className="text-success-600">Gratis</span>
                ) : formatPrice(courier.cost)}
            </span>
        </button>
    );
}

/* ================================================================
   PAYMENT METHOD
   ================================================================ */
const PAYMENT_METHODS = [
    {
        group: 'Transfer Bank',
        methods: [
            { code: 'bca_va', name: 'BCA Virtual Account', icon: '🏦' },
            { code: 'bni_va', name: 'BNI Virtual Account', icon: '🏦' },
            { code: 'bri_va', name: 'BRI Virtual Account', icon: '🏦' },
            { code: 'mandiri_va', name: 'Mandiri Virtual Account', icon: '🏦' },
        ],
    },
    {
        group: 'Dompet Digital',
        methods: [
            { code: 'gopay', name: 'GoPay', icon: '💚' },
            { code: 'ovo', name: 'OVO', icon: '💜' },
            { code: 'dana', name: 'DANA', icon: '💙' },
            { code: 'shopeepay', name: 'ShopeePay', icon: '🧡' },
        ],
    },
    {
        group: 'Lainnya',
        methods: [
            { code: 'qris', name: 'QRIS (Semua E-Wallet)', icon: '📱' },
            { code: 'cod', name: 'Bayar di Tempat (COD)', icon: '💵' },
        ],
    },
];

/* ================================================================
   ORDER SUMMARY SIDEBAR
   ================================================================ */
function OrderSummary({
    groups, subtotal, totalShipping, totalDiscount, total, loading, onSubmit,
}: {
    groups: CheckoutGroup[];
    subtotal: number;
    totalShipping: number;
    totalDiscount: number;
    total: number;
    loading: boolean;
    onSubmit: () => void;
}) {
    const allHasCourier = groups.length > 0 && groups.every(g => g.courier);

    return (
        <div className="space-y-3">
            {/* Item summary */}
            <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
                <p className="text-[13px] font-medium text-text">Ringkasan Pesanan</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {groups.flatMap(g => g.items).map(item => (
                        <div key={item.id} className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-subtle flex-shrink-0 flex items-center justify-center">
                                <Package size={14} className="text-text-faint" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] text-text line-clamp-1">{item.name}</p>
                                <p className="text-[11px] text-text-faint">
                                    {item.quantity}x {formatPrice(Number(item.price))}
                                </p>
                            </div>
                            <p className="text-[12px] font-medium text-text flex-shrink-0">
                                {formatPrice(Number(item.price) * item.quantity)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price breakdown */}
            <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
                <div className="space-y-2.5">
                    <div className="flex justify-between">
                        <span className="text-[13px] text-text-muted">Subtotal produk</span>
                        <span className="text-[13px] text-text">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[13px] text-text-muted">Ongkos kirim</span>
                        <span className={cn(
                            'text-[13px]',
                            totalShipping === 0 && allHasCourier ? 'text-success-600' : 'text-text'
                        )}>
                            {!allHasCourier
                                ? <span className="text-text-faint italic">Pilih pengiriman</span>
                                : totalShipping === 0 ? 'Gratis' : formatPrice(totalShipping)
                            }
                        </span>
                    </div>
                    {totalDiscount > 0 && (
                        <div className="flex justify-between">
                            <span className="text-[13px] text-text-muted">Diskon</span>
                            <span className="text-[13px] text-success-600">-{formatPrice(totalDiscount)}</span>
                        </div>
                    )}
                </div>

                <div className="border-t border-border-subtle pt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[14px] font-medium text-text">Total Pembayaran</span>
                        <span className="text-[20px] font-medium text-brand-600">
                            {formatPrice(total)}
                        </span>
                    </div>
                </div>

                <Button
                    fullWidth
                    size="lg"
                    onClick={onSubmit}
                    loading={loading}
                    disabled={!allHasCourier || loading}
                >
                    {loading ? 'Memproses...' : 'Buat Pesanan'}
                </Button>

                <div className="flex items-center justify-center gap-1 text-[11px] text-text-faint">
                    <ShieldCheck size={12} className="text-success-500" />
                    Pembayaran diproses secara aman melalui Midtrans
                </div>
            </div>
        </div>
    );
}

/* ================================================================
   CHECKOUT PAGE
   ================================================================ */
export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuthStore();
    const itemIds = searchParams.get('items')?.split(',') ?? [];

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [groups, setGroups] = useState<CheckoutGroup[]>([]);
    const [couriers, setCouriers] = useState<Record<string, ShippingCourier[]>>({});
    const [courierLoading, setCourierLoading] = useState<Record<string, boolean>>({});
    const [selectedPayment, setSelectedPayment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showAllAddress, setShowAllAddress] = useState(false);
    const [note, setNote] = useState<Record<string, string>>({});
    const [error, setError] = useState('');

    /* ── Fetch data awal ── */
    useEffect(() => {
        if (!user) { router.push('/login?redirect=/checkout'); return; }

        const init = async () => {
            setLoading(true);
            try {
                const [addrRes, cartRes] = await Promise.all([
                    api.get('/addresses'),
                    api.get('/cart'),
                ]);

                // Addresses
                const addrs: Address[] = addrRes.data.data ?? addrRes.data ?? [];
                setAddresses(addrs);
                const def = addrs.find(a => a.isDefault) ?? addrs[0];
                if (def) setSelectedAddress(def);

                // Cart items — filter yang dipilih
                const raw = cartRes.data.data ?? cartRes.data;
                const items: CheckoutItem[] = (Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [])
                    .filter((i: any) => itemIds.length === 0 || itemIds.includes(String(i.id)));

                // Group by store
                const map = new Map<string | number, CheckoutGroup>();
                items.forEach((item: any) => {
                    const sid = item.store?.id ?? item.product?.store?.id ?? 'unknown';
                    const sname = item.store?.name ?? item.product?.store?.name ?? 'Toko';
                    if (!map.has(sid)) {
                        map.set(sid, { storeId: sid, storeName: sname, items: [], note: '' });
                    }
                    map.get(sid)!.items.push({
                        ...item,
                        price: Number(item.price) || Number(item.product?.price) || 0,
                        weight: Number(item.product?.weight ?? item.weight ?? 500),
                    });
                });
                setGroups(Array.from(map.values()));
            } catch {
                setError('Gagal memuat data checkout. Silakan kembali ke keranjang.');
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [user]);

    /* ── Fetch kurir saat alamat dipilih ── */
    const fetchCouriers = useCallback(async (
        storeId: string | number,
        destinationId: string,
        totalWeight: number,
    ) => {
        if (!destinationId) return;
        setCourierLoading(prev => ({ ...prev, [String(storeId)]: true }));
        try {
            const res = await api.get('/shipping/store-cost', {
                params: {
                    storeId: String(storeId),
                    destinationId,
                    weight: totalWeight || 500,
                },
            });
            const list: ShippingCourier[] = res.data ?? [];
            setCouriers(prev => ({ ...prev, [String(storeId)]: list }));
        } catch {
            setCouriers(prev => ({
                ...prev,
                [String(storeId)]: [
                    { code: 'jne', name: 'JNE', service: 'REG', description: 'Layanan Reguler', cost: 15000, etd: '2-3 hari' },
                    { code: 'jnt', name: 'J&T Express', service: 'EZ', description: 'Layanan Standar', cost: 13000, etd: '2-4 hari' },
                    { code: 'pos', name: 'Pos Indonesia', service: 'Biasa', description: 'Layanan Pos', cost: 10000, etd: '3-5 hari' },
                ],
            }));
        } finally {
            setCourierLoading(prev => ({ ...prev, [String(storeId)]: false }));
        }
    }, []);

    useEffect(() => {
        if (selectedAddress && groups.length > 0) {
            const destId = selectedAddress.rajaongkirDestinationId ?? '';
            groups.forEach(g => {
                const totalWeight = g.items.reduce(
                    (sum, item) => sum + (item.weight ?? 500) * item.quantity, 0
                );
                fetchCouriers(g.storeId, destId, totalWeight);
            });
            setGroups(prev => prev.map(g => ({ ...g, courier: undefined })));
        }
    }, [selectedAddress, fetchCouriers]);

    /* ── Set kurir ── */
    const handleSelectCourier = (storeId: string | number, courier: ShippingCourier) => {
        setGroups(prev => prev.map(g =>
            g.storeId === storeId ? { ...g, courier } : g
        ));
    };

    /* ── Submit order ── */
    const handleSubmit = async () => {
        if (!selectedAddress) { setError('Pilih alamat pengiriman terlebih dahulu.'); return; }
        if (!selectedPayment) { setError('Pilih metode pembayaran terlebih dahulu.'); return; }
        if (groups.some(g => !g.courier)) { setError('Pilih kurir untuk setiap toko.'); return; }

        setSubmitting(true);
        setError('');
        try {
            // Format sesuai CheckoutDto backend
            const res = await api.post('/orders/checkout', {
                addressId: String(selectedAddress.id),
                paymentMethod: selectedPayment,
                shippingOptions: groups.map(g => ({
                    storeId: String(g.storeId),
                    courier: g.courier!.code,
                    service: g.courier!.service,
                    shippingFee: g.courier!.cost,
                })),
                notes: Object.values(note).filter(Boolean).join(' | ') || undefined,
            });

            const data = res.data;
            const orderId = data.orderId;
            const snapToken = data.snapToken;

            if (snapToken && (window as any).snap) {
                // Buka Snap popup — Shopee/Blibli style
                (window as any).snap.pay(snapToken, {
                    onSuccess: () => router.push(`/orders/${orderId}?status=success`),
                    onPending: () => router.push(`/orders/${orderId}?status=pending`),
                    onError: () => {
                        setError('Pembayaran gagal. Silakan coba lagi dari halaman pesanan.');
                        setSubmitting(false);
                        router.push(`/orders/${orderId}`);
                    },
                    onClose: () => {
                        setSubmitting(false);
                        router.push(`/orders/${orderId}`);
                    },
                });
            } else if (data.paymentUrl) {
                // Fallback: redirect ke payment page
                window.location.href = data.paymentUrl;
            } else {
                router.push(`/orders/${orderId}`);
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Gagal membuat pesanan. Silakan coba lagi.'));
            setSubmitting(false);
        }
    };

    /* ── Kalkulasi ── */
    const subtotal = groups.flatMap(g => g.items)
        .reduce((s, i) => s + (Number(i.price) || 0) * i.quantity, 0);
    const totalShipping = groups.reduce((s, g) => s + (g.courier?.cost ?? 0), 0);
    const total = subtotal + totalShipping;
    const displayedAddresses = showAllAddress ? addresses : addresses.slice(0, 2);

    if (!user) return null;

    return (
        <div className="page-container py-6 sm:py-8">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.back()}
                    className="text-[13px] text-brand-500 hover:text-brand-600 flex items-center gap-1"
                >
                    ← Kembali
                </button>
                <span className="text-text-faint">/</span>
                <h1 className="text-[20px] font-medium text-text">Checkout</h1>
            </div>

            {error && (
                <div className="mb-4 flex items-start gap-2.5 p-3.5 rounded-lg bg-danger-50 border border-danger-200">
                    <AlertCircle size={15} className="text-danger-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[13px] text-danger-700">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
                    </div>
                    <Skeleton className="h-80 rounded-xl" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Kiri: Form ── */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* 1. Alamat */}
                        <Section step={1} title="Alamat Pengiriman" icon={MapPin} done={!!selectedAddress}>
                            {addresses.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-[13px] text-text-muted mb-3">Belum ada alamat tersimpan.</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        leftIcon={<Plus size={14} />}
                                        onClick={() => router.push('/profile?tab=addresses&add=1')}
                                    >
                                        Tambah Alamat
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {displayedAddresses.map(addr => (
                                        <AddressCard
                                            key={addr.id}
                                            address={addr}
                                            selected={selectedAddress?.id === addr.id}
                                            onSelect={() => setSelectedAddress(addr)}
                                        />
                                    ))}
                                    <div className="flex items-center gap-3">
                                        {addresses.length > 2 && (
                                            <button
                                                onClick={() => setShowAllAddress(v => !v)}
                                                className="text-[13px] text-brand-500 hover:text-brand-600 flex items-center gap-1"
                                            >
                                                {showAllAddress ? 'Sembunyikan' : `Lihat ${addresses.length - 2} alamat lainnya`}
                                                <ChevronDown size={13} className={cn('transition-transform', showAllAddress && 'rotate-180')} />
                                            </button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            leftIcon={<Plus size={14} />}
                                            onClick={() => router.push('/profile?tab=addresses&add=1')}
                                        >
                                            Tambah Alamat
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Section>

                        {/* 2. Pengiriman per toko */}
                        <Section step={2} title="Metode Pengiriman" icon={Truck} done={groups.every(g => !!g.courier)}>
                            {groups.length === 0 ? (
                                <p className="text-[13px] text-text-faint">Tidak ada produk dipilih.</p>
                            ) : (
                                <div className="space-y-5">
                                    {groups.map(group => (
                                        <div key={String(group.storeId)}>
                                            {/* Store label */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <Store size={13} className="text-text-muted" />
                                                <span className="text-[13px] font-medium text-text">{group.storeName}</span>
                                                <span className="text-[11px] text-text-faint ml-auto">
                                                    {group.items.length} produk
                                                </span>
                                            </div>

                                            {/* Items ringkas */}
                                            <div className="mb-3 space-y-1">
                                                {group.items.map(item => (
                                                    <div key={String(item.id)} className="flex items-center gap-2 text-[12px] text-text-muted">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 flex-shrink-0" />
                                                        <span className="line-clamp-1 flex-1">{item.name}</span>
                                                        <span className="flex-shrink-0">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Kurir options */}
                                            {!selectedAddress ? (
                                                <p className="text-[12px] text-text-faint italic">
                                                    Pilih alamat untuk melihat opsi pengiriman
                                                </p>
                                            ) : courierLoading[String(group.storeId)] ? (
                                                <div className="space-y-2">
                                                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 rounded-lg" />)}
                                                </div>
                                            ) : (couriers[String(group.storeId)] ?? []).length === 0 ? (
                                                <p className="text-[12px] text-warning-600">
                                                    Tidak ada kurir tersedia ke alamat ini.
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {(couriers[String(group.storeId)] ?? []).map(c => (
                                                        <CourierOption
                                                            key={`${c.code}-${c.service}`}
                                                            courier={c}
                                                            selected={group.courier?.code === c.code && group.courier?.service === c.service}
                                                            onSelect={() => handleSelectCourier(group.storeId, c)}
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Catatan untuk toko */}
                                            <div className="mt-3">
                                                <textarea
                                                    value={note[String(group.storeId)] ?? ''}
                                                    onChange={e => setNote(prev => ({ ...prev, [String(group.storeId)]: e.target.value }))}
                                                    placeholder={`Catatan untuk ${group.storeName} (opsional)`}
                                                    rows={2}
                                                    maxLength={200}
                                                    className="w-full text-[13px] border border-border rounded-lg px-3.5 py-2.5 bg-surface text-text placeholder:text-text-faint resize-none focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Section>

                        {/* 3. Pembayaran */}
                        <Section step={3} title="Metode Pembayaran" icon={CreditCard} done={!!selectedPayment}>
                            <div className="space-y-4">
                                {PAYMENT_METHODS.map(group => (
                                    <div key={group.group}>
                                        <p className="text-[11px] text-text-faint uppercase tracking-wider mb-2">
                                            {group.group}
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {group.methods.map(method => (
                                                <button
                                                    key={method.code}
                                                    onClick={() => setSelectedPayment(method.code)}
                                                    className={cn(
                                                        'flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left',
                                                        selectedPayment === method.code
                                                            ? 'border-brand-500 bg-brand-50'
                                                            : 'border-border hover:border-brand-300'
                                                    )}
                                                >
                                                    <span className="text-[18px]">{method.icon}</span>
                                                    <span className="text-[13px] text-text">{method.name}</span>
                                                    {selectedPayment === method.code && (
                                                        <Check size={14} className="text-brand-500 ml-auto" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                    </div>

                    {/* ── Kanan: Ringkasan ── */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <OrderSummary
                            groups={groups}
                            subtotal={subtotal}
                            totalShipping={totalShipping}
                            totalDiscount={0}
                            total={total}
                            loading={submitting}
                            onSubmit={handleSubmit}
                        />
                    </div>

                </div>
            )}
        </div>
    );
}
