import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import ApplyButton from "./ApplyButton"

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      _count: { select: { applications: true } },
    },
  })

  if (!job || job.status !== "ACTIVE") notFound()

  const hasApplied = session?.user?.id
    ? !!(await prisma.application.findUnique({
        where: {
          jobId_userId: {
            jobId: job.id,
            userId: session.user.id,
          },
        },
      }))
    : false

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="md:col-span-2 space-y-6">
            <div>
              <p className="text-gray-400 mb-1">{job.companyName}</p>
              <h1 className="text-3xl font-bold">{job.title}</h1>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-gray-800 text-gray-300 text-sm px-3 py-1 rounded-lg border border-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="border border-gray-800 rounded-xl p-6 bg-gray-900/50">
              <h2 className="font-semibold mb-4 text-lg">Job Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-800 rounded-xl p-6 bg-gray-900/50 sticky top-20">
              <div className="text-3xl font-bold text-green-400 mb-1">
                ${job.budget}
              </div>
              <div className="text-gray-500 text-sm mb-6">
                {job.budgetType === "FIXED" ? "Fixed Price" : "Per Hour"}
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white">{job.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Applicants</span>
                  <span className="text-white">{job._count.applications}</span>
                </div>
                {job.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location</span>
                    <span className="text-white">{job.location}</span>
                  </div>
                )}
              </div>

              <ApplyButton
                jobId={job.id}
                hasApplied={hasApplied}
                isLoggedIn={!!session}
                applyUrl={job.applyUrl}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}