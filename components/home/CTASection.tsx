import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionDiv } from "../common/motion-wrapper";
import { containerVariants, itemVariants } from "@/utils/animations";

function CTASection() {
  return (
    <MotionDiv
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      className="w-full bg-white/60 py-16 rounded-2xl shadow-sm"
    >
      <div className="max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-6">
        <MotionDiv variants={itemVariants}>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Ready to Summarize Your PDFs Effortlessly?
          </h2>
        </MotionDiv>
        <MotionDiv variants={itemVariants}>
          <p className="text-lg text-gray-600 mb-6">
            Transform lengthy documents into clear, concise summaries in just a
            few clicks. ConciseAI makes it easy to digest information quickly.
          </p>
        </MotionDiv>
        <MotionDiv variants={itemVariants}>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-linear-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900 transition-colors duration-100 hover:no-underline font-bold text-white shadow-md hover:shadow-lg"
          >
            Get Started <ArrowRight size={20} />
          </Link>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
}

export default CTASection;
