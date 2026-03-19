import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const jobs = await prisma.job.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { applications: true } },
      applications: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-gray-400 mt-1">
              {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
            </p>
          </div>
          <Link
            href="/post-job"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            + Post a Job
          </Link>
        </div>

        {/* Jobs */}
        {jobs.length === 0 ? (
          <div className="text-center py-20 border border-gray-800 rounded-2xl">
            <p className="text-gray-400 text-lg mb-4">No jobs posted yet</p>
            <Link
              href="/post-job"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-800 rounded-2xl overflow-hidden bg-gray-900/50"
              >
                {/* Job Header */}
                <div className="p-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        job.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : job.status === "PENDING"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                      }`}>
                        {job.status}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {job.companyName}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <div className="flex gap-2 mt-2">
                      {job.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded border border-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-green-400 font-bold text-xl">
                      ${job.budget}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      {job._count.applications} applicants
                    </div>
                  </div>
                </div>

                {/* Applications */}
                {job.applications.length > 0 && (
                  <div className="border-t border-gray-800">
                    <div className="px-6 py-3 bg-gray-800/30">
                      <p className="text-sm font-medium text-gray-300">
                        Applications ({job.applications.length})
                      </p>
                    </div>
                    <div className="divide-y divide-gray-800">
                      {job.applications.map((app) => (
                        <div
                          key={app.id}
                          className="px-6 py-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {app.user.image && (
                              <img
                                src={app.user.image}
                                alt={app.user.name || ""}
                                className="w-9 h-9 rounded-full"
                              />
                            )}
                            <div>
                              <p className="font-medium text-sm">
                                {app.user.name || "Anonymous"}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {app.user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-xs">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                            {app.user.email && (
                              <a
                                href={`mailto:${app.user.email}`}
                                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs px-3 py-1.5 rounded-lg border border-blue-500/20 transition-colors"
                              >
                                Contact
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {job.applications.length === 0 && job.status === "ACTIVE" && (
                  <div className="border-t border-gray-800 px-6 py-4">
                    <p className="text-gray-500 text-sm">
                      No applications yet — share your job listing to get more visibility!
                    </p>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}