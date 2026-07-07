"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import type { Product } from "@/lib/types";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}

export function ProductList({ products }: { products: Product[] }) {
  const addItem = useCart((state) => state.addItem);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [added, setAdded] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const variantId = selected[product.id] ?? product.variants[0]?.id;
        const variant = product.variants.find((v) => v.id === variantId);

        return (
          <div key={product.id} className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/10">
            <h2 className="font-medium">{product.name}</h2>
            {product.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{product.description}</p>
            )}

            {product.variants.length > 1 && (
              <select
                className="rounded border border-black/10 bg-transparent px-2 py-1 text-sm dark:border-white/10"
                value={variantId}
                onChange={(e) => setSelected((s) => ({ ...s, [product.id]: e.target.value }))}
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            )}

            {variant && (
              <>
                <p className="text-sm font-medium">{formatPrice(variant.priceCents, variant.currency)}</p>
                <button
                  disabled={variant.stock < 1}
                  onClick={() => {
                    addItem({
                      variantId: variant.id,
                      productName: product.name,
                      variantName: variant.name,
                      unitPriceCents: variant.priceCents,
                      currency: variant.currency,
                    });
                    setAdded(variant.id);
                    setTimeout(() => setAdded(null), 1200);
                  }}
                  className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-40"
                >
                  {variant.stock < 1 ? "Out of stock" : added === variant.id ? "Added" : "Add to cart"}
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
