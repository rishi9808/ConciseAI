import BgGradient from "@/components/common/BgGradient";
import { MotionDiv } from "@/components/common/motion-wrapper";
import EmptySummaryState from "@/components/summaries/EmptySummaryState";
import SummaryCard from "@/components/summaries/summary-card";
import { Button } from "@/components/ui/button";
import { getSummaries } from "@/lib/summaries";
import { containerVariants, itemVariants } from "@/utils/animations";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, ArrowRightCircle, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function getDashboardData() {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    return redirect("/sign-in");
  }

  const uploadLimit = 5;
  const summaries = await getSummaries(userId);
  return (
    <main className="min-h-screen">
      <BgGradient />
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-2 py-12 sm:py-24">
          <div className="flex justify-between gap-4">
            <div className="flex mb-4 flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">
                Your Summaries
              </h1>
              <p className="text-gray-600">
                Transform your PDFs into concise, actionable insights
              </p>
              <p className="text-gray-600">
                {summaries.length} PDF summaries found
              </p>
            </div>
            <Button
              variant={"link"}
              className="bg-linear-to-r from-rose-500 to-rose-700 hover:from-rose-600 group hover:no-underline hover:to-rose-800 hover:scale-105 transition-all duration-200 "
            >
              <Link
                href="/upload"
                className="flex no-underline items-center text-white"
              >
                <Plus className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline-block">New Summary</span>
              </Link>
            </Button>
          </div>
          {/* <div className="my-6">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800">
              <p className="text-sm">
                You have reached the limit of {uploadLimit} uploads on the basic
                plan
                <Link
                  href={"/#pricing"}
                  className="underline ml-1 font-medium underline-offset-4 inline-flex items-center"
                >
                  Click here to upgrade to pro{" "}
                  <ArrowRight className="h-4 w-4 inline-block" />
                </Link>
                for unlimited uploads
              </p>
            </div>
          </div> */}
          {summaries.length > 0 ? (
            <MotionDiv
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {summaries.map((summary, index) => (
                <MotionDiv
                  key={index}
                  variants={itemVariants}
                  className="h-full"
                >
                  <SummaryCard summary={summary} />
                </MotionDiv>
              ))}
            </MotionDiv>
          ) : (
            <EmptySummaryState />
          )}
        </div>
      </div>
    </main>
  );
}
