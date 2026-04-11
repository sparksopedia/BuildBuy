import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://buildorbuy.app";
const SITE_NAME = "Build or Buy";
const DEFAULT_TITLE =
  "Build or Buy — Free Build vs. Buy Decision Framework & Rubric Tool";
const DEFAULT_DESCRIPTION =
  "Free build vs. buy decision tool for product, engineering, and business teams. Create structured rubrics, score dimensions, collect stakeholder input, and export results to drive confident build or buy decisions.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Build or Buy",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  keywords: [
    "build vs buy",
    "build or buy",
    "build vs buy decision",
    "build vs buy framework",
    "build vs buy tool",
    "build vs buy rubric",
    "build vs buy scorecard",
    "build vs buy analysis",
    "build vs buy template",
    "build vs buy calculator",
    "build vs buy checklist",
    "build or buy decision",
    "build or buy framework",
    "build or buy analysis",
    "make or buy decision",
    "make vs buy",
    "make-or-buy analysis",
    "vendor evaluation tool",
    "vendor scoring rubric",
    "software build vs buy",
    "product build vs buy",
    "engineering build vs buy",
    "buy vs build software",
    "build versus buy",
    "decision rubric",
    "stakeholder scoring tool",
    "decision framework",
    "procurement decision tool",
    "technology buy or build",
  ],
  authors: [{ name: "Build or Buy" }],
  creator: "Build or Buy",
  publisher: "Build or Buy",
  category: "business",
  classification: "Business Decision Tools",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build or Buy — Build vs. Buy Decision Framework",
    description:
      "Free, structured build vs. buy rubric tool. Score dimensions, collect stakeholder input, export results.",
    creator: "@buildorbuy",
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
};

export const viewport: Viewport = {
  themeColor: "#1A2744",
  width: "device-width",
  initialScale: 1,
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: SITE_NAME,
      alternateName: [
        "Build vs Buy Tool",
        "Build or Buy Decision Rubric",
        "Build vs Buy Framework",
      ],
      url: SITE_URL,
      description: DEFAULT_DESCRIPTION,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "DecisionSupportTool",
      operatingSystem: "Any (web-based)",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      isAccessibleForFree: true,
      inLanguage: "en-US",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        "Create custom build vs. buy evaluation rubrics",
        "Define scoring dimensions and weights",
        "Collect multi-stakeholder input via shareable code",
        "Aggregate scores across evaluators",
        "Export results as PDF or CSV",
        "Multiple scoring scales: numeric, stars, thumbs, slider",
      ],
      audience: {
        "@type": "Audience",
        audienceType:
          "Product managers, engineering leaders, operations, procurement, and business strategy teams",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      inLanguage: "en-US",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a build vs. buy decision?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A build vs. buy decision is the choice between developing a capability internally versus purchasing a commercial solution. It weighs factors like cost, time-to-value, strategic fit, maintenance burden, customization needs, and opportunity cost across multiple stakeholders.",
          },
        },
        {
          "@type": "Question",
          name: "How do you decide whether to build or buy software?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use a structured rubric that scores dimensions like strategic differentiation, total cost of ownership, internal capacity, speed to value, integration complexity, and risk. Collect input from product, engineering, operations, finance, and leadership stakeholders, then compare aggregated scores.",
          },
        },
        {
          "@type": "Question",
          name: "Is Build or Buy free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Build or Buy is a free, ad-free web tool. You can create unlimited rubrics, invite any number of stakeholders, and export results without signing up.",
          },
        },
        {
          "@type": "Question",
          name: "What scoring scales are available?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Build or Buy supports numeric scales (0-2, 1-5, 1-7, 1-10), 5-star ratings, thumbs up/down, and a 0.0-10.0 slider. Every dimension also supports an N/A option when a criterion does not apply.",
          },
        },
        {
          "@type": "Question",
          name: "Who should use a build vs. buy framework?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Product managers, engineering leaders, operations teams, procurement, finance, and executive leadership all benefit from a shared, structured framework when evaluating whether to build a capability in-house or purchase a commercial solution.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
