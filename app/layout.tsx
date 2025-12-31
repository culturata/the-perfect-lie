import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { AdhesiveAd } from "@/components/ads/adhesive-ad";

export const metadata: Metadata = {
  title: "The Perfect Lie - GSPro Community Hub",
  description: "Discover courses, find resources, and connect with fellow GSPro golf simulation enthusiasts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans antialiased">
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-24">{children}</main>
            <Footer />
          </div>
          <AdhesiveAd />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
