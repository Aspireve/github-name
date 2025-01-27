import "./globals.css";
import type { Metadata } from "next";
import { Big_Shoulders_Display, Geist, Inter } from "next/font/google";
import Footer from "@/components/footer";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bigShoulderDisplay = Big_Shoulders_Display({
  variable: "--font-big-shoulders-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aspireve builds",
  description:
    "This is an example site to demonstrate how to use NextAuth.js for authentication",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={`${bigShoulderDisplay.variable} ${geistSans.variable} ${inter.className} antialiased`}
      >
        {children}
        {/* <div className="flex h-full min-h-screen w-full flex-col justify-between">
          <Header />
          <main className="mx-auto w-full max-w-3xl flex-auto px-4 py-4 sm:px-6 md:py-6">
            {children}
          </main>
          <Footer />
        </div> */}
      </body>
    </html>
  );
}
