import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/landing";

export function FooterSection() {
  return (
    <footer className="bg-[#0F0C0B] px-[8vw] pt-12 pb-8 border-t border-white/5">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-7 border-b border-white/5 mb-6">
        <div>
          <div className="font-serif text-[20px] font-bold text-white">
            Manajemen OnCall Indonesia
          </div>
          <div className="text-[12px] text-white/30 tracking-[0.06em] mt-1 uppercase">
            Autentik · Higienis · Profesional · Sejak 2017
          </div>
        </div>
        <nav className="grid grid-cols-3 md:flex md:flex-wrap gap-x-6 gap-y-3 w-full sm:w-max md:w-auto justify-items-start">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] text-white/40 hover:text-white/80 no-underline transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom row */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-[13px] text-white/20">
          © {new Date().getFullYear()} Manajemen OnCall Indonesia. Seluruh hak
          cipta dilindungi.
        </p>
        <p className="text-[13px] text-amber-400/60">
          Made with ❤️ for Indonesian Culinary Heritage
        </p>
      </div>
    </footer>
  );
}
