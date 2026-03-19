import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-block bg-blue-500/10 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-blue-500/20">
          The #1 Freelance Job Board for Developers
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Find Freelance Projects
          <span className="text-blue-500 block">Built for Developers</span>
        </h1>
        <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
          Connect with companies looking for React, Next.js, Node.js and more. 
          Get paid for what you love building.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/jobs"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            Browse Jobs
          </Link>
          <Link
            href="/post-job"
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg border border-gray-700"
          >
            Post a Job — $29
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-6 border border-gray-800 rounded-2xl p-8 bg-gray-900/50">
          {[
            { label: "Active Jobs", value: "120+" },
            { label: "Developers", value: "2,400+" },
            { label: "Avg. Budget", value: "$2,500" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Popular Skills
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", 
            "MongoDB", "GraphQL", "TailwindCSS", "Docker", "AWS"].map((skill) => (
            <Link
              key={skill}
              href={`/jobs?skill=${skill}`}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {skill}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to hire a developer?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Post your project and reach thousands of skilled freelance developers. 
            One-time payment, no subscriptions.
          </p>
          <Link
            href="/post-job"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg inline-block"
          >
            Post a Job for $29
          </Link>
        </div>
      </section>

    </div>
  )
}