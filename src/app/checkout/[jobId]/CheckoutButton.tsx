"use client"

import { useState } from "react"

export default function CheckoutButton({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors text-lg"
    >
      {loading ? "Redirecting to Stripe..." : "Pay $29 with Stripe →"}
    </button>
  )
}