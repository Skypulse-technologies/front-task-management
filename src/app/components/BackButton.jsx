"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-800 transition-colors"
      >
        <span className="text-lg">←</span>
        <span>Back</span>
      </button>
    </div>
  );
}
