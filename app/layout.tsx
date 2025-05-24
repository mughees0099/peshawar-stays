import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
