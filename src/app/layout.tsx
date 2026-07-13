import type { Metadata } from "next";
import { Cairo, Poppins } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "كود خدمات | خدمات عامة وخدمات إلكترونية في جدة",
  description: "مكتب كود خدمات يقدم خدمات عامة، سداد، طباعة، تصوير، خدمات الطلاب، إصدار السجلات التجارية، التأشيرات، والخدمات الحكومية في جدة.",
  icons: {
    icon: "/images/logo.jpg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${poppins.variable}`}>
      <body className="antialiased min-h-screen flex flex-col transition-colors duration-300">
        <LanguageProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
