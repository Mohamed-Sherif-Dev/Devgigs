import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { jobId } = await req.json()

  try {
    await prisma.application.create({
      data: {
        jobId,
        userId: session.user.id,
      },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Already applied" }, { status: 400 })
  }
}