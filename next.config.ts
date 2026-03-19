import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
}

export default nextConfig