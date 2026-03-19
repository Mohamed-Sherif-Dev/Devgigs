import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { jobId } = await req.json()

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  })

  if (!job || job.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Job Listing: ${job.title}`,
            description: `30-day listing on DevGigs — ${job.companyName}`,
          },
          unit_amount: 2900,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?jobId=${jobId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${jobId}`,
    metadata: { jobId },
  })

  return NextResponse.json({ url: checkoutSession.url })
}