"use client";
import { useEffect, useRef } from "react";
import { EMOJI_BURST_EVENT, type EmojiBurstDetail } from "@/lib/emojiBurst";

const EMOJIS = "🎉,✨,😄,🔥,💥,⭐,💖,🤩,👍,🥳,🎊,😎";
const BURST_COUNT = 16;
const POWER = 12;
const SPREAD = 55;
const GRAVITY = 4 * 0.15;
const EMOJI_SIZE = 20;
const MAX_PARTICLES = 140;

interface Particle {
  el: HTMLSpanElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  size: number;
  life: number;
}

export function EmojiBurstLayer() {
  const layerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  // Ref-based trampoline: requestAnimationFrame needs to call the latest version
  // of `step` recursively without `step` referencing its own not-yet-stable
  // useCallback identity (flagged by react-hooks/immutability).
  const stepRef = useRef<(ts: number) => void>(() => {});

  useEffect(() => {
    stepRef.current = (ts: number) => {
      const arr = particlesRef.current;
      let dt = lastTsRef.current ? (ts - lastTsRef.current) / 16.6667 : 1;
      lastTsRef.current = ts;
      if (dt > 3) dt = 3;

      const W = window.innerWidth;
      const H = window.innerHeight;

      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i];
        p.vy += GRAVITY * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vrot * dt;
        p.life -= dt;
        if (p.life <= 0 || p.y > H + p.size * 2.5 || p.x < -p.size * 3 || p.x > W + p.size * 3) {
          p.el.remove();
          arr.splice(i, 1);
          continue;
        }
        const fade = p.life < 22 ? Math.max(0, p.life / 22) : 1;
        p.el.style.opacity = String(fade);
        p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`;
      }

      if (arr.length > 0) {
        rafRef.current = requestAnimationFrame((t) => stepRef.current(t));
      } else {
        rafRef.current = 0;
        lastTsRef.current = 0;
      }
    };
  });

  useEffect(() => {
    const handleBurst = (e: Event) => {
      const layer = layerRef.current;
      if (!layer) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const { x: ox, y: oy } = (e as CustomEvent<EmojiBurstDetail>).detail;
      const list = EMOJIS.split(/[,\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const arr = particlesRef.current;

      for (let k = 0; k < BURST_COUNT; k++) {
        if (arr.length >= MAX_PARTICLES) break;
        const el = document.createElement("span");
        el.textContent = list[(Math.random() * list.length) | 0];
        el.style.position = "fixed";
        el.style.left = "0px";
        el.style.top = "0px";
        el.style.fontSize = `${EMOJI_SIZE}px`;
        el.style.lineHeight = "1";
        el.style.willChange = "transform, opacity";
        el.style.pointerEvents = "none";
        el.style.userSelect = "none";
        el.setAttribute("aria-hidden", "true");
        layer.appendChild(el);

        const ang = ((-90 + (Math.random() * 2 - 1) * SPREAD) * Math.PI) / 180;
        const speed = POWER * (0.65 + Math.random() * 0.8);
        arr.push({
          el,
          x: ox - EMOJI_SIZE / 2,
          y: oy - EMOJI_SIZE / 2,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          rot: Math.random() * 360,
          vrot: (Math.random() * 2 - 1) * 14,
          size: EMOJI_SIZE,
          life: 260,
        });
      }

      if (!rafRef.current) {
        lastTsRef.current = 0;
        rafRef.current = requestAnimationFrame((t) => stepRef.current(t));
      }
    };

    window.addEventListener(EMOJI_BURST_EVENT, handleBurst);
    return () => window.removeEventListener(EMOJI_BURST_EVENT, handleBurst);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      for (const p of particlesRef.current) p.el.remove();
      particlesRef.current = [];
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}
    />
  );
}
