import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Age of AI — Tournament Table",
  description: "Sit-and-go trading tournaments with AI crew chief",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-arena-bg">{children}</body>
    </html>
  );
}
