import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
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
      // Payment verified
      // Note: Database storage removed - working without database
      // In production, you would store this in a database or external service
      console.log(
        "Payment verified for user:",
        user.emailAddresses[0].emailAddress
      );
      console.log("Payment ID:", razorpay_payment_id);
      console.log("Order ID:", razorpay_order_id);

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        userId: user.id,
        paymentId: razorpay_payment_id,
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
