import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import CheckoutButton from "./CheckoutButton"

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  })

  if (!job || job.userId !== session.user.id) notFound()

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

          <h1 className="text-2xl font-bold mb-2">Complete Payment</h1>
          <p className="text-gray-400 mb-8">
            Your job will go live immediately after payment
          </p>

          <div className="bg-gray-800/50 rounded-xl p-4 mb-8 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">{job.companyName}</p>
            <p className="font-semibold text-lg">{job.title}</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                {job.type}
              </span>
              <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                ${job.budget}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-700">
            <div>
              <p className="font-semibold">Job Listing — 30 days</p>
              <p className="text-gray-400 text-sm">One-time payment</p>
            </div>
            <p className="text-3xl font-bold text-green-400">$29</p>
          </div>

          <CheckoutButton jobId={jobId} />

        </div>
      </div>
    </div>
  )
}