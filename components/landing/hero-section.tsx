"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { STATS, WHATSAPP_URL } from "@/lib/landing";
import { StatItem } from "./stat-item";

// ── CSS keyframes – injected via <style dangerouslySetInnerHTML> (App Router safe) ──
const KEYFRAMES = `
  @keyframes hero-spin  { to { transform: rotate(360deg); } }
  @keyframes hero-gradient-shift {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  @keyframes hero-float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
  @keyframes hero-pulse { 0%,100% { box-shadow: 0 0 8px rgba(74,222,128,0.8); } 50% { box-shadow: 0 0 18px rgba(74,222,128,1); } }
`;

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

export function HeroSection() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <section
        aria-label="Andrawina Kuliner Indonesia – Jajanan Pasar dan Snack Box Premium Jabodetabek"
        className="relative min-h-[100svh] grid grid-cols-1 lg:grid-cols-2 pt-[72px] overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1a0a04 0%, #2c1008 45%, #1f0b05 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute"
            style={{
              top: "-15%",
              right: "-10%",
              width: "70vw",
              height: "70vw",
              maxWidth: 800,
              maxHeight: 800,
              background:
                "radial-gradient(circle, rgba(192,24,31,0.35) 0%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />
          {/* Amber glow – bottom left */}
          <div
            className="absolute"
            style={{
              bottom: "-5%",
              left: "-5%",
              width: "50vw",
              height: "50vw",
              maxWidth: 600,
              maxHeight: 600,
              background:
                "radial-gradient(circle, rgba(201,100,30,0.20) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />
          {/* Grain texture */}
          <div
            className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
            style={{
              backgroundImage: GRAIN_SVG,
              backgroundSize: "200px 200px",
            }}
          />
        </div>

        <div
          className="absolute inset-y-0 right-0 w-[-35%] pointer-events-none z-[2]"
          style={{
            background: `
              linear-gradient(
                to left,
                rgba(10,5,3,0.9) 0%,
                rgba(10,5,3,0.6) 40%,
                rgba(10,5,3,0.2) 70%,
                transparent 100%
              )
            `,
          }}
        />

        {/* ── Left column: Copy ── */}
        <div className="relative z-10 flex flex-col justify-center px-[8vw] lg:px-[7vw] py-16 lg:py-0">
          {/* H1 – primary SEO keyword */}
          <h1
            className="font-serif font-black leading-[1.03] text-white mb-7"
            style={{
              fontSize: "clamp(25px, 5.5vw, 50px)",
              letterSpacing: "-0.02em",
            }}
          >
            Cita Rasa{" "}
            <span className="relative inline-block">
              <em
                className="not-italic"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, #ff6b6b, #c0181f, #ff8c42, #c0181f, #ff6b6b)",
                  backgroundSize: "200% auto",
                  backgroundPosition: "0% 50%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "hero-gradient-shift 6s linear infinite",
                }}
              >
                Profesional
              </em>
              <span
                className="absolute left-0 -bottom-1 h-[3px] w-full rounded-full"
                style={{
                  background: `
  radial-gradient(circle at 70% 40%, rgba(192,24,31,0.25) 0%, transparent 60%),
  radial-gradient(circle at 20% 80%, rgba(255,120,60,0.15) 0%, transparent 60%),
  linear-gradient(160deg, #1a0a04 0%, #2a0f07 50%, #1a0a04 100%)
`,
                }}
              />
            </span>
            <br />
            <span className="text-stone-300">untuk Momen</span>
            <br />
            <span className="text-white">Berkesan.</span>
          </h1>

          <p
            className="
    text-stone-400
    leading-[1.7] sm:leading-[1.85]
    mb-8 sm:mb-10
    max-w-[320px] sm:max-w-[600px]
    tracking-[0.01em]
  "
            style={{ fontSize: "clamp(14px, 1.1vw, 17px)" }}
          >
            <span className="sm:hidden">
              Snack box premium & jajanan pasar higienis untuk momen Anda —
              Acara kantor, hajatan, maupun event lainnya di Jabodetabek.
            </span>

            <span className="hidden sm:inline">
              Snack box premium dan jajanan pasar autentik Nusantara untuk momen
              Anda — acara kantor, hajatan, dan event di Jabodetabek, diproduksi
              higienis, konsisten, dan siap menghadirkan pengalaman kuliner yang
              berkesan.
            </span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-14">
            <Button
              asChild
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold
                         shadow-[0_0_0_1px_rgba(192,24,31,0.5),0_8px_32px_rgba(192,24,31,0.4)]
                         hover:shadow-[0_0_0_1px_rgba(192,24,31,0.7),0_12px_40px_rgba(192,24,31,0.5)]
                         hover:-translate-y-0.5 transition-all duration-300 rounded-full px-8 h-12"
            >
              <Link
                href={`${WHATSAPP_URL}?text=Halo, saya ingin pesan snack box untuk acara kantor saya.`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pesan snack box Andrawina via WhatsApp"
              >
                <span className="mr-2" aria-hidden="true">
                  🛒
                </span>
                Pesan Sekarang
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-stone-300 hover:text-white hover:bg-white/10 border border-white/15
                         hover:border-white/30 transition-all duration-300 rounded-full px-8 h-12
                         backdrop-blur-sm"
            >
              <Link href="#paket" aria-label="Lihat paket snack box Andrawina">
                Lihat Paket →
              </Link>
            </Button>
          </div>

          <Separator className="mb-10 bg-white/10" />

          <div className="grid grid-cols-3 gap-x-4 gap-y-6">
            {STATS.map((s) => (
              <StatItem key={s.label} {...s} />
            ))}
          </div>
        </div>

        <div
          className="relative hidden lg:flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute"
            style={{
              width: "75%",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 40% 50%, rgba(192,24,31,0.18) 0%, rgba(100,10,10,0.08) 60%, transparent 100%)",
              border: "1px solid rgba(192,24,31,0.12)",
            }}
          />

          <div className="relative z-10 w-[85%] max-w-[560px]">
            <Image
              src="/images/hero-fix.png"
              alt="Produk jajanan pasar Andrawina Kuliner Indonesia – snack box premium untuk acara di Jabodetabek"
              width={600}
              height={600}
              className="object-contain"
              style={{
                filter:
                  "drop-shadow(0 32px 80px rgba(192,24,31,0.35)) drop-shadow(0 0 60px rgba(255,120,60,0.15))",
              }}
              priority
              fetchPriority="high"
            />
          </div>

          {/* Floating badge – founding year */}
          <div
            className="absolute top-[22%] right-[8%] z-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3.5 shadow-xl"
            style={{ animation: "hero-float 4s ease-in-out infinite" }}
          >
            <div className="text-[11px] text-stone-400 uppercase tracking-widest mb-1">
              Berdiri Sejak
            </div>
            <div className="font-serif text-3xl font-black text-white leading-none">
              2017
            </div>
          </div>

          {/* Floating badge – coverage */}
          <div
            className="absolute bottom-[22%] right-[8%] z-20 bg-red-600/20 backdrop-blur-md border border-red-500/30 rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3"
            style={{ animation: "hero-float 4s ease-in-out 2s infinite" }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full bg-green-400 flex-shrink-0"
              style={{ animation: "hero-pulse 2s ease-in-out infinite" }}
            />
            <div>
              <div className="text-[11px] text-stone-300 leading-none">
                Min. 20 pax
              </div>
              <div className="text-[12px] font-semibold text-white mt-0.5">
                Seluruh Jabodetabek
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
