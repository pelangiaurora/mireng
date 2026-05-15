import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

interface ProductImage {
  id: string;
  imageUrl: string;
  isThumbnail: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  images?: ProductImage[];
  seller?: { id: string; name: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const thumbnail = product.images?.find((i) => i.isThumbnail)?.imageUrl
    ?? product.images?.[0]?.imageUrl;

  const isLocalImage = thumbnail?.startsWith('/uploads/');
  const imageUrl = isLocalImage
    ? `http://localhost:3000${thumbnail}`
    : thumbnail;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link href={`/products/${product.id}`} className="group block rounded-xl border bg-white overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-black">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        {product.seller && (
          <p className="text-xs text-gray-400">oleh {product.seller.name}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-gray-900">{formattedPrice}</span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <ShoppingCart size={14} /> Beli
          </span>
        </div>
      </div>
    </Link>
  );
}
