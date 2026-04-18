import type { Metadata } from "next";
import { Fraunces, Source_Serif_4, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { JourneyProvider } from "@/components/JourneyProvider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbm",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Atlas — a journal for graph algorithms",
  description:
    "A beautiful, hand-drawn companion for learning BFS, DFS, Dijkstra, and the shapes of graph thinking. Not a dashboard — a journal.",
  metadataBase: new URL("https://the-atlas.vercel.app"),
  openGraph: {
    title: "The Atlas",
    description: "A journal for graph algorithms.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSerif.variable} ${jetBrainsMono.variable} ${caveat.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <JourneyProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </JourneyProvider>
      </body>
    </html>
  );
}
