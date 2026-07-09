import type { CartItem } from "@/store/cart";
import { apiFetch } from "@/lib/api";

export async function startCheckout(items: CartItem[]): Promise<void> {
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

  if (!session.url) throw new Error("No checkout URL returned");
  window.location.href = session.url;
}
