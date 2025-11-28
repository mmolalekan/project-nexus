"use client";
import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { Inter, Amiri } from "next/font/google";
import { StateProvider } from "@/providers/stateProvider/provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const amiri = Amiri({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

const metadata: Metadata = {
  title: "Qurbaan",
  description: "Project Nexus",
  icons: {
    icon: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>{String(metadata.title)}</title>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <meta name="description" content={String(metadata.description)} />
      </head>
      <body className={`${inter.variable} ${amiri.variable} antialiased`}>
        <StateProvider>
          {children}
          <Toaster richColors position="top-right" duration={5000} />
        </StateProvider>
      </body>
    </html>
  );
}
