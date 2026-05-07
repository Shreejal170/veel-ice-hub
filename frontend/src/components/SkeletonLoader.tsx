// Skeleton loader shown while API request is in-flight
export default function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-5 results-enter">
      {/* Orb + text */}
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="pulsing-orb float-anim" />
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-semibold text-slate-300 animate-pulse">Analyzing interaction…</p>
          <p className="text-xs text-slate-600">Our AI is processing your comment</p>
        </div>
      </div>

      {/* Skeleton blocks */}
      <div className="flex flex-col gap-3">
        {/* Intent label skeleton */}
        <div className="flex items-center gap-2">
          <div className="skeleton h-3.5 w-12" />
          <div className="skeleton h-6 w-24 rounded-full" />
        </div>

        {/* Suggested Reply label */}
        <div className="skeleton h-3.5 w-28 mt-2" />
        {/* Text lines */}
        <div className="glass-card p-4 flex flex-col gap-2.5">
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-11/12" />
          <div className="skeleton h-3 w-4/5" />
          <div className="skeleton h-3 w-9/12" />
          <div className="skeleton h-3 w-2/3" />
        </div>

        {/* Tags label */}
        <div className="skeleton h-3.5 w-20 mt-2" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
