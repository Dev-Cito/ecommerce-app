"use client";
import React, { useRef, useEffect } from "react";
import { useTransform, useMotionValue, useSpring, motion } from "motion/react";

export function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawProgress = useMotionValue(0);
  const scrollYProgress = useSpring(rawProgress, { stiffness: 300, damping: 40, mass: 0.5 });
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Manual scroll-progress tracking instead of Motion's useScroll({ target }) —
  // that hook silently never updated on at least one real mobile browser (values
  // stayed frozen at 0 no matter how far the user scrolled). This replicates its
  // default ["start start", "end end"] semantics with plain scroll/resize
  // listeners and getBoundingClientRect. The raw value is rAF-throttled (so we
  // never do more than one layout read per frame) and fed through a spring
  // (below) so the tilt eases smoothly instead of snapping to each scroll event.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let frame = 0;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const total = rect.height - viewportHeight;
      if (total <= 0) {
        rawProgress.set(rect.top <= 0 ? 1 : 0);
        return;
      }
      const scrolled = -rect.top;
      rawProgress.set(Math.min(1, Math.max(0, scrolled / total)));
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [rawProgress]);

  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} className="relative flex h-[45rem] items-center justify-center p-2 md:h-[60rem] md:p-20">
      <div
        className="relative w-full py-10 md:py-40"
        style={{
          perspective: "1000px",
          WebkitPerspective: "1000px",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
      >
        <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl text-center">
          {titleComponent}
        </motion.div>
        <motion.div
          style={{
            rotateX: rotate,
            scale,
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            willChange: "transform",
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
          }}
          className="mx-auto -mt-12 h-[30rem] w-full max-w-5xl rounded-none border-4 border-line bg-surface p-2 shadow-2xl md:h-[40rem] md:p-6"
        >
          <div className="h-full w-full overflow-hidden rounded-none bg-ink md:p-4">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
