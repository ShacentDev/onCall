import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import Loading from "@/components/loading";
import { SWRProvider } from "@/lib/swr-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.WEBSITE_URL || "https://www.andrawinakuliner.com";
const SITE_NAME = "Andrawina Kuliner Indonesia";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Andrawina Kuliner Indonesia | Catering & Snack Box Tradisional Sejak 2017",
    template: "%s | Andrawina Kuliner Indonesia",
  },

  description:
    "Andrawina Kuliner Indonesia telah beroperasi sejak 2017 sebagai penyedia layanan katering profesional yang menghadirkan beragam pilihan snack box, hidangan kuliner, dan jajanan khas Nusantara dengan cita rasa autentik. Berpengalaman melayani ratusan kebutuhan acara, mulai dari kegiatan korporat, pernikahan, hingga berbagai gathering eksklusif. Kami berkomitmen menghadirkan kualitas terbaik, layanan yang andal, serta pengalaman kuliner yang berkesan di setiap kesempatan. Tersedia layanan pengiriman untuk area Jabodetabek.",

  keywords: [
    "catering Jakarta",
    "jajanan nusantara",
    "risol mayo tangsel",
    "dimsum tangsel",
    "snackbox murah",
    "snackbox terjangkau",
    "snack box Jakarta",
    "nasi box Jakarta",
    "catering pernikahan",
    "catering kantor",
    "catering Jabodetabek",
    "catering tradisional Indonesia",
    "snack box murah Jakarta",
    "catering gathering",
    "Andrawina Kuliner",
    "catering hajatan",
    "nasi kotak murah",
    "catering profesional Jakarta",
    "kuliner tradisional Indonesia",
    "catering halal Jakarta",
  ],

  authors: [{ name: "Andrawina Kuliner Indonesia", url: SITE_URL }],
  creator: "Andrawina Kuliner Indonesia",
  publisher: "Andrawina Kuliner Indonesia",

  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
    },
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title:
      "Andrawina Kuliner Indonesia | Catering & Snack Box Tradisional Sejak 2017",
    description:
      "Catering, snack box, dan nasi box tradisional dengan standar modern dan cita rasa autentik Nusantara. Melayani ratusan acara sejak 2017. Pesan untuk Jabodetabek.",
    images: [
      {
        url: "/images/og-image.jpg", // Buat gambar 1200x630px yang menarik
        width: 1200,
        height: 630,
        alt: "Andrawina Kuliner Indonesia - Catering & Snack Box Tradisional",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Andrawina Kuliner Indonesia | Catering & Snack Box Tradisional Sejak 2017",
    description:
      "Catering, snack box, dan nasi box tradisional dengan standar modern. Melayani ratusan acara sejak 2017 untuk Jabodetabek.",
    images: ["/images/og-image.jpg"],
    creator: "@andrawinakuliner",
  },

  icons: {
    icon: [
      { url: "/favicon-196.png", sizes: "196x196", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon-180.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ─── Verification (isi setelah verifikasi di Google Search Console) ────────────
  // verification: {
  //   google: "GOOGLE_VERIFICATION_CODE",
  //   yandex: "YANDEX_CODE",
  // },

  category: "catering",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Andrawina Kuliner",
    startupImage: [
      {
        url: "/apple-splash-2048-2732.jpg",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-2732-2048.jpg",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "/apple-splash-1668-2388.jpg",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-2388-1668.jpg",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "/apple-splash-1290-2796.jpg",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-2796-1290.jpg",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "/apple-splash-1179-2556.jpg",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-2556-1179.jpg",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "/apple-splash-1170-2532.jpg",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-2532-1170.jpg",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "/apple-splash-750-1334.jpg",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-1334-750.jpg",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#DC2626" },
    { media: "(prefers-color-scheme: dark)", color: "#DC2626" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["FoodEstablishment", "LocalBusiness"],
        "@id": `${SITE_URL}/#business`,
        name: "Andrawina Kuliner Indonesia",
        alternateName: "Andrawina Kuliner",
        description:
          "Catering, snack box, dan nasi box tradisional Indonesia dengan cita rasa autentik dan standar produksi modern. Melayani berbagai acara sejak 2017.",
        url: SITE_URL,
        telephone: "+62-814-0071-5402",
        email: "andrawinakulinerindonesia1@gmail.com",
        foundingDate: "2017",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/images/logo-fix.png`,
          width: 200,
          height: 200,
        },
        image: `${SITE_URL}/images/og-image.jpg`,
        priceRange: "$$",
        servesCuisine: ["Indonesian", "Traditional Indonesian", "Nusantara"],
        hasMenu: `${SITE_URL}/produk`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Jakarta",
          addressRegion: "DKI Jakarta",
          addressCountry: "ID",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -6.3275468,
          longitude: 106.7542912,
        },
        areaServed: [
          { "@type": "City", name: "Jakarta" },
          { "@type": "City", name: "Bogor" },
          { "@type": "City", name: "Depok" },
          { "@type": "City", name: "Tangerang" },
          { "@type": "City", name: "Bekasi" },
          { "@type": "City", name: "Tangerang Selatan" },
        ],
        sameAs: [
          "https://www.instagram.com/andrawinakuliner",
          "https://www.facebook.com/andrawinakuliner",
          "https://www.tokopedia.com/andrawinakuliner",
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "08:00",
            closes: "21:00",
          },
        ],
      },
      // ── WebSite ─────────────────────────────────────────────────────────────
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: "Catering & Snack Box Tradisional Indonesia Sejak 2017",
        publisher: { "@id": `${SITE_URL}/#business` },
        inLanguage: "id-ID",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/produk?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SWRProvider>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </SWRProvider>
        <Toaster richColors theme="light" />
      </body>
    </html>
  );
}
