import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A birthday celebration for a friend",
  description: "A heartfelt birthday celebration for a wonderful friend",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
