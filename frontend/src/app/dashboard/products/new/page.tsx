'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ImagePlus, X, Plus, Minus, Tag, Package,
    ChevronLeft, Info, AlertCircle, Check,
    DollarSign, Layers, Weight, Globe,
} from 'lucide-react';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { cn, formatPrice } from '@/lib/utils';

/* ── Schema ──────────────────────────────────────────────────── */
const productSchema = z.object({
    name: z.string().min(5, 'Nama produk minimal 5 karakter').max(200),
    description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
    price: z.number().min(100, 'Harga minimal Rp 100'),
    originalPrice: z.number().optional().or(z.literal(0)),
    stock: z.number().min(0, 'Stok tidak boleh minus').int(),
    weight: z.number().min(0).optional().or(z.literal(0)),
    category: z.string().min(1, 'Pilih kategori produk'),
    type: z.enum(['physical', 'digital']),
    condition: z.enum(['new', 'used']),
    status: z.enum(['active', 'draft']),
});

type ProductForm = z.infer<typeof productSchema>;

/* ── Categories ──────────────────────────────────────────────── */
const CATEGORIES = [
    'Elektronik', 'Fashion Pria', 'Fashion Wanita', 'Rumah & Taman',
    'Kecantikan', 'Gaming', 'Makanan & Minuman', 'Buku & Alat Tulis',
    'Otomotif', 'Olahraga', 'Ibu & Bayi', 'Hewan Peliharaan',
    'Produk Digital', 'Lisensi Software', 'Template & Desain', 'Kursus Online',
];

/* ── Section Wrapper ─────────────────────────────────────────── */
function FormSection({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
    return (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border-subtle bg-subtle">
                <h2 className="text-[14px] font-medium text-text">{title}</h2>
                {desc && <p className="text-[12px] text-text-faint mt-0.5">{desc}</p>}
            </div>
            <div className="p-5 space-y-4">{children}</div>
        </div>
    );
}

/* ── Image Uploader ──────────────────────────────────────────── */
function ImageUploader({
    images, onAdd, onRemove, uploading,
}: {
    images: string[];
    onAdd: (files: File[]) => void;
    onRemove: (idx: number) => void;
    uploading: boolean;
}) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length > 0) onAdd(files);
        e.target.value = '';
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
                {images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-border group">
                        <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                        {i === 0 && (
                            <span className="absolute bottom-0 left-0 right-0 bg-brand-500/90 text-white text-[9px] text-center py-0.5 font-medium">
                                UTAMA
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => onRemove(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-danger-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={11} />
                        </button>
                    </div>
                ))}

                {/* Add button */}
                {images.length < 8 && (
                    <label className={cn(
                        'w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all',
                        uploading ? 'border-brand-300 bg-brand-50' : 'border-border hover:border-brand-400 hover:bg-brand-50'
                    )}>
                        {uploading ? (
                            <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <ImagePlus size={20} className="text-text-faint mb-1" />
                                <span className="text-[10px] text-text-faint">Tambah Foto</span>
                            </>
                        )}
                        <input type="file" accept="image/*" multiple onChange={handleChange} className="hidden" disabled={uploading} />
                    </label>
                )}
            </div>

            <p className="text-[11px] text-text-faint flex items-center gap-1">
                <Info size={11} />
                Maks. 8 foto · Foto pertama jadi foto utama · JPG/PNG/WebP · Maks. 5MB per foto
            </p>
        </div>
    );
}

