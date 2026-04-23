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
      className={`${cormorant.variable} ${dmSans.variable} bg-[#FEFCF9] text-stone-900 overflow-x-hidden`}
      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
    >
      <Navbar />
      <main>{children}</main>
    </div>
  );
}