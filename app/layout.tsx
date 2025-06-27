import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PriceGuessr - The Ultimate Price Guessing Game",
  description: "Test your market knowledge! Guess prices of real items within 5% using progressive hints. Like Wordle meets The Price is Right!",
  keywords: ["price guessing", "game", "wordle", "market knowledge", "quiz"],
  authors: [{ name: "PriceGuessr Team" }],
  openGraph: {
    title: "PriceGuessr - The Ultimate Price Guessing Game",
    description: "Test your market knowledge! Guess prices of real items within 5% using progressive hints.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
