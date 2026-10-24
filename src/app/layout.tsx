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
  title: "Twinnie — Join the waitlist",
  description:
    "Join the Twinnie waitlist. Be the first to know when you can get started.",
  keywords: ["Twinnie", "online shopping", "fashion tech", "waitlist"],
  openGraph: {
    title: "Twinnie — Join the waitlist",
    description:
      "Join the Twinnie waitlist. Be the first to know when you can get started.",
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
