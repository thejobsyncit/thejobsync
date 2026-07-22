import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/context/ToastContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#010a18',
};

export const metadata: Metadata = {
  title: "Gojobsync",
  description: "Comprehensive Gojobsync recruitment and CRM management platform for managing the complete recruitment lifecycle.",
  icons: {
    icon: "/loooo.jpeg",
  },
  openGraph: {
    title: "Gojobsync",
    description: "Comprehensive Gojobsync recruitment and CRM management platform for managing the complete recruitment lifecycle.",
    url: "https://www.gojobsync.com",
    siteName: "Gojobsync",
    images: [
      {
        url: "/loooo.jpeg",
        width: 800,
        height: 600,
        alt: "Gojobsync Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
