import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A little world for you",
  description: "A magical birthday celebration",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
