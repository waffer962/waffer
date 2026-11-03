import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://waffer.jo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "وفّـر | Waffer - منصة فائض الطعام وعروض التوفير في الأردن 🇯🇴",
    template: "%s | وفّـر Waffer",
  },
  description:
    "وفّر (Waffer Jordan) المنصة الأردنية الرائدة لتوفير نفقات الطعام وشراء الفائض اليومي الطازج من المخابز والمطاعم بنصف السعر أو الحصول على وجبات مجانية. احجز وجبتك واستلمها كاش.",
  keywords: [
    "وفر",
    "وفّر",
    "waffer",
    "منصة وفر",
    "تطبيق وفر",
    "وفر جو",
    "waffer jordan",
    "فائض الطعام",
    "عروض مطاعم الأردن",
    "عروض مطاعم عمان",
    "توفير نفقات الطعام",
    "وجبات مخفضة",
    "وجبات مجانية",
    "إطعام طعام",
    "مخابز عمان",
    "طعام رخيص الأردن",
    "وفرة"
  ],
  authors: [{ name: "منصة وفّـر | Waffer" }],
  creator: "منصة وفّـر",
  publisher: "وفّـر Waffer",
  applicationName: "وفّـر",
  category: "Food & Drink",
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_JO",
    url: siteUrl,
    title: "وفّـر (Waffer) | المنصة الأولى لتوفير الطعام في الأردن 🇯🇴",
    description:
      "وفر نفقاتك واشترِ فائض وجبات المخابز والمطاعم الطازجة بنصف السعر أو احصل على وجبات مجانية. استلام فوري ودفع كاش.",
    siteName: "منصة وفّـر - Waffer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "منصة وفّـر - Waffer لتوفير الطعام في الأردن",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "وفّـر (Waffer) | المنصة الأولى لتوفير الطعام في الأردن 🇯🇴",
    description:
      "وفر نفقاتك اليومية واشترِ فائض الطعام من مخابز ومطاعم الأردن بنصف السعر أو احصل على وجبات مجانية.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "وفّـر | Waffer",
        alternateName: ["منصة وفر", "وفر الأردن", "تطبيق وفر", "Waffer Jordan", "وفّر"],
        description:
          "المنصة الأردنية الأولى للحد من هدر الطعام وشراء الفائض الطازج بنصف السعر أو الحصول على وجبات مجانية",
        inLanguage: "ar-JO",
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "منصة وفّـر - Waffer",
        alternateName: "وفّر",
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        description:
          "منصة تكنولوجية أردنية تربط بين المخابز والمطاعم والزبائن للاستفادة من فائض الطعام اليومي وتوفير نفقات الوجبات.",
        areaServed: {
          "@type": "Country",
          name: "الأردن",
        },
      },
    ],
  };

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased font-sans`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
