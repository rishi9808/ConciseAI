import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-rose-100/30 p-8 sm:p-12 my-12 flex flex-col items-center justify-center">
      {/* Animated spinner */}
      <div className="mb-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-rose-200 border-t-rose-500" />
      </div>
      {/* Animated dots */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-rose-300 animate-bounce [animation-delay:-0.2s]" />
        <div className="w-3 h-3 rounded-full bg-rose-400 animate-bounce [animation-delay:0s]" />
        <div className="w-3 h-3 rounded-full bg-rose-300 animate-bounce [animation-delay:0.2s]" />
      </div>
      {/* Text */}
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-semibold text-rose-600 mb-2">
          Creating your summary...
        </h2>
        <p className="text-gray-500 text-sm">
          Please wait while we analyze your PDF and generate a concise summary.
        </p>
      </div>
    </div>
  );
}
