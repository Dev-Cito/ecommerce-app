import { API_URL } from "@/lib/api";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";

interface Order {
  id: string;
  status: string;
  totalCents: number;
  currency: string;
}

async function getOrder(sessionId: string): Promise<Order | null> {
  const res = await fetch(`${API_URL}/orders/by-session/${sessionId}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const order = sessionId ? await getOrder(sessionId) : null;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 text-center">
      <ClearCartOnMount />
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">Thank you!</h1>
      {order ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Your order has been confirmed. Total:{" "}
          {new Intl.NumberFormat("fr-FR", { style: "currency", currency: order.currency }).format(
            order.totalCents / 100,
          )}
        </p>
      ) : (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Payment received — we&apos;re confirming your order now. This can take a few seconds while our
          webhook processes it.
        </p>
      )}
    </main>
  );
}
