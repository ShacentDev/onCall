import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Navbar } from "@/components/landing/navbar";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${cormorant.variable} ${dmSans.variable} text-stone-900`}
      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
    >
      <Navbar />

      {/* 🔥 FIX FINAL: kasih offset + container SEKALI doang */}
      <main className="pt-24">
        <div className="max-w-8xl mx-auto py-4 px-4 md:px-2 lg:px-2">
          {children}
        </div>
      </main>
    </div>
  );
}