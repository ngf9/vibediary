import type { Metadata } from "next";
import { Ubuntu, Dancing_Script, Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-signature",
});

const montserrat = Montserrat({
  weight: ["400", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Vibe Coding 101 - Learn the Craft of Building with AI",
  description: "Transform your career with Vibe Coding. A 6-week course for non-technical professionals to learn how to ship products end-to-end using AI and vibe coding tools.",
  keywords: ["vibe coding", "AI education", "learn coding", "AI tools", "Claude Code", "product development"],
  authors: [{ name: "AI Study Camp" }],
  openGraph: {
    title: "Vibe Coding 101 - Learn the Craft of Building with AI",
    description: "Transform your career with Vibe Coding. Build real products with AI tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ubuntu.className} ${dancingScript.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --font-sans: ${ubuntu.style.fontFamily};
          }
        `}</style>
        {/* Preload optimized images for faster hover effect */}
        <link rel="preload" as="image" type="image/webp" href="/aifront2-optimized.webp" />
        <link rel="preload" as="image" type="image/webp" href="/vibefront2-optimized.webp" />
      </head>
      <body className="antialiased overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
