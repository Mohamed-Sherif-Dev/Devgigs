import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const {
    title, description, budget, budgetType,
    type, companyName, location, applyUrl, skills
  } = body

  if (!title || !description || !budget || !companyName || !skills?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const job = await prisma.job.create({
    data: {
      title,
      description,
      budget,
      budgetType,
      type,
      companyName,
      location: location || null,
      applyUrl: applyUrl || null,
      skills,
      userId: session.user.id,
      status: "PENDING",
    },
  })

  return NextResponse.json({ jobId: job.id })
}