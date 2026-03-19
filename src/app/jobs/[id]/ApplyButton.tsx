"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ApplyButton({
  jobId,
  hasApplied,
  isLoggedIn,
  applyUrl,
}: {
  jobId: string
  hasApplied: boolean
  isLoggedIn: boolean
  applyUrl: string | null
}) {
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(hasApplied)
  const router = useRouter()

  async function handleApply() {
    if (!isLoggedIn) {
      signIn("google")
      return
    }
    if (applyUrl) {
      window.open(applyUrl, "_blank")
      return
    }
    setLoading(true)
    const res = await fetch("/api/jobs/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    })
    setLoading(false)
    if (res.ok) {
      setApplied(true)
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleApply}
      disabled={applied || loading}
      className={`w-full py-3 rounded-xl font-semibold transition-colors ${
        applied
          ? "bg-green-600/20 text-green-400 border border-green-500/30 cursor-default"
          : "bg-blue-600 hover:bg-blue-500 text-white"
      }`}
    >
      {applied ? "✓ Applied" : loading ? "Applying..." : "Apply Now"}
    </button>
  )
}