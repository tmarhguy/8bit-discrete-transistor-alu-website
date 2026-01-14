import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Discrete 8-Bit ALU | Interactive 3D CPU Portfolio",
  description: "Explore a fully functional discrete 8-bit ALU built from 3,800+ transistors. Interactive 3D visualization, homebrew CPU architecture, and FPGA verification.",
  keywords: [
    "discrete 8-bit alu",
    "transistor cpu",
    "homebrew computer",
    "8-bit cpu",
    "fpga",
    "verilog",
    "interactive 3d",
    "digital logic design",
    "computer engineering portfolio"
  ],
  openGraph: {
    title: "Discrete 8-Bit ALU | Interactive 3D CPU Portfolio",
    description: "Explore a fully functional discrete 8-bit ALU built from 3,800+ transistors. Interactive 3D visualization and engineering deep dive.",
    type: "website",
    locale: "en_US",
    siteName: "8-Bit ALU Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discrete 8-Bit ALU | Interactive 3D CPU Portfolio",
    description: "Explore a fully functional discrete 8-bit ALU built from 3,800+ transistors.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Discrete 8-Bit ALU",
              "description": "A fully functional discrete 8-bit Arithmetic Logic Unit built from 3,800+ transistors.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "Tmarhguy" // Using username as placeholder, user can update
              }
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