/* ── Price Preview ───────────────────────────────────────────── */
function PricePreview({ price, original }: { price: number; original?: number }) {
    if (!price) return null;
    const hasDiscount = original && original > price;
    const pct = hasDiscount ? Math.round(((original - price) / original) * 100) : 0;
    return (
        <div className="flex items-center gap-2 text-[12px] text-text-faint mt-1">
            <span>Preview:</span>
            <span className="font-medium text-text">{formatPrice(price)}</span>
            {hasDiscount && (
                <>
                    <span className="line-through">{formatPrice(original)}</span>
                    <span className="text-danger-600 font-medium">-{pct}%</span>
                </>
            )}
        </div>
    );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function NewProductPage() {
    const router = useRouter();
    const { user } = useAuthStore();

    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const {
        register, handleSubmit, watch, setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProductForm>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            type: 'physical', condition: 'new', status: 'active',
            stock: 0, weight: 0, originalPrice: 0,
        },
    });

    const watchType = watch('type');
    const watchPrice = watch('price');
    const watchOriginal = watch('originalPrice');

    /* ── Upload images ke R2 ── */
    const uploadImages = async (files: File[]): Promise<string[]> => {
        const urls: string[] = [];
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'products');
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            urls.push(res.data.data?.url ?? res.data.url);
        }
        return urls;
    };

    const handleAddImages = async (files: File[]) => {
        if (images.length + files.length > 8) {
            alert('Maksimal 8 foto produk.');
            return;
        }
        setUploading(true);
        try {
            // Preview lokal dulu
            const previews = files.map(f => URL.createObjectURL(f));
            setImages(prev => [...prev, ...previews]);
            setImageFiles(prev => [...prev, ...files]);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setImageFiles(prev => prev.filter((_, i) => i !== idx));
    };

    /* ── Submit ── */
    const onSubmit = async (data: ProductForm) => {
        setSubmitError('');
        try {
            let uploadedUrls: string[] = [];

            // Upload images ke R2 dulu
            if (imageFiles.length > 0) {
                setUploading(true);
                uploadedUrls = await uploadImages(imageFiles);
                setUploading(false);
            }

            const payload = {
                ...data,
                images: uploadedUrls,
                originalPrice: data.originalPrice || undefined,
                weight: data.weight || undefined,
            };

            await api.post('/dashboard/products', payload);
            router.push('/dashboard/products');
        } catch (err: any) {
            setUploading(false);
            const msg = err?.response?.data?.message;
            setSubmitError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Gagal menyimpan produk.'));
        }
    };

    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
        router.push('/');
        return null;
    }

    return (
        <div className="page-container py-6 sm:py-8">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-[13px] text-brand-500 hover:text-brand-600"
                >
                    <ChevronLeft size={16} /> Kembali
                </button>
                <span className="text-text-faint">/</span>
                <h1 className="text-[20px] font-medium text-text">Tambah Produk Baru</h1>
            </div>

            {/* Error */}
            {submitError && (
                <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-danger-50 border border-danger-200">
                    <AlertCircle size={15} className="text-danger-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[13px] text-danger-700">{submitError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ── Kiri: Form utama ── */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Foto Produk */}
                    <FormSection title="Foto Produk" desc="Upload foto produk yang menarik dan berkualitas tinggi">
                        <ImageUploader
                            images={images}
                            onAdd={handleAddImages}
                            onRemove={handleRemoveImage}
                            uploading={uploading}
                        />
                    </FormSection>

                    {/* Info Dasar */}
                    <FormSection title="Informasi Produk">
                        <Input
                            label="Nama Produk"
                            placeholder="Contoh: Sepatu Nike Air Max 2024 Original"
                            error={errors.name?.message}
                            hint="Minimal 5 karakter, maksimal 200 karakter"
                            required
                            {...register('name')}
                        />
                        <Textarea
                            label="Deskripsi Produk"
                            placeholder="Jelaskan produkmu secara detail: bahan, ukuran, keunggulan, cara pakai, dll..."
                            error={errors.description?.message}
                            hint="Minimal 20 karakter. Deskripsi yang lengkap meningkatkan kepercayaan pembeli."
                            required
                            {...register('description')}
                        />

                        {/* Kategori */}
                        <div>
                            <label className="block text-[13px] font-medium text-text mb-1.5">
                                Kategori <span className="text-danger-500">*</span>
                            </label>
                            <select
                                className={cn(
                                    'w-full px-3.5 py-2.5 text-[14px] border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all',
                                    errors.category
                                        ? 'border-danger-400 focus:border-danger-500 focus:ring-danger-100'
                                        : 'border-border focus:border-brand-500 focus:ring-brand-100'
                                )}
                                {...register('category')}
                            >
                                <option value="">— Pilih Kategori —</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.category && (
                                <p className="mt-1.5 text-[12px] text-danger-600">⚠ {errors.category.message}</p>
                            )}
                        </div>

                        {/* Tipe & Kondisi */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[13px] font-medium text-text mb-1.5">Tipe Produk</label>
                                <div className="flex gap-2">
                                    {[
                                        { value: 'physical', label: '📦 Fisik' },
                                        { value: 'digital', label: '💾 Digital' },
                                    ].map(opt => (
                                        <label key={opt.value} className={cn(
                                            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border cursor-pointer transition-all text-[13px]',
                                            watchType === opt.value
                                                ? 'border-brand-500 bg-brand-50 text-brand-600 font-medium'
                                                : 'border-border hover:border-brand-300 text-text-muted'
                                        )}>
                                            <input type="radio" value={opt.value} className="sr-only" {...register('type')} />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-text mb-1.5">Kondisi</label>
                                <div className="flex gap-2">
                                    {[
                                        { value: 'new', label: '✨ Baru' },
                                        { value: 'used', label: '🔄 Bekas' },
                                    ].map(opt => (
                                        <label key={opt.value} className={cn(
                                            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border cursor-pointer transition-all text-[13px]',
                                            watch('condition') === opt.value
                                                ? 'border-brand-500 bg-brand-50 text-brand-600 font-medium'
                                                : 'border-border hover:border-brand-300 text-text-muted'
                                        )}>
                                            <input type="radio" value={opt.value} className="sr-only" {...register('condition')} />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* Harga */}
                    <FormSection title="Harga & Stok">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="Harga Jual"
                                    type="number"
                                    placeholder="150000"
                                    error={errors.price?.message}
                                    hint="Dalam Rupiah (IDR)"
                                    required
                                    leftElement={<span className="text-[12px] text-text-faint font-medium">Rp</span>}
                                    {...register('price', { valueAsNumber: true })}
                                />
                                <PricePreview price={watchPrice} original={watchOriginal || undefined} />
                            </div>
                            <div>
                                <Input
                                    label="Harga Coret (Opsional)"
                                    type="number"
                                    placeholder="200000"
                                    hint="Kosongkan jika tidak ada diskon"
                                    leftElement={<span className="text-[12px] text-text-faint font-medium">Rp</span>}
                                    {...register('originalPrice', { valueAsNumber: true })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Stok"
                                type="number"
                                placeholder="100"
                                error={errors.stock?.message}
                                required
                                leftElement={<Layers size={14} />}
                                {...register('stock', { valueAsNumber: true })}
                            />
                            {watchType === 'physical' && (
                                <Input
                                    label="Berat (gram)"
                                    type="number"
                                    placeholder="500"
                                    hint="Untuk kalkulasi ongkir"
                                    leftElement={<Weight size={14} />}
                                    {...register('weight', { valueAsNumber: true })}
                                />
                            )}
                        </div>
                    </FormSection>

                </div>

                {/* ── Kanan: Sidebar ── */}
                <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">

                    {/* Status */}
                    <FormSection title="Status Publikasi">
                        <div className="space-y-2">
                            {[
                                { value: 'active', label: 'Aktif & Terlihat', desc: 'Produk langsung tampil di marketplace', icon: '🟢' },
                                { value: 'draft', label: 'Simpan sebagai Draft', desc: 'Produk tidak terlihat oleh pembeli', icon: '📝' },
                            ].map(opt => (
                                <label key={opt.value} className={cn(
                                    'flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all',
                                    watch('status') === opt.value
                                        ? 'border-brand-500 bg-brand-50'
                                        : 'border-border hover:border-brand-300'
                                )}>
                                    <input type="radio" value={opt.value} className="mt-0.5 accent-brand-500" {...register('status')} />
                                    <div>
                                        <p className="text-[13px] font-medium text-text">{opt.icon} {opt.label}</p>
                                        <p className="text-[11px] text-text-faint mt-0.5">{opt.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </FormSection>

                    {/* Tips */}
                    <div className="bg-info-50 border border-info-200 rounded-xl p-4 space-y-2">
                        <p className="text-[13px] font-medium text-info-700 flex items-center gap-1.5">
                            <Info size={14} /> Tips Produk Laku
                        </p>
                        {[
                            'Foto berkualitas tinggi dari banyak sudut',
                            'Deskripsi lengkap dengan ukuran & spesifikasi',
                            'Harga kompetitif dengan toko sejenis',
                            'Stok selalu update agar tidak pesanan batal',
                            'Respon chat pembeli dengan cepat',
                        ].map(tip => (
                            <div key={tip} className="flex items-start gap-2 text-[12px] text-info-700">
                                <Check size={11} className="mt-0.5 flex-shrink-0" strokeWidth={3} />
                                {tip}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            loading={isSubmitting || uploading}
                        >
                            {isSubmitting ? 'Menyimpan...' : uploading ? 'Mengupload foto...' : '✓ Simpan Produk'}
                        </Button>
                        <Button
                            type="button"
                            fullWidth
                            variant="ghost"
                            onClick={() => router.back()}
                        >
                            Batal
                        </Button>
                    </div>
                </div>

            </form>
        </div>
    );
}
