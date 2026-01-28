import "../../styles/global.css";
import { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "AutoStream-Marketing | AI Video Campaign Generator",
  description: "Automate your marketing campaign videos with AI-driven personas and high-quality motion visuals.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-background text-foreground antialiased selection:bg-accent-purple/30">
        {children}
      </body>
    </html>
  );
}

