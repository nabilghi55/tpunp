import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "IKATP-FT UNP - Ikatan Alumni Teknik Pertambangan Universitas Negeri Padang",
  description: "Portal resmi Ikatan Alumni Teknik Pertambangan Fakultas Teknik Universitas Negeri Padang (IKATP-FT UNP). Platform komunikasi, direktori alumni, info karir, dan pengembangan jejaring professional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
