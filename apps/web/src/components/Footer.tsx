"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Phone, ExternalLink, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKEDIN_URL = "https://www.linkedin.com/in/francois-mpangirwa/";

function TextHoverEffect({ text, duration }: { text: string; duration?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  // Devices without real mouse hover (touchscreens) can never trigger onMouseEnter,
  // so the reveal would otherwise never appear — treat those as always-revealed.
  // Narrow viewports get the same treatment: a desktop browser resized to a phone
  // width (dev tools device emulation, etc.) still reports real hover support, so
  // width is checked independently rather than relying on hover capability alone.
  const [supportsHover, setSupportsHover] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(max-width: 768px)").matches,
  );

  useEffect(() => {
    const hoverMql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateHover = () => setSupportsHover(hoverMql.matches);
    hoverMql.addEventListener("change", updateHover);

    const widthMql = window.matchMedia("(max-width: 768px)");
    const updateWidth = () => setIsNarrow(widthMql.matches);
    widthMql.addEventListener("change", updateWidth);

    return () => {
      hoverMql.removeEventListener("change", updateHover);
      widthMql.removeEventListener("change", updateWidth);
    };
  }, []);

  const revealed = hovered || !supportsHover || isNarrow;

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({ cx: `${cxPercentage}%`, cy: `${cyPercentage}%` });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="select-none"
    >
      <defs>
        <linearGradient id="textGradient" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="25%">
          {revealed && (
            <>
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#22D3EE" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r={supportsHover ? "20%" : "150%"}
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className={cn("fill-transparent stroke-line font-display text-7xl font-bold")}
        style={{ opacity: revealed ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent font-display text-7xl font-bold"
        stroke="#7C3AED99"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-display text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
}

function FooterBackgroundGradient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={{ background: "radial-gradient(125% 125% at 50% 10%, #0B0B1466 50%, #7C3AED33 100%)" }}
    />
  );
}

export function Footer() {
  return (
    <footer className="relative m-8 overflow-hidden rounded-none border border-line bg-surface/40">
      <FooterBackgroundGradient />

      <div className="relative z-10 mx-auto max-w-[1120px] px-6 pt-16">
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 font-display text-2xl font-bold text-cloud">
              <span className="grid h-[30px] w-[30px] place-items-center rounded-none bg-[linear-gradient(135deg,var(--violet),var(--cyan))]">
                <Store size={16} className="text-white" />
              </span>
              Ku&apos;isoko
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">
              A test storefront wired end-to-end with Stripe.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 md:contents">
            <div>
              <p className="mb-4 text-sm font-semibold text-cloud">Shop</p>
              <ul className="flex flex-col gap-2.5 text-sm text-muted">
                <li>
                  <Link href="/" className="transition-colors hover:text-violet">
                    Products
                  </Link>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-violet">
                    Cart
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-violet">
                    Checkout
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-4 text-sm font-semibold text-cloud">Contact</p>
              <ul className="flex flex-col gap-3 text-sm text-muted">
                <li>
                  <a
                    href="tel:+250791449816"
                    className="flex items-center gap-2 transition-colors hover:text-violet"
                  >
                    <Phone size={16} className="text-violet" />
                    +250 791 449 816
                  </a>
                </li>
                <li>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 transition-colors hover:text-violet"
                  >
                    <ExternalLink size={16} className="text-violet" />
                    François Mpangirwa
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-6 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} Ku&apos;isoko. All rights reserved.</p>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted transition-colors hover:text-violet"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      <div className="relative z-10 flex h-[30rem] -mt-52 -mb-36">
        <TextHoverEffect text="KU'ISOKO" />
      </div>
    </footer>
  );
}
