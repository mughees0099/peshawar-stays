import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Peshawar Stays",
  description: "Find your perfect stay in Peshawar",
  keywords: ["Peshawar", "stays", "accommodation", "hotels", "guesthouses"],

  generator: "Next.js",
  applicationName: "Peshawar Stays",
  authors: [
    {
      name: "Peshawar Stays Team",
    },
  ],
  creator: "Peshawar Stays Team",
  publisher: "Peshawar Stays Team",
  openGraph: {
    title: "Peshawar Stays",
    description: "Find your perfect stay in Peshawar",
    siteName: "Peshawar Stays",

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
    <html lang="en">
      <body>
        <Navbar />
        <div className="mt-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
