import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevGigs — Freelance Jobs for Developers",
  description: "Find the best freelance projects for developers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}