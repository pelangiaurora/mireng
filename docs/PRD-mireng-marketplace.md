# 📋 PRD — Mireng Marketplace
## Product Requirements Document v1.0
*Tanggal: Mei 2026 | Status: Draft Final*

---

## 1. OVERVIEW

Mireng adalah marketplace multi-seller untuk produk **fisik dan digital** di Indonesia.
Mirip Tokopedia + Shopee, dengan sistem seller tier, verifikasi bertahap, dan escrow.

---

## 2. USER ROLES

### 2.1 Guest (Belum Login)
- Browse produk & toko
- Cari & filter produk
- Lihat detail produk & toko
- Tidak bisa transaksi

### 2.2 Buyer (Default setelah register)
- Semua fitur Guest +
- Beli produk (fisik & digital)
- Keranjang & checkout
- Manajemen pesanan & retur
- Wishlist produk
- Follow toko
- Review & rating
- Chat dengan seller
- Saldo & wallet
- Manajemen alamat (multi alamat)
- Bisa mengajukan upgrade ke seller

### 2.3 Seller — FISIK
- Semua fitur Buyer +
- Kelola toko fisik (1 toko per akun)
- Jual produk fisik SAJA (tidak bisa digital)
- Manajemen produk: variasi, stok, berat/dimensi
- Kelola pesanan: konfirmasi, proses, kirim, input resi
- Pilih ekspedisi yang didukung (aktifkan/nonaktifkan)
- Saldo & penarikan dana
- Voucher toko
- Flash sale toko
- Statistik penjualan
- Chat dengan buyer
- **WAJIB verifikasi** sebelum bisa jualan

### 2.4 Seller — DIGITAL
- Semua fitur Buyer +
- Kelola toko digital (1 toko per akun)
- Jual produk digital SAJA (tidak bisa fisik)
- Upload file/link/akun otomatis
- Tidak perlu ekspedisi
- Verifikasi lebih ringan dari fisik

### 2.5 Admin
- Semua fitur +
- Kelola semua user & toko
- Buka/tutup pendaftaran seller
- Review & approve/reject permohonan seller
- Mediasi sengketa buyer-seller
- Override tier seller (naik/turunkan)
- Kelola kategori (fisik & digital terpisah)
- Kelola banner & promosi platform
- Voucher platform
- Laporan keuangan & statistik
- Verifikasi dokumen toko

---

## 3. SELLER REGISTRATION FLOW

### 3.1 Jalur Pendaftaran
```
JALUR A: Buyer Upgrade ke Seller
- User sudah punya akun buyer
- Klik "Buka Toko" di profile/navbar
- Cek: pendaftaran dibuka/ditutup?

JALUR B: Daftar Seller Langsung
- Halaman /register/seller
- Buat akun sekaligus daftar seller
- Tahapan SAMA dengan Jalur A
```

### 3.2 Cek Status Pendaftaran
```
DIBUKA:
→ Pilih tipe seller (Fisik / Digital)
→ Pilih tipe toko
→ Isi form + upload dokumen
→ Proses verifikasi

DITUTUP:
→ Tampil notif "Pendaftaran sementara ditutup"
→ Buyer bisa ajukan permohonan khusus:
   - Alasan ingin berjualan
   - Link toko di marketplace lain
   - Estimasi produk & omset
   - Foto KTP (wajib)
   - Dokumen pendukung (opsional)
→ Admin review & putuskan (approve/reject/minta tambahan)
```

---

## 4. TIPE TOKO & VERIFIKASI

### 4.1 Toko DIGITAL
```
Tipe: Perorangan Digital
Dokumen: Email terverifikasi + KTP
Waktu review: 1-24 jam
Setelah approved: Langsung bisa jualan
Limit: sesuai tier
```

### 4.2 Toko FISIK — Perorangan
```
Dokumen: KTP + Foto Selfie dengan KTP
Waktu review: 1-3 hari kerja
Setelah approved: Bisa jualan (tier Regular)
```

### 4.3 Toko FISIK — UMKM/Perusahaan
```
Tipe: CV, UD, Firma, Koperasi, dll
Dokumen: KTP PIC + NIB/SIUP + Akta Pendirian
Waktu review: 3-7 hari kerja
Label: ✓ Terverifikasi+
```

### 4.4 Toko FISIK — Official Store
```
Tipe: PT, Tbk, Brand resmi terdaftar
Dokumen: NPWP + SIUP + Akta PT + Surat Kuasa
Waktu review: 7-14 hari kerja (negosiasi)
Label: 🏅 Official Store
Komisi: negosiasi khusus
```

