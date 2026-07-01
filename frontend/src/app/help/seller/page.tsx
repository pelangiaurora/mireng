import Link from "next/link";

export default function HelpSellerPage() {
  return (
    <div className="page-container py-8">
      <h1 className="text-2xl font-semibold text-heading-lg">Panduan Seller</h1>
      <p className="mt-3 text-text-muted text-[14px] leading-relaxed">
        Halaman panduan seller masih placeholder. Untuk saat ini, kamu dapat mulai dari dashboard seller.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors text-center"
        >
          Buka Dashboard
        </Link>
        <Link
          href="/help"
          className="px-4 py-2 rounded-lg border border-border hover:bg-subtle transition-colors text-center"
        >
          Kembali ke Bantuan
        </Link>
      </div>
    </div>
  );
}
