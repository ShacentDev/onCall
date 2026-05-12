"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
            src="/images/images.jpg"
            alt="OnCall Logos"
            width={50}
            height={50}
          />
        </div>
        <div className="leading-tight">
          <div className="font-bold text-[17px] text-stone-900 font-serif tracking-tight">
            Internal System
          </div>
          <div className="text-[11px] text-stone-500 uppercase tracking-widest font-medium">
            RS Premier Bintaro
          </div>
        </div>
      </Link>
    </nav>
  );
}
