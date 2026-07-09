"use client";
import { AnimatePresence, motion } from "motion/react";
import { X, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart, cartTotalCents } from "@/store/cart";
import { eur } from "@/lib/products";
import { startCheckout } from "@/lib/checkout";
import { fireEmojiBurst } from "@/lib/emojiBurst";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async () => {
    setError(null);
    setLoading(true);
    try {
      await startCheckout(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-[min(420px,100%)] flex-col border-l border-line bg-surface"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-5">
              <span className="font-display text-lg font-semibold text-cloud">Your cart</span>
              <button
                onClick={onClose}
                onPointerDown={(e) => fireEmojiBurst(e.currentTarget)}
                aria-label="Close cart"
                className="text-muted hover:text-cloud"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {items.length === 0 ? (
                <div className="mt-16 text-center text-muted">
                  <ShoppingCart size={40} strokeWidth={1.3} className="mx-auto opacity-50" />
                  <p className="mt-3">Nothing here yet. Go grab something.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.variantId} className="flex items-center gap-3 border-b border-line py-3.5">
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold text-cloud">{item.productName}</div>
                      <div className="text-[13px] text-muted">{item.variantName}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                        onPointerDown={(e) => fireEmojiBurst(e.currentTarget)}
                        aria-label="Decrease"
                        className="grid h-[26px] w-[26px] place-items-center rounded-none border border-line bg-surface-2 text-cloud"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[18px] text-center font-mono text-cloud">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                        onPointerDown={(e) => fireEmojiBurst(e.currentTarget)}
                        aria-label="Increase"
                        className="grid h-[26px] w-[26px] place-items-center rounded-none border border-line bg-surface-2 text-cloud"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="min-w-[62px] text-right font-mono text-sm text-cloud">
                      {eur(item.unitPriceCents * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      onPointerDown={(e) => fireEmojiBurst(e.currentTarget)}
                      aria-label="Remove"
                      className="text-muted hover:text-cloud"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-line px-5 py-5">
              {error && <p className="mb-3 text-sm text-cyan">{error}</p>}
              <div className="mb-4 flex justify-between">
                <span className="text-muted">Total</span>
                <span className="font-mono text-xl font-bold text-cloud">{eur(cartTotalCents(items))}</span>
              </div>
              <button
                disabled={!items.length || loading}
                onClick={checkout}
                onPointerDown={(e) => fireEmojiBurst(e.currentTarget)}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-none px-4 py-4 text-base font-semibold text-white bg-[linear-gradient(135deg,var(--violet),var(--violet-bright))] shadow-[0_12px_30px_-10px_var(--violet)] disabled:cursor-not-allowed disabled:bg-surface-2 disabled:bg-none disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                {loading ? (
                  "Redirecting…"
                ) : (
                  <>
                    Checkout <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
