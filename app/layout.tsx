import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  // Use the primary production domain so Open Graph / Twitter cards resolve correctly
  metadataBase: new URL('https://alu.tmarhguy.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: "Discrete 8-Bit ALU | Interactive 3D ALU | Tyrone Marhguy",
    template: "%s | 8-Bit Discrete Transistor ALU"
  },
  description: "Experience the engineering of a discrete 8-bit ALU built from 3,488 transistors. Features interactive 3D visualizations, detailed logic schematics, and a comprehensive build journey.",
  keywords: [
    "Tyrone Marhguy",
    "discrete 8-bit alu",
    "transistor-level cpu",
    "8-bit computer engineering",
    "hand-built cpu",
    "discrete transistor logic",
    "interactive 3d hardware visualization",
    "penn engineering project",
    "homebrew computer design",
    "digital logic architecture",
    "arithmetic logic unit project",
    "3,488 transistor build",
    "retro-computing inspiration",
  ],
  authors: [{ name: "Tyrone Marhguy", url: "https://github.com/tmarhguy" }],
  creator: "Tyrone Marhguy",
  publisher: "Tyrone Marhguy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
  openGraph: {
    title: "Discrete 8-Bit ALU | Interactive 3D ALU | Tyrone Marhguy",
    description: "Deep dive into a functional 8-bit ALU crafted from 3,488 transistors. Interactive 3D models and technical documentation by Tyrone Marhguy.",
    // Use the canonical, user-facing URL
    url: 'https://alu.tmarhguy.com',
    siteName: "8-Bit ALU 8-Bit Discrete Transistor ALU",
    locale: "en_US",
    type: "website",
    images: [
      {
        // Optimized 1200x630 OG image
        url: 'https://alu.tmarhguy.com/media/images/opengraph-default.png',
        width: 1200,
        height: 630,
        alt: 'Physical 8-Bit Discrete Transistor ALU',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discrete 8-Bit ALU | Interactive 3D ALU | Tyrone Marhguy",
    description: "3,488 transistors. One 8-bit ALU. Explore the engineering behind a hand-built computer component by Tyrone Marhguy.",
    images: ['https://alu.tmarhguy.com/media/images/opengraph-default.png'],
    creator: '@tmarhguy', // Verification if user has twitter
  },
};

export const viewport: Viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale: 0.8,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: '#000000' }}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        
        {/* Critical Resource Hints for Performance */}

        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="8-Bit ALU" />
        <link rel="apple-touch-icon" href="/media/images/pcb/renders/alu_slant.png" />
        
        {/* Mobile Optimization */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.variable} antialiased`}>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "Discrete 8-Bit ALU",
                "description": "A fully functional discrete 8-bit Arithmetic Logic Unit built from 3,488 transistors.",
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "Any",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "author": {
                  "@type": "Person",
                  "name": "Tyrone Marhguy",
                  "url": "https://github.com/tmarhguy"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                "name": "8-Bit Transistor ALU Engineering",
                "description": "Technical deep dive into the design and fabrication of a discrete transistor ALU.",
                "educationalLevel": "University/Undergraduate",
                "author": {
                  "@type": "Person",
                  "name": "Tyrone Marhguy",
                  "url": "https://github.com/tmarhguy"
                },
                "genre": "Computer Engineering",
                "keywords": "Discrete Transistors, ALU, CPU, Digital Logic, Engineering, Tyrone Marhguy"
              }
            ])
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
