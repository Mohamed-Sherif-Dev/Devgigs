"use client"

import { useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

const SKILLS = [
  "React", "Next.js", "Node.js", "TypeScript", "JavaScript",
  "PostgreSQL", "MongoDB", "GraphQL", "TailwindCSS", "Docker",
  "AWS", "Python", "Vue.js", "Angular", "Redis"
]

export default function PostJobPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    budgetType: "FIXED",
    type: "REMOTE",
    companyName: "",
    location: "",
    applyUrl: "",
  })

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!session) {
      signIn("google")
      return
    }

    if (selectedSkills.length === 0) {
      alert("Please select at least one skill")
      return
    }

    setLoading(true)

    const res = await fetch("/api/jobs/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, skills: selectedSkills }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      router.push(`/checkout/${data.jobId}`)
    } else {
      alert(data.error || "Something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
          <p className="text-gray-400">
            Reach thousands of freelance developers. One-time payment of{" "}
            <span className="text-green-400 font-semibold">$29</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior React Developer for E-commerce App"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company / Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Inc."
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Description *
            </label>
            <textarea
              required
              rows={6}
              placeholder="Describe the project, requirements, and what you're looking for..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget ($) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 2000"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget Type
              </label>
              <select
                value={form.budgetType}
                onChange={(e) => setForm({ ...form, budgetType: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="FIXED">Fixed Price</option>
                <option value="HOURLY">Per Hour</option>
              </select>
            </div>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Type
            </label>
            <div className="flex gap-3">
              {["REMOTE", "ONSITE", "HYBRID"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, type })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                    form.type === type
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-gray-900 border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Required Skills * ({selectedSkills.length} selected)
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                    selectedSkills.includes(skill)
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-gray-900 border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Apply URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Apply URL (optional)
            </label>
            <input
              type="url"
              placeholder="https://yourwebsite.com/apply"
              value={form.applyUrl}
              onChange={(e) => setForm({ ...form, applyUrl: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-gray-500 text-xs mt-1">
              Leave empty to receive applications through DevGigs
            </p>
          </div>

          {/* Submit */}
          <div className="border border-gray-800 rounded-xl p-6 bg-gray-900/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold">Ready to post?</p>
                <p className="text-gray-400 text-sm">
                  Your job will be live after payment
                </p>
              </div>
              <div className="text-2xl font-bold text-green-400">$29</div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading
                ? "Processing..."
                : session
                ? "Continue to Payment →"
                : "Sign in to Post Job"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}