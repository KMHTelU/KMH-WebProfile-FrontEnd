import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

// ── Reveal: fade + slide-in saat masuk viewport (transisi antar-section) ──
interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "article";
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

// ── BlurText: headline muncul per-kata dengan blur+fade (ala react-bits) ──
interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "span" | "p";
}

export function BlurText({ text, className, delay = 0, as = "span" }: BlurTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const Tag = as;

  if (reduce) return <Tag className={className}>{text}</Tag>;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
  };
  const child: Variants = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 12 },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <Tag className={className}>
      <motion.span
        style={{ display: "inline" }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={child}
            style={{ display: "inline-block", willChange: "transform, filter" }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

// ── CountUp: angka menghitung naik saat masuk viewport (ala react-bits) ──
interface CountUpProps {
  to: number;
  from?: number;
  /** durasi animasi (detik) */
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 1.6,
  className,
  prefix = "",
  suffix = "",
}: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(reduce ? to : from);
  const started = useRef(false);

  useEffect(() => {
    // Bila animasi sudah pernah jalan lalu target berubah (data API masuk), snap ke nilai baru.
    if (started.current || reduce) {
      setValue(to);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setValue(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / (duration * 1000), 1);
              const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
              setValue(Math.round(from + (to - from) * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, from, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

// ── GradientText: teks dengan gradien bergerak (ala react-bits, murni CSS) ──
interface GradientTextProps {
  children: ReactNode;
  className?: string;
  /** warna-warna gradien (minimal 2). Warna pertama diulang di akhir untuk loop mulus. */
  colors?: string[];
  /** jeda mulai animasi reveal (detik). */
  delay?: number;
}

export function GradientText({
  children,
  className = "",
  colors = ["#fbbf24", "#f59e0b", "#fbbf24"],
  delay = 0,
}: GradientTextProps) {
  const reduce = useReducedMotion();
  // PENTING: elemen ini memakai background-clip:text. Jangan menaruh anak ber-`filter`
  // (mis. BlurText) di dalamnya — filter merusak area clip sehingga teks jadi transparan.
  const style: React.CSSProperties = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
  };

  if (reduce) {
    return (
      <span className={`kmh-gradient-text ${className}`} style={style}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={`kmh-gradient-text ${className}`}
      style={{ ...style, display: "inline-block", willChange: "transform" }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}

// ── Aurora: latar gradien lembut yang bergerak halus (khusus hero) ──
export function Aurora({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  const blobs = [
    { c: "rgba(251,191,36,0.35)", x: "-10%", y: "0%", s: 520 },
    { c: "rgba(217,119,6,0.30)", x: "60%", y: "10%", s: 480 },
    { c: "rgba(180,83,9,0.25)", x: "25%", y: "55%", s: 560 },
  ];

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            borderRadius: "9999px",
            background: `radial-gradient(circle at center, ${b.c}, transparent 70%)`,
            filter: "blur(40px)",
          }}
          animate={
            reduce
              ? undefined
              : { x: [0, 30, -20, 0], y: [0, -25, 20, 0], scale: [1, 1.08, 0.96, 1] }
          }
          transition={
            reduce
              ? undefined
              : { duration: 16 + i * 4, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}
