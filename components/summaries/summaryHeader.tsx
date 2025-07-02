import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Calendar, ChevronLeft, Clock, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { getReadingTime } from "@/lib/summaries";

export default function SummaryHeader({
  title,
  createdAt,
  summary,
}: {
  title: string;
  createdAt: Date;
  summary: string;
}) {
  return (
    <div className="flex flex-col-reverse lg:flex-row justify-between gap-4">
      <div className="space-y-6">
        <div className="flex items-center flex-wrap gap-2 sm:gap-4 justify-center lg:justify-start">
          <Badge
            variant={"secondary"}
            className="relative px-4 py-1.5 text-sm font-medium bg-white/80 backdrop-blur-xs rounded-full hover:bg-white/90 transition-all duration-200 shadow-xs hover:shadow-md"
          >
            <Sparkles className="h-4 w-4 mr-1 inline-block text-rose-500" />
            Ai Summary
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1 text-rose-500 inline-block" />
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1 text-rose-500 inline-block" />
            {getReadingTime(summary)} Min Read
          </div>
        </div>
        <h1 className="text-2xl lg:text-4xl font-bold lg:tracking-tight text-center lg:text-left">
          <span className="bg-linear-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent truncate block max-w-xs sm:max-w-md lg:max-w-lg overflow-hidden">
            {title}
          </span>
        </h1>
      </div>
      <div>
        <Link href={"/dashboard"}>
          <Button
            variant={"outline"}
            size={"sm"}
            className="group no-underline flex items-center gap-1 sm:gap-2 hover:bg-white/80 backdrop-blur-xl rounded-full transition-all duration-200 shadow-xs hover:shadow-md border border-rose-100/30 bg-rose-100 px-2 sm:px-3"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
            <span className="text-muted-foreground">Back</span>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium hidden sm:inline-block">
              to Dashboard
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
