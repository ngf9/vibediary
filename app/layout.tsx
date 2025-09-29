import type { Metadata } from "next";
import { Ubuntu, Dancing_Script, Montserrat, Great_Vibes } from "next/font/google";
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

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  title: "Diary of a Vibe Coder",
  description: "A collection of projects and essays on building with AI and vibe coding.",
  keywords: ["vibe coding", "AI projects", "building with AI", "AI tools", "Claude Code", "product development"],
  authors: [{ name: "Diary of a Vibe Coder" }],
  openGraph: {
    title: "Diary of a Vibe Coder",
    description: "A collection of projects and essays on building with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ubuntu.className} ${dancingScript.variable} ${montserrat.variable} ${greatVibes.variable}`} suppressHydrationWarning>
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
