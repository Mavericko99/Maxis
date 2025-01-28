import type { Metadata } from "next";
import { Roboto, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const geistSans = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: 'normal',
  subsets: ['cyrillic'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maxis",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans} ${geistMono.variable} antialiased`}
      >
        
        {children}
      </body>
    </html>
  );
}
