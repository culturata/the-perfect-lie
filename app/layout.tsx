import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
