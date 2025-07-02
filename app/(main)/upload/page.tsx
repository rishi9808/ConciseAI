"use client";
import BgGradient from "@/components/common/BgGradient";
import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import UploadPDFForm from "@/components/upload/UploadPDFForm";
import { MotionDiv } from "@/components/common/motion-wrapper";
import {
  containerVariants,
  itemVariants,
  h1Variants,
  paragraphVariants,
} from "@/utils/animations";
import LoadingSkeleton from "@/components/upload/LoadingSkeleton";

export default function page() {
  const [isUploading, setIsUploading] = useState(false);
  return (
    <section className="min-h-screen py-12">
      <BgGradient />
      <div className="relative z-10 w-full max-w-xl mx-auto">
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6 bg-white rounded-2xl shadow-xl border border-rose-100 px-8 py-10"
        >
          <MotionDiv variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 font-semibold text-sm mb-2">
              <Sparkles size={16} className="text-rose-400 animate-pulse" />
              AI Powered Content Creation
            </span>
          </MotionDiv>
          <MotionDiv variants={h1Variants} className="w-full">
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Start Uploading{" "}
              <span className="relative inline-block">
                <span className="relative px-2 z-10">Your PDF's</span>
                <span className="absolute inset-0 bg-rose-200/50 -rotate-2 rounded-lg transform -skew-y-1"></span>
              </span>{" "}
            </h1>
          </MotionDiv>
          <MotionDiv variants={paragraphVariants} className="w-full">
            <p className="text-gray-500 text-center mb-2">
              Drag & drop your PDF file here, or click to select from your
              device.
            </p>
          </MotionDiv>
          <MotionDiv variants={itemVariants} className="w-full">
            {isUploading && <LoadingSkeleton />}
            <UploadPDFForm
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
}
