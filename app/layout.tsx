import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CursorLoader from "@/components/ui/CursorLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://alu-website.vercel.app'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: "Discrete 8-Bit ALU | Interactive 3D CPU Portfolio",
    template: "%s | 8-Bit ALU Portfolio"
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
    title: "Discrete 8-Bit ALU | Interactive 3D Engineering Portfolio",
    description: "Deep dive into a functional 8-bit ALU crafted from 3,488 transistors. Interactive 3D models and technical documentation by Tyrone Marhguy.",
    url: 'https://alu-website.vercel.app',
    siteName: "8-Bit ALU Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: 'https://res.cloudinary.com/du4kxtjpw/image/upload/v1737336040/alu-website/pcb/renders/alu_slant.png',
        width: 1200,
        height: 630,
        alt: 'Interactive 3D Render of 8-Bit Discrete Transistor ALU',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discrete 8-Bit ALU | Interactive 3D Engineering Portfolio",
    description: "3,488 transistors. One 8-bit ALU. Explore the engineering behind a hand-built computer component by Tyrone Marhguy.",
    images: ['https://res.cloudinary.com/du4kxtjpw/image/upload/v1737336040/alu-website/pcb/renders/alu_slant.png'],
    creator: '@tmarhguy', // Verification if user has twitter
  },
};

export const viewport: Viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <CursorLoader />
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
                "name": "8-Bit Transistor ALU Engineering Portfolio",
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
      </body>
    </html>
  );
}
