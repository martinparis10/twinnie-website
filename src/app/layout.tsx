import type { Metadata } from "next";
import { Libre_Baskerville, Josefin_Sans } from "next/font/google";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Twinnie — Virtual Try-On for Every Brand",
  description:
    "One scan. A photorealistic digital twin. Try on anything, anywhere. Twinnie brings virtual try-on to online shopping.",
  keywords: ["virtual try-on", "digital twin", "online shopping", "fashion tech"],
  openGraph: {
    title: "Twinnie — Virtual Try-On for Every Brand",
    description:
      "One scan. A photorealistic digital twin. Try on anything, anywhere.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreBaskerville.variable} ${josefinSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
