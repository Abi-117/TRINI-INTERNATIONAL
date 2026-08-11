import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useMemo } from "react";

import heroImg from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";

const chips = ["RC Cars", "Jewellery", "Bags", "Gadgets", "Drones", "Stationery"];

const stats = [
  { value: "12+", label: "Premium categories" },
  { value: "3 to Adult", label: "Age range" },
  { value: "Same Day", label: "Dispatch" },
  { value: "Pan India", label: "Delivery" },
];

function Particles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 2 + ((i * 7) % 4),
        duration: 6 + ((i * 3) % 9),
        delay: (i % 8) * 0.6,
      })),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-primary/60"
          style={{ left: d.left, top: d.top, width: d.size, height: d.size }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <img
        src={heroImg}
        alt="Premium imported RC drift car, drone, jewellery and designer bag lit with neon studio lighting"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset backdrop-blur-[1px]" />
<div className="absolute inset-0 bg-veil opacity-25" />
      <div className="absolute -left-40 top-1/4 size-[34rem] rounded-full bg-cyan/10 blur-[150px]" />
<div className="absolute -right-40 bottom-0 size-[34rem] rounded-full bg-yellow-300/10 blur-[150px]" />
      <Particles />

      <div className="container-x relative z-10 py-28">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-700 shadow-lg backdrop-blur">
            <Sparkles className="size-3.5" /> Premium Lifestyle Store · Trichy
          </span>

<h1 className="mt-7 text-[clamp(2.6rem,7vw,5.2rem)] font-bold leading-[0.98] text-gray-900">
              <span className="text-white">Imported Lifestyle</span>
           <span className="block bg-gold bg-clip-text text-transparent">
  Products, Elevated.
</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
            RC &amp; drift cars, drones, gel blasters, licensed die cast, soft toys, Korean stationery,
            fashion jewellery, bags and gadgets — genuine, hand-picked and dispatched the same day.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <motion.span
                key={c}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:shadow-md transition"
              >
                {c}
              </motion.span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/shop">
                Shop Now <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="glass" size="lg" asChild>
              <Link to="/collections">Explore Collections</Link>
            </Button>
          </div>

          <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <dt className="font-display text-2xl font-bold text-gold">{s.value}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  {s.label}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="absolute left-1/2 top-2 size-1.5 -translate-x-1/2 rounded-full bg-yellow-500"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        <motion.span
          className="absolute left-1/2 top-2 size-1.5 -translate-x-1/2 rounded-full bg-primary"
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