### 4.5 Status Verifikasi
```
pending    → sedang diproses admin
approved   → toko aktif
rejected   → ditolak (ada alasan + bisa ajukan ulang)
suspended  → dibekukan sementara oleh admin
banned     → diblokir permanen
```

---

## 5. SELLER TIER SYSTEM

### 5.1 Tingkatan
```
Regular    → Tidak ada label (default baru approved)
⭐ Star     → Target awal tercapai
⭐⭐ Star+  → Target menengah tercapai  
🏆 Top Seller → Performa terbaik
🏅 Official Store → Manual oleh admin (brand/perusahaan)
```

### 5.2 Sistem Progress
```
- Progress TIDAK reset dari 0 setelah naik tier
- Melanjutkan angka sebelumnya
  Contoh: Regular 0→50 → Star mulai dari 50→150
- Progress bar terlihat di dashboard seller
- Notifikasi otomatis saat tier naik/turun
```

### 5.3 Kriteria Naik Tier (Contoh)
```
Regular → Star:
  - 50+ transaksi berhasil
  - Rating toko ≥ 4.5
  - Aktif ≥ 3 bulan
  - Tingkat respons chat ≥ 80%

Star → Star+:
  - 150+ transaksi berhasil
  - Rating toko ≥ 4.7
  - Aktif ≥ 6 bulan
  - Komplain < 2%

Star+ → Top Seller:
  - 500+ transaksi berhasil
  - Rating toko ≥ 4.8
  - Aktif ≥ 12 bulan
  - Komplain < 1%
```

### 5.4 Admin Override
```
- Admin bisa naik/turun tier secara manual
- Seller mendapat notifikasi + alasan
- Seller bisa ON/OFF tampilan tier di toko mereka
```

---

## 6. KOMISI PLATFORM

```
Regular    → Komisi 1% (bebas biaya admin)
Star       → Komisi 1.5%
Star+      → Komisi 2%
Top Seller → Komisi 2.5% (dapat benefit lebih)
Official   → Negosiasi khusus
```

---

## 7. PRODUK

### 7.1 Produk FISIK
```
Field: nama, slug, deskripsi, harga, stok
Variasi: warna, ukuran, dll (multi-variasi)
Logistik: berat (gram), dimensi (cm)
Kondisi: baru / bekas
Kategori: hanya kategori FISIK
Foto: hingga 10 foto
Video: 1 video produk (opsional)
```

### 7.2 Produk DIGITAL
```
Field: nama, slug, deskripsi, harga
Tipe: akun, file, lisensi, template, ebook, software
Delivery: otomatis setelah pembayaran
File/Link: upload file atau input link
Kategori: hanya kategori DIGITAL
Foto: hingga 5 foto
```

### 7.3 Promosi Produk
```
Diskon biasa: coret harga (harga asli vs harga diskon)
Flash Sale: waktu terbatas, kuota terbatas
Voucher toko: kode voucher yang dibuat seller
Voucher platform: kode voucher dari admin Mireng
```

---

## 8. KATEGORI

### 8.1 Kategori FISIK
```
Elektronik & Gadget
Fashion & Pakaian
Makanan & Minuman
Kesehatan & Kecantikan
Rumah & Taman
Olahraga & Outdoor
Hobi & Koleksi
Otomotif
Buku & ATK
Ibu & Bayi
```

### 8.2 Kategori DIGITAL
```
Akun Premium (Netflix, Spotify, dll)
Software & Aplikasi
Template & Desain
Ebook & Kursus Online
Lisensi Software
Game & Hiburan
Jasa Digital (freelance)
Domain & Hosting
```

---

## 9. CHECKOUT & PEMBAYARAN

### 9.1 Alur Checkout Fisik
```
Keranjang
→ Pilih alamat pengiriman
→ Pilih ekspedisi + layanan (reguler/express/dll)
→ Cek ongkir otomatis (Raja Ongkir)
→ Terapkan voucher (opsional)
→ Pilih metode bayar
→ Bayar (Midtrans: VA/QRIS/e-wallet/CC)
→ Uang masuk ESCROW
→ Seller konfirmasi & kemas
→ Seller input nomor resi
→ Buyer terima barang
→ Buyer konfirmasi (atau otomatis 3 hari)
→ Dana cair ke wallet seller
```

### 9.2 Alur Checkout Digital
```
Keranjang
→ Terapkan voucher (opsional)
→ Pilih metode bayar
→ Bayar
→ File/akun/link otomatis dikirim ke buyer
→ Dana langsung masuk wallet seller
```

### 9.3 COD (Cash on Delivery)
```
Tersedia untuk produk FISIK saja
Seller pilih aktifkan COD atau tidak
Buyer pilih COD saat checkout
Kurir mengumpulkan uang saat pengiriman
```

