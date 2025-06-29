import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { UsernameModal } from "@/components/ui/username-modal";
import { HowToPlayModal } from "@/components/ui/how-to-play-modal";
import { SoundInitializer } from "@/components/providers/sound-initializer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PriceGuessr - The Ultimate Price Guessing Game",
  description: "Test your market knowledge! Guess prices of real items within 5% using progressive hints. Like Wordle meets The Price is Right!",
  keywords: ["price guessing", "game", "wordle", "market knowledge", "quiz"],
  authors: [{ name: "PriceGuessr Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#0d47a1",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PriceGuessr",
  },
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
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            <SoundInitializer />
            <UsernameModal />
            <HowToPlayModal />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
