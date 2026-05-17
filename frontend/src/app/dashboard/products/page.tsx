"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
};

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:3000/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-2">Product Management Dashboard</h1>

      <p className="text-gray-600 mb-6">Manage your products here.</p>

      {loading && (
        <div className="rounded-lg border p-4">Loading products...</div>
      )}

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="rounded-lg border p-4">No products found.</div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="rounded-lg border p-4">
                <h2 className="text-xl font-semibold">{product.name}</h2>

                <p className="text-gray-600">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>

                {product.description && (
                  <p className="mt-2 text-sm text-gray-500">
                    {product.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
