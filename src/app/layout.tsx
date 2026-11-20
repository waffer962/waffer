import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wevo.click";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "وفر | Waffer - منصة فائض الطعام وعروض التوفير في الأردن",
    template: "%s | وفر Waffer Jordan",
  },
  description:
    "منصة وتطبيق وفر (Waffer Jordan) المنصة الأردنية الرائدة للحد من هدر الطعام وتوفير نفقات الوجبات. اشترِ فائض الوجبات الطازجة من المخابز والمطاعم بنصف السعر أو احصل على وجبات مجانية لوجه الله. استلام فوري ودفع كاش في عمان وكافة محافظات الأردن.",
  keywords: [
    "وفر",
    "وفّر",
    "Waffer",
    "Waffer Jordan",
    "وفر الأردن",
    "Waffer App",
    "تطبيق وفر",
    "منصة وفر",
    "فائض الطعام الأردن",
    "توفير نفقات الطعام",
    "عروض مطاعم الأردن",
    "عروض مطاعم عمان",
    "وجبات مخفضة",
    "وجبات مجانية",
    "طعام رخيص عمان",
    "مخابز عمان",
    "حفظ النعمة",
    "food waste jordan",
    "surplus food jordan",
    "wevo.click",
    "waffer.jo"
  ],
  authors: [{ name: "منصة وفّـر | Waffer Platform", url: siteUrl }],
  creator: "فريق تطوير وفّـر - Waffer Team",
  publisher: "وفّـر Waffer Jordan",
  applicationName: "Waffer App | تطبيق وفر",
  category: "Food & Drink, Sustainability, Shopping",
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "googlef637e3f155ba83d0",
  },
  openGraph: {
    type: "website",
    locale: "ar_JO",
    alternateLocale: ["en_US"],
    url: siteUrl,
    title: "وفر | Waffer - منصة فائض الطعام والتوفير في الأردن 🇯🇴",
    description:
      "تطبيق وفر (Waffer Jordan) - اشترِ فائض الطعام الطازج من مخابز ومطاعم الأردن بنصف السعر أو احصل على وجبات مجانية. استلام مباشر ودفع عند الاستلام.",
    siteName: "وفر | Waffer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "منصة وتطبيق وفر (Waffer Jordan) لحفظ النعمة وتوفير الطعام في الأردن",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "وفر | Waffer - المنصة الأولى لتوفير الطعام في الأردن 🇯🇴",
    description:
      "وفر نفقاتك اليومية واشترِ فائض وجبات المخابز والمطاعم بنصف السعر مع تطبيق وفر (Waffer Jordan). استلام فوري ودفع كاش.",
    images: ["/og-image.png"],
    creator: "@waffer_jo",
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
  // Schema.org Structured Data for Google Rich Snippets & Search Appearance
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Waffer",
        alternateName: ["وفر", "منصة وفر", "وفر الأردن", "Waffer Jordan", "Waffer App", "وفّر"],
        description:
          "المنصة الأردنية الأولى للحد من هدر الطعام وشراء الفائض الطازج بنصف السعر أو الحصول على وجبات مجانية",
        inLanguage: "ar-JO",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Waffer | وفر",
        alternateName: ["منصة وفر", "Waffer Jordan"],
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        description:
          "منصة تكنولوجية أردنية تربط بين المخابز والمطاعم والزبائن للاستفادة من فائض الطعام اليومي وتوفير نفقات الوجبات.",
        sameAs: ["https://github.com/waffer962/waffer"],
        areaServed: {
          "@type": "Country",
          name: "الأردن",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Amman",
          addressCountry: "JO",
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}/#app`,
        name: "Waffer App | تطبيق وفر",
        applicationCategory: "ShoppingApplication",
        operatingSystem: "All (Web, Android, iOS)",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "JOD",
          lowPrice: "0.00",
          highPrice: "15.00",
          offerCount: "100",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "ما هو تطبيق وفر (Waffer Jordan)؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "وفر (Waffer) هي منصة وتطبيق أردني يهدف للحد من الهدر الغذائي عبر ربط المطاعم والمخابز بالزبائن لشراء الفائض الغذائي اليومي الصالح للاستهلاك بخصومات تصل إلى 70% أو الحصول على وجبات مجانية.",
            },
          },
          {
            "@type": "Question",
            name: "كيف يمكنني حجز وجبة عبر منصة وفر؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "يمكنك تصفح العروض المتاحة في منطقتك، اختيار الكمية، وإتمام الحجز فوراً للحصول على كود حجز رقمي معتمد. الاستلام يتم مباشرة من المتجر والدفع نقداً عند الاستلام.",
            },
          },
          {
            "@type": "Question",
            name: "هل يقدم تطبيق وفر وجبات مجانية؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "نعم، تتيح منصة وفر للمتاجر الشريكة تقديم وجبات مجانية لوجه الله تعالى للعائلات والمحتاجين مع الحفاظ على كرامة المستفيدين وبنفس آلية الحجز المعتمدة.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="ar" dir="rtl" className="h-full antialiased font-sans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
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
