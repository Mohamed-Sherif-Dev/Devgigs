import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { skill?: string; type?: string; q?: string }
}) {
  const jobs = await prisma.job.findMany({
    where: {
      status: "ACTIVE",
      ...(searchParams.skill && {
        skills: { has: searchParams.skill },
      }),
      ...(searchParams.type && {
        type: searchParams.type as any,
      }),
      ...(searchParams.q && {
        OR: [
          { title: { contains: searchParams.q, mode: "insensitive" } },
          { description: { contains: searchParams.q, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      _count: { select: { applications: true } },
    },
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Freelance Jobs</h1>
          <p className="text-gray-400">{jobs.length} jobs available</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["All", "REMOTE", "ONSITE", "HYBRID"].map((type) => (
            <Link
              key={type}
              href={type === "All" ? "/jobs" : `/jobs?type=${type}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                (type === "All" && !searchParams.type) ||
                searchParams.type === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {type}
            </Link>
          ))}
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl mb-2">No jobs found</p>
              <p className="text-sm">Be the first to post a job!</p>
            </div>
          ) : (
            jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <div className={`border rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group ${
                  job.featured
                    ? "border-blue-500/30 bg-blue-500/5"
                    : "border-gray-800 bg-gray-900/50"
                }`}>
                  
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {job.featured && (
                          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full border border-blue-500/30">
                            Featured
                          </span>
                        )}
                        <span className="text-gray-500 text-sm">
                          {job.companyName}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h2>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-green-400 font-semibold">
                        ${job.budget}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {job.budgetType === "FIXED" ? "Fixed" : "Per hour"}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mt-3 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded-md border border-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-xs shrink-0">
                      <span>{job._count.applications} applicants</span>
                      <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">
                        {job.type}
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  )
}