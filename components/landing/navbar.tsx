"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, WHATSAPP_URL } from "@/lib/landing";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[6vw] h-[72px]",
        "bg-[#FEFCF9]/90 backdrop-blur-xl border-b border-red-600/10",
        "transition-all duration-300",
        scrolled && "shadow-[0_4px_30px_rgba(0,0,0,0.07)]",
      )}
    >
      <Link href="/" className="flex items-center gap-3 no-underline">
        <div className="w-[38px] h-[38px] bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl font-serif flex-shrink-0">
          <Image
            src="/images/logo-fix.png"
            alt="Andrawina Logos"
            width={50}
            height={50}
          />
        </div>
        <div className="leading-tight">
          <div className="font-bold text-[17px] text-stone-900 font-serif tracking-tight">
            Andrawina
          </div>
          <div className="text-[11px] text-stone-500 uppercase tracking-widest font-medium">
            Kuliner Indonesia
          </div>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-9">
        {NAV_LINKS.map((link) => {
          const isHash = link.href.startsWith("#");

          return (
            <button
              key={link.href}
              suppressHydrationWarning
              onClick={() => {
                if (isHash) {
                  if (pathname === "/") {
                    const el = document.querySelector(link.href);
                    el?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    router.push(`/${link.href}`);
                  }
                } else {
                  router.push(link.href);
                }
              }}
              className={cn(
                "text-sm font-medium text-stone-700 relative",
                "after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-[1.5px] after:bg-red-600",
                "after:scale-x-0 after:origin-left after:transition-transform after:duration-300",
                "hover:text-red-600 hover:after:scale-x-100",
                "cursor-pointer",
              )}
            >
              {link.label}
            </button>
          );
        })}
        <Button
          asChild
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold tracking-wide shadow-none"
        >
          <Link
            href={`${WHATSAPP_URL}?text=Halo, saya ingin pesan snack box`}
            target="_blank"
          >
            Pesan Sekarang
          </Link>
        </Button>
      </div>
    </nav>
  );
}
