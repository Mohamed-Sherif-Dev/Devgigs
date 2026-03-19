import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId: string }>
}) {
  const { jobId } = await searchParams
  const session = await getServerSession(authOptions)

  if (session && jobId) {
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "ACTIVE" },
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">

        <div className="text-6xl mb-6">🎉</div>

        <h1 className="text-3xl font-bold mb-4">
          Your job is now live!
        </h1>
        <p className="text-gray-400 mb-8">
          Developers can now find and apply to your job listing on DevGigs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/jobs"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            View All Jobs
          </Link>
        </div>

      </div>
    </div>
  )
}