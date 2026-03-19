"use client"

import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          Dev<span className="text-blue-500">Gigs</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/jobs" className="text-gray-400 hover:text-white transition-colors text-sm">
            Browse Jobs
          </Link>
          <Link href="/post-job" className="text-gray-400 hover:text-white transition-colors text-sm">
            Post a Job
          </Link>
          {session && (
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-gray-300 text-sm hidden md:block">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => signIn("google")}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sign in
              </button>
              <Link
                href="/post-job"
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Post a Job
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}