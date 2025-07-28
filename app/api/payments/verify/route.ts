import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }

    if (expectedSignature === razorpay_signature) {
      // Payment verified - update user status to pro
      await prisma.$transaction([
        prisma.user.upsert({
          where: { email: user.emailAddresses[0].emailAddress },
          update: {
            status: "pro",
            price_id: "pro_plan_id",
          },
          create: {
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
            full_name: user.fullName,
            status: "pro",
            price_id: "pro_plan_id",
          },
        }),
        prisma.payment.create({
          data: {
            stripe_payment_id: razorpay_payment_id,
            amount: 1900,
            status: "completed",
            price_id: "pro_plan_id",
            user_email: user.emailAddresses[0].emailAddress,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: "Payment verified and user upgraded to pro",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
