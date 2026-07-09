"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Store } from "lucide-react";
import { useCart, cartTotalItems } from "@/store/cart";
import { fireEmojiBurst } from "@/lib/emojiBurst";
import { CartDrawer } from "./CartDrawer";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const count = cartTotalItems(items);
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5 font-display text-xl font-bold text-cloud">
            <span className="grid h-[30px] w-[30px] place-items-center rounded-none bg-[linear-gradient(135deg,var(--violet),var(--cyan))]">
              <Store size={16} className="text-white" />
            </span>
            Ku&apos;isoko
          </div>
          <button
            onClick={() => setOpen(true)}
            onPointerDown={(e) => fireEmojiBurst(e.currentTarget)}
            className="relative inline-flex items-center gap-2 rounded-none border border-line bg-surface px-4 py-2.5 text-sm font-medium text-cloud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
          >
            <ShoppingCart size={17} strokeWidth={1.8} /> Cart
            {count > 0 && (
              <span className="grid h-5 min-w-[20px] place-items-center rounded-none px-1.5 text-xs font-bold text-white bg-[linear-gradient(135deg,var(--violet),var(--violet-bright))]">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

const HERO_WORDS = ["Gear", "that", "runs", "on"];

export function HeroTitle() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-[22px] inline-flex items-center gap-2 rounded-none border border-line bg-surface px-3.5 py-1.5 text-[13px] text-cyan"
      >
        <span className="h-[7px] w-[7px] rounded-none bg-cyan shadow-[0_0_10px_var(--cyan)]" />
        Live test store
      </motion.div>
      <h1 className="m-0 font-display text-[clamp(40px,7vw,76px)] font-bold leading-[1.02] tracking-[-0.02em]">
        {HERO_WORDS.map((w, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mr-4 inline-block"
          >
            {w}
          </motion.span>
        ))}
        <motion.span
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block bg-[linear-gradient(120deg,var(--violet-bright),var(--cyan))] bg-clip-text text-transparent"
        >
          Ku&apos;isoko.
        </motion.span>
      </h1>
    </>
  );
}

export function AmbientBlobs() {
  return (
    <>
      <div className="pointer-events-none fixed -left-20 -top-[120px] h-[420px] w-[420px] animate-[drift_9s_ease-in-out_infinite_alternate] rounded-none bg-[radial-gradient(circle,rgba(124,58,237,0.27),transparent_65%)] blur-[30px]" />
      <div className="pointer-events-none fixed -right-16 -bottom-[140px] h-[480px] w-[480px] animate-[drift_11s_ease-in-out_infinite_alternate-reverse] rounded-none bg-[radial-gradient(circle,rgba(34,211,238,0.2),transparent_65%)] blur-[36px]" />
    </>
  );
}
