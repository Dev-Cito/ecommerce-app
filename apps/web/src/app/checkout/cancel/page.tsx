import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6 text-cloud">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-none border border-line bg-surface">
          <XCircle size={34} className="text-muted" strokeWidth={2} />
        </div>
        <h1 className="font-display text-3xl font-bold">Checkout cancelled</h1>
        <p className="mt-3 text-muted">No charge was made. Your cart is still here whenever you&apos;re ready.</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-none px-6 py-3 text-sm font-semibold text-white bg-[linear-gradient(135deg,var(--violet),var(--violet-bright))] shadow-[0_12px_30px_-10px_var(--violet)]"
        >
          Back to store
        </Link>
      </div>
    </main>
  );
}
