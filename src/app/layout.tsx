import type { Metadata } from "next";
import { lilitaOne } from "@/app/utils/fonts";
import "./globals.css";

export const metadata: Metadata = {

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen min-w-screen ${lilitaOne.className}`}
      >
        {children}
      </body>
    </html>
  );
}
