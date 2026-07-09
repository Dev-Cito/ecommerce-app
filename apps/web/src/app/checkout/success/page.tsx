import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6 text-cloud">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-none bg-[linear-gradient(135deg,var(--violet),var(--cyan))]">
          <CheckCircle2 size={34} className="text-white" strokeWidth={2} />
        </div>
        <h1 className="font-display text-3xl font-bold">Payment received</h1>
        <p className="mt-3 text-muted">Thanks — your order is confirmed. We&apos;ve emailed your receipt.</p>
        {sessionId && <p className="mt-2 font-mono text-xs text-muted/70">Ref: {sessionId.slice(0, 24)}…</p>}
        <Link
          href="/"
          className="mt-8 inline-flex rounded-none border border-line bg-surface px-6 py-3 text-sm font-medium text-cloud transition-colors hover:border-violet"
        >
          Back to store
        </Link>
      </div>
    </main>
  );
}
