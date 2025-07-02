import React from "react";
import BgGradient from "../common/BgGradient";
import { Pizza } from "lucide-react";
import SummaryViewer from "../summaries/SummaryViewer";
import DEMO_SUMMARY from "@/utils/Demo_summary";
import { MotionDiv, MotionH3 } from "../common/motion-wrapper";
import {
  containerVariants,
  itemVariants,
  h3Variants,
  cardVariants,
} from "@/utils/animations";

function DemoSection() {
  return (
    <MotionDiv className="relative">
      <div className="mx-auto max-w-5xl py-12 lg:py-24 px-4 sm:px-6 lg:px-8 lg:pt-12">
        {/* Gradient background */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-30"
        >
          <div
            style={{
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
            className="absolute left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
          />
        </div>

        <div className="flex flex-col items-center text-center space-y-4">
          <MotionDiv
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="inline-flex items-center justify-center p-2 rounded-2xl bg-gray-100/80 backdrop-blur-xs border border-gray-500/20 mb-4"
          >
            <Pizza className="w-6 h-6 text-rose-500" />
          </MotionDiv>
          <MotionDiv
            variants={h3Variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="mb-16 text-center"
          >
            <MotionH3 className="font-bold text-3xl max-w-2xl mx-auto px-4 sm:px-6">
              Watch how ConciseAI transforms{" "}
              <span className="bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
                this Next.js course PDF
              </span>{" "}
              into an easy-to-read summary
            </MotionH3>
          </MotionDiv>
          <MotionDiv
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="flex justify-center rounded-2xl py-6 shadow-xl items-center px-2 sm:px-4 lg:px-6"
          >
            {/* Summary viewer */}
            <div className="w-full sm:min-w-xl max-w-2xl">
              <SummaryViewer summary={DEMO_SUMMARY} />
            </div>
          </MotionDiv>
        </div>
      </div>
    </MotionDiv>
  );
}

export default DemoSection;
