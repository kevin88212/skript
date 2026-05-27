import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Zestly — Taste the Speed",
  description: "Blitzschnelle Lieferung. Unwiderstehlicher Geschmack. Zestly bringt dein Lieblingsessen in unter 30 Minuten zu dir.",
  keywords: "Lieferdienst, Essen bestellen, Zestly, schnell, lecker",
  openGraph: {
    title: "Zestly — Taste the Speed",
    description: "Dein Lieblingsessen in unter 30 Minuten.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
