import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pop — AI Chief of Staff for Mom & Pops",
  description:
    "See what an AI-native competitor would do to your business — then give yourself one.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
