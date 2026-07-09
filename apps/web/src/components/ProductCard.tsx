"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useMotionTemplate } from "motion/react";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { eur, presentationFor } from "@/lib/products";
import { fireEmojiBurst } from "@/lib/emojiBurst";
import { useCart } from "@/store/cart";

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [variantIdx, setVariantIdx] = useState(0);
  const addItem = useCart((s) => s.addItem);
  const { icon: Icon, blurb } = presentationFor(product.name);

  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(340px circle at ${gx}% ${gy}%, rgba(124,58,237,0.22), transparent 60%)`;

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    gx.set(((e.clientX - r.left) / r.width) * 100);
    gy.set(((e.clientY - r.top) / r.height) * 100);
  };

  const variant = product.variants[variantIdx];
  const outOfStock = variant.stock < 1;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-none border border-line bg-surface p-6 transition-shadow duration-300 hover:shadow-[0_20px_60px_-20px_rgba(124,58,237,0.55)]"
    >
      <motion.div
        aria-hidden
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-90"
      />
      <div className="relative mb-5 grid h-[132px] place-items-center rounded-none border border-line bg-[linear-gradient(135deg,rgba(124,58,237,0.13),rgba(34,211,238,0.09))]">
        <div className="absolute h-[90px] w-[90px] rounded-none blur-[8px] bg-[radial-gradient(circle,rgba(34,211,238,0.33),transparent_70%)] transition-transform duration-500 group-hover:scale-125" />
        <Icon
          size={52}
          strokeWidth={1.4}
          className="relative text-cloud transition-transform duration-500 group-hover:-rotate-[4deg] group-hover:scale-[1.08]"
        />
      </div>
      <h3 className="relative font-display text-xl font-semibold text-cloud">{product.name}</h3>
      <p className="relative mt-1.5 mb-4 text-sm text-muted">{blurb || product.description}</p>
      {product.variants.length > 1 && (
        <select
          value={variantIdx}
          onChange={(e) => setVariantIdx(Number(e.target.value))}
          className="relative mb-3.5 w-full cursor-pointer appearance-none rounded-none border border-line bg-surface-2 px-3 py-2.5 text-sm text-cloud outline-none focus-visible:ring-2 focus-visible:ring-violet"
        >
          {product.variants.map((v, i) => (
            <option key={v.id} value={i}>
              {v.name}
            </option>
          ))}
        </select>
      )}
      <div className="relative flex items-center justify-between gap-3">
        <span className="font-mono text-lg font-bold text-cloud">{eur(variant.priceCents)}</span>
        <motion.button
          whileTap={{ scale: 0.94 }}
          disabled={outOfStock}
          onPointerDown={(e) => fireEmojiBurst(e.currentTarget)}
          onClick={() =>
            addItem({
              variantId: variant.id,
              productName: product.name,
              variantName: variant.name,
              unitPriceCents: variant.priceCents,
              currency: variant.currency,
            })
          }
          className="inline-flex items-center gap-2 rounded-none border-none px-[18px] py-2.5 text-sm font-semibold text-white bg-[linear-gradient(135deg,var(--violet),var(--violet-bright))] shadow-[0_8px_24px_-8px_var(--violet)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          <Plus size={16} strokeWidth={2.5} /> {outOfStock ? "Out of stock" : "Add"}
        </motion.button>
      </div>
    </motion.div>
  );
}
