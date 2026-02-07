import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AuthProvider from "@/app/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "McCain Foods Global Corporate Website | McCain.com",
  description:
    "McCain Foods is a global leader in prepared potato products and appetizers. Discover our business, sustainability efforts, careers, and latest news.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "McCain Foods Global Corporate Website",
    description:
      "A global leader in prepared potato products and appetizers. Discover our business, sustainability efforts, careers, and latest news.",
    url: "https://mccainfoods-tan.vercel.app",
    siteName: "McCain Foods",
    images: [
      {
        url: "https://www.mccain.com/images/logo-mccain.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "McCain Foods Global Corporate Website",
    description:
      "A global leader in prepared potato products and appetizers.",
    images: ["https://www.mccain.com/images/logo-mccain.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
