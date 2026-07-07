"use client";

import { useState } from "react";
import { useCart, cartTotalCents } from "@/store/cart";
import { apiFetch } from "@/lib/api";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}

export default function CartPage() {
  const items = useCart((state) => state.items);
  const setQuantity = useCart((state) => state.setQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currency = items[0]?.currency ?? "eur";
  const total = cartTotalCents(items);

  async function checkout() {
    setError(null);
    setLoading(true);
    try {
      const cart = await apiFetch<{ id: string }>("/cart", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        }),
      });
      const session = await apiFetch<{ url: string }>("/checkout/session", {
        method: "POST",
        body: JSON.stringify({ cartId: cart.id }),
      });
      window.location.href = session.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Cart</h1>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Your cart is empty.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.variantId} className="flex items-center justify-between gap-4 border-b border-black/10 pb-4 dark:border-white/10">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.variantName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => setQuantity(item.variantId, Number(e.target.value))}
                    className="w-14 rounded border border-black/10 bg-transparent px-2 py-1 text-sm dark:border-white/10"
                  />
                  <p className="w-20 text-right text-sm">{formatPrice(item.unitPriceCents * item.quantity, item.currency)}</p>
                  <button onClick={() => removeItem(item.variantId)} className="text-sm text-zinc-500 hover:underline">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-lg font-medium">Total</p>
            <p className="text-lg font-medium">{formatPrice(total, currency)}</p>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            onClick={checkout}
            disabled={loading}
            className="mt-6 w-full rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background disabled:opacity-40"
          >
            {loading ? "Redirecting to Stripe…" : "Checkout"}
          </button>
        </>
      )}
    </main>
  );
}
