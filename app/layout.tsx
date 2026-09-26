import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const faviconSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c5cff'/%3E%3Cstop offset='1' stop-color='%233fa9f5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='9' fill='url(%23g)'/%3E%3Cpath d='M11 21c0 2.2 2.1 3.5 5 3.5s5-1.4 5-3.6c0-2.4-2.3-3-4.6-3.5-2-.4-3-.8-3-1.8 0-.9.9-1.5 2.4-1.5 1.4 0 2.4.5 2.7 1.6l2.9-.6C21 11.6 19 10 15.9 10c-2.9 0-5.2 1.4-5.2 3.7 0 2.3 1.9 3.1 4.4 3.6 2.2.5 3.2.8 3.2 1.9 0 1-1 1.6-2.6 1.6-1.7 0-2.8-.7-3.1-2z' fill='white'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  title: "Sellora AI — генератор контента для маркетплейсов",
  description:
    "Создавайте названия, описания, преимущества и SEO-тексты для товаров с помощью AI.",
  icons: {
    icon: faviconSvg,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ru" className={manrope.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <div className="bg-glow" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
