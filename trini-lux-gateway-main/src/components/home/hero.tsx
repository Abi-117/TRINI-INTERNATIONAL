import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Gem,
} from "lucide-react";
import { useMemo } from "react";

import heroImg from "@/assets/bg.png";
import { Button } from "@/components/ui/button";

const chips = [
  "RC Cars",
  "Drift Cars",
  "Gel Blasters",
  "Licensed Die Cast",
];

const stats = [
  {
    value: "12+",
    label: "Categories",
  },
  {
    value: "3+",
    label: "Age Range",
  },
  {
    value: "Same Day",
    label: "Dispatch",
  },
  {
    value: "Pan India",
    label: "Delivery",
  },
];

function Particles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: `${(i * 47) % 100}%`,
        top: `${(i * 61) % 100}%`,
        size: 2 + ((i * 3) % 3),
        duration: 8 + ((i * 2) % 6),
        delay: (i % 5) * 0.8,
      })),
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-amber-500/40"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.55, 0],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section
      className="
        relative
        flex
        min-h-[calc(100vh-88px)]
        items-center
        overflow-hidden
        bg-[#faf9f6]
      "
    >
      {/* =====================================================
          BACKGROUND IMAGE
      ===================================================== */}

      <img
        src={heroImg}
        alt="Premium RC cars, drift cars, gel blasters and licensed die cast"
        width={1920}
        height={1088}
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
        "
      />

      {/* =====================================================
          PREMIUM WHITE READABILITY LAYER
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-r
          from-white
          from-[0%]
          via-white/95
          via-[35%]
          via-white/55
          via-[55%]
          to-transparent
          to-[78%]
        "
      />

      {/* Very subtle bottom fade */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-24
          bg-gradient-to-t
          from-white/40
          to-transparent
        "
      />

      {/* =====================================================
          LUXURY GOLD GLOWS
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-48
          top-1/3
          size-[32rem]
          rounded-full
          bg-amber-300/10
          blur-[150px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-0
          bottom-0
          size-[30rem]
          rounded-full
          bg-yellow-300/10
          blur-[160px]
        "
      />

      <Particles />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          container-x
          relative
          z-10
          py-16
          sm:py-20
          lg:py-24
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            x: -35,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-[610px]"
        >
          {/* =================================================
              PREMIUM BADGE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
            }}
            className="
              inline-flex
              items-center
              gap-2.5
              rounded-full
              border
              border-amber-200
              bg-white/80
              px-4
              py-2
              shadow-[0_8px_30px_rgba(180,130,30,0.08)]
              backdrop-blur-xl
            "
          >
            <span
              className="
                flex
                size-7
                items-center
                justify-center
                rounded-full
                bg-gradient-to-br
                from-[#f7d774]
                via-[#dcae36]
                to-[#a87516]
                text-white
                shadow-sm
              "
            >
              <Sparkles className="size-3.5" />
            </span>

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#8a6419]
                sm:text-[11px]
              "
            >
              Premium Lifestyle Store · Trichy
            </span>
          </motion.div>

          {/* =================================================
              HEADING
          ================================================= */}

          <h1
            className="
              mt-7
              max-w-[800px]
              text-[clamp(2.9rem,6.5vw,5.5rem)]
              font-black
              leading-[0.92]
              tracking-[-0.045em]
              text-slate-950
            "
          >
            Imported Lifestyle
            <span
              className="
                mt-2
                block
                bg-gradient-to-r
                from-[#9a6b12]
                via-[#e0b83f]
                to-[#b57b15]
                bg-clip-text
                text-transparent
              "
            >
              Products, Elevated.
            </span>
          </h1>

          {/* =================================================
              GOLD LINE
          ================================================= */}

          <div className="mt-6 flex items-center gap-3">
            <span
              className="
                h-[2px]
                w-14
                rounded-full
                bg-gradient-to-r
                from-[#9a6b12]
                via-[#e0b83f]
                to-transparent
              "
            />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-slate-500
              "
            >
              Curated. Premium. Delivered.
            </span>
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p
            className="
              mt-6
              max-w-[530px]
              text-[15px]
              font-medium
              leading-7
              text-slate-600
              sm:text-base
              lg:text-lg
            "
          > 
            RC cars, high-speed drift cars, gel blasters,
            licensed die cast models and premium toys —
            handpicked for collectors, enthusiasts and
            everyday fun.
          </p>

          {/* =================================================
              CATEGORY PILLS
          ================================================= */}

          <div className="mt-7 flex flex-wrap gap-2">
            {chips.map((chip, index) => (
              <motion.span
                key={chip}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.42 + index * 0.07,
                }}
                whileHover={{
                  y: -3,
                }}
                className="
                  cursor-default
                  rounded-full
                  border
                  border-slate-200/90
                  bg-white/80
                  px-4
                  py-2
                  text-[11px]
                  font-bold
                  text-slate-700
                  shadow-[0_4px_18px_rgba(0,0,0,0.04)]
                  backdrop-blur-lg
                  transition-all
                  hover:border-amber-300
                  hover:text-[#956813]
                  hover:shadow-[0_8px_25px_rgba(190,145,45,0.12)]
                "
              >
                {chip}
              </motion.span>
            ))}
          </div>

          {/* =================================================
              CTA
          ================================================= */}

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              asChild
              className="
                group
                h-14
                rounded-full
                border-0
                bg-gradient-to-r
                from-[#b17b17]
                via-[#e1b63e]
                to-[#b17b17]
                px-8
                text-sm
                font-bold
                text-white
                shadow-[0_12px_30px_rgba(174,123,25,0.25)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_18px_40px_rgba(174,123,25,0.32)]
              "
            >
              <Link to="/shop">
                Shop Now

                <ArrowRight
                  className="
                    ml-1.5
                    size-4
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="
                h-14
                rounded-full
                border-slate-200
                bg-white/75
                px-7
                text-sm
                font-semibold
                text-slate-800
                shadow-sm
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-amber-300
                hover:bg-white
                hover:text-[#956813]
                hover:shadow-md
              "
            >
              <Link to="/collections">
                Explore Collections
              </Link>
            </Button>
          </div>

          {/* =================================================
              TRUST FEATURES
          ================================================= */}

          <div
            className="
              mt-9
              flex
              flex-wrap
              items-center
              gap-x-6
              gap-y-3
              border-t
              border-slate-200/70
              pt-6
            "
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#b28222]" />

              <span className="text-[11px] font-semibold text-slate-600">
                Genuine Products
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Truck className="size-4 text-[#b28222]" />

              <span className="text-[11px] font-semibold text-slate-600">
                Fast Dispatch
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Gem className="size-4 text-[#b28222]" />

              <span className="text-[11px] font-semibold text-slate-600">
                Premium Selection
              </span>
            </div>
          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <dl
            className="
              mt-8
              grid
              grid-cols-2
              overflow-hidden
              rounded-2xl
              border
              border-white/80
              bg-white/65
              shadow-[0_10px_35px_rgba(0,0,0,0.05)]
              backdrop-blur-xl
              sm:grid-cols-4
            "
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.7 + index * 0.1,
                }}
                className={`
                  px-4
                  py-4
                  sm:px-3
                  ${
                    index !== 0
                      ? "border-l border-slate-200/70"
                      : ""
                  }
                  ${
                    index > 1
                      ? "border-t border-slate-200/70 sm:border-t-0"
                      : ""
                  }
                `}
              >
                <dt
                  className="
                    text-lg
                    font-black
                    tracking-tight
                    text-[#a87516]
                    sm:text-xl
                  "
                >
                  {stat.value}
                </dt>

                <dd
                  className="
                    mt-0.5
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-slate-500
                  "
                >
                  {stat.label}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>

      {/* =====================================================
          FLOATING GOLD ACCENTS
      ===================================================== */}

      <motion.div
        aria-hidden
        className="
          pointer-events-none
          absolute
          right-[10%]
          top-[18%]
          hidden
          size-2
          rounded-full
          bg-[#d6a72f]
          shadow-[0_0_20px_rgba(214,167,47,0.5)]
          lg:block
        "
        animate={{
          scale: [0.7, 1.4, 0.7],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
        }}
      />

      <motion.div
        aria-hidden
        className="
          pointer-events-none
          absolute
          right-[22%]
          top-[28%]
          hidden
          size-1.5
          rounded-full
          bg-[#d6a72f]
          lg:block
        "
        animate={{
          y: [0, 18, 0],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
        }}
      />
    </section>
  );
}