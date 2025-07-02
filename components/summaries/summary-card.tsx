import React from "react";
import { Card } from "../ui/card";
import DeleteButton from "./deleteButton";
import Link from "next/link";
import { FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const SummaryHeader = ({
  fileUrl,
  title,
  createdAt,
}: {
  fileUrl: string;
  title: string | null;
  createdAt: string;
}) => {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-rose-400" />
      <div className="flex-1 min-w-0">
        <h3 className="text-base xl:text-lg font-semibold text-gray-900 truncate w-4/5">
          {title}
        </h3>
        <p className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
        status === "completed"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {status}
    </span>
  );
};

export default function SummaryCard({ summary }: { summary: any }) {
  return (
    <div className="hover:scale-[1.03] transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-rose-200/50">
      <Card className="relative h-full border border-gray-200 hover:border-rose-300 transition-all duration-300">
        <div className="absolute top-2 right-2">
          <DeleteButton summaryId={summary.id} />
        </div>

        <Link className="block p-4 sm:p-6" href={`summaries/${summary.id}`}>
          <div className="flex flex-col gap-3 sm:gap-4">
            <SummaryHeader
              fileUrl={summary.original_file_url}
              title={summary.title}
              createdAt={summary.created_at}
            />
            <p className="text-gray-900 line-clamp-2 text-sm sm:text-base pl-2 ">
              {summary.description}
            </p>
            <div className="flex justify-between items-center mt-2 sm:mt-4">
              <StatusBadge status={summary.status} />
            </div>
          </div>
        </Link>
      </Card>
    </div>
  );
}
