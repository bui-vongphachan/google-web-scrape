import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import "@/styles/main.scss";

const inter = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Free Search App",
  description: "Like I said, a free search app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
