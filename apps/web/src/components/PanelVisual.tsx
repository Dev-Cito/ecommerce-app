"use client";
import { motion, useReducedMotion } from "motion/react";
import { Store } from "lucide-react";

export function PanelVisual() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="relative h-full w-full overflow-hidden bg-[linear-gradient(135deg,#1a1030_0%,var(--ink)_45%,#06212a_100%)]"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#7C3AED22 1px, transparent 1px), linear-gradient(90deg, #22D3EE18 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, #000 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, #000 40%, transparent 80%)",
        }}
      />

      <div
        className="absolute -left-20 -top-20 h-[380px] w-[380px] rounded-none blur-[40px]"
        style={{ background: "radial-gradient(circle, #7C3AED66, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-24 -right-24 h-[420px] w-[420px] rounded-none blur-[50px]"
        style={{ background: "radial-gradient(circle, #22D3EE44, transparent 70%)" }}
      />

      <div
        className="absolute left-0 right-0 top-0 h-[2px] opacity-70"
        style={{
          background: "linear-gradient(90deg, transparent, var(--cyan), var(--violet), transparent)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[22px]">
        <div className="relative">
          <div
            className="absolute -inset-[30px] rounded-none blur-[24px]"
            style={{ background: "radial-gradient(circle, #A855F7aa, transparent 70%)" }}
          />
          <motion.div
            animate={{ rotate: shouldReduceMotion ? 0 : 360 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 8, repeat: Infinity, ease: "linear" }}
            className="relative grid h-24 w-24 place-items-center rounded-none shadow-[0_20px_60px_-15px_var(--violet)]"
            style={{ background: "linear-gradient(135deg, var(--violet), var(--cyan))" }}
          >
            <Store size={52} color="#fff" />
          </motion.div>
        </div>

        <p
          className="font-display text-[clamp(40px,7vw,72px)] font-bold leading-none tracking-[-0.02em] text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(120deg, var(--cloud) 20%, var(--violet-bright) 55%, var(--cyan) 90%)",
          }}
        >
          Ku&apos;isoko
        </p>

        <p className="font-mono text-[13px] uppercase tracking-[0.35em] text-muted">Powered by Stripe</p>
      </div>
    </div>
  );
}