### 9.4 Metode Pembayaran (Midtrans)
```
Virtual Account: BCA, BNI, BRI, Mandiri, Permata
QRIS (semua e-wallet)
E-wallet: GoPay, OVO, Dana, ShopeePay
Kartu Kredit/Debit
COD (khusus fisik)
Saldo Mireng (wallet)
```

---

## 10. PENGIRIMAN

```
Integrasi: Raja Ongkir API (bisa ganti ke Biteship nanti)
Ekspedisi: JNE, J&T, SiCepat, AnterAja, Pos Indonesia
Seller: pilih ekspedisi yang didukung (aktifkan/nonaktifkan)
Buyer: pilih ekspedisi & layanan saat checkout
Tracking: input nomor resi manual oleh seller
Lacak: terintegrasi dengan API ekspedisi
```

---

## 11. RETUR & REFUND

```
Alur:
1. Buyer ajukan retur + alasan + foto bukti
2. Seller merespons (setuju/tolak) dalam 2x24 jam
3. Jika sepakat → proses retur/refund
4. Jika tidak sepakat → admin mediasi
5. Admin putuskan → final

Refund: otomatis ke saldo/wallet Mireng
Retur barang: buyer kirim balik ke seller
Biaya retur: tergantung kesepakatan/kebijakan toko
```

---

## 12. REVIEW & RATING

```
Siapa bisa review: Buyer yang sudah transaksi selesai
Rating: 1-5 bintang
Konten: teks + foto (maks 5 foto)
Seller bisa: balas review
Tampil di: halaman produk + halaman toko
Rating toko: rata-rata dari semua review produk
```

---

## 13. CHAT REAL-TIME

```
Teknologi: WebSocket (Socket.io)
Fitur:
- Chat buyer ↔ seller
- Share produk di chat
- Gambar di chat
- Auto-reply seller (opsional)
- Indikator online/offline
- Notifikasi chat baru
```

---

## 14. WISHLIST & FOLLOW

```
Wishlist: simpan produk favorit (per user)
Follow toko: ikuti toko seller
Notif: buyer dapat notif jika toko yang di-follow
       ada produk baru / flash sale / promo
```

---

## 15. NOTIFIKASI

```
In-app: bell icon di navbar, real-time
Email: untuk event penting
Jenis notifikasi:
- Pesanan baru (seller)
- Status pesanan berubah (buyer)
- Chat baru
- Tier naik/turun (seller)
- Voucher baru dari toko yang di-follow
- Flash sale dari toko yang di-follow
- Review dibalas (buyer)
- Permohonan seller approved/rejected
- Verifikasi toko approved/rejected
```

---

## 16. ALAMAT INDONESIA OTOMATIS

```
API: wilayah.id (gratis, open source)
Alur:
1. Pilih Provinsi (34 provinsi)
2. Kota/Kabupaten otomatis filter by provinsi
3. Kecamatan otomatis filter by kota
4. Kelurahan otomatis filter by kecamatan
5. Kode pos otomatis terisi
```

---

## 17. ADMIN PANEL

```
Dashboard: statistik platform (GMV, user, transaksi)
User Management: list, detail, suspend, ban
Seller Management: 
  - Antrian pendaftaran
  - Review dokumen verifikasi
  - Override tier
  - Buka/tutup pendaftaran
Toko Management: list, detail, suspend
Produk Management: moderasi, featured, hapus
Kategori: CRUD hierarki (fisik & digital terpisah)
Keuangan: GMV, komisi, disbursement
Banner: kelola banner homepage
Voucher Platform: buat & kelola voucher
Mediasi: antrian sengketa buyer-seller
Laporan: export PDF/Excel
```

---

## 18. TECH STACK

```
Backend:  NestJS + TypeORM + PostgreSQL
Frontend: Next.js + Tailwind CSS + Zustand
Storage:  Cloudflare R2 (sudah ada)
Payment:  Midtrans
Shipping: Raja Ongkir API
Address:  wilayah.id API
Chat:     Socket.io (WebSocket)
Email:    NodeMailer / Resend
Deploy:   VPS (backend) + Vercel (frontend)
```

---

## 19. YANG MASIH PERLU DIDISKUSIKAN

- [ ] Batas limit transaksi per tier
- [ ] Kebijakan detail retur per kategori
- [ ] % komisi per tier (konfirmasi angka pasti)
- [ ] Fitur iklan/boost produk berbayar?
- [ ] Multi-bahasa (Indonesia + Inggris)?
- [ ] Mobile app (React Native) di masa depan?
- [ ] "tapi..." dari diskusi tier sistem yang belum selesai 😄
```
