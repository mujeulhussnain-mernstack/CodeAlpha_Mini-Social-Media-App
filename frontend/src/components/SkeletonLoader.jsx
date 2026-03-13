// components/SkeletonLoader.jsx

export const FeedSkeleton = () => (
  <div className="max-w-2xl mx-auto p-4 space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-[#1a1625]/80 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 animate-pulse"></div>
          <div className="flex-1">
            <div className="w-32 h-4 bg-purple-500/20 rounded animate-pulse mb-2"></div>
            <div className="w-24 h-3 bg-purple-500/10 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="w-full h-64 bg-purple-500/10 rounded-lg animate-pulse mb-4"></div>
        <div className="flex gap-4 mb-3">
          <div className="w-8 h-8 bg-purple-500/20 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-purple-500/20 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-purple-500/20 rounded animate-pulse ml-auto"></div>
        </div>
        <div className="w-48 h-4 bg-purple-500/20 rounded animate-pulse"></div>
      </div>
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto p-4">
    <div className="bg-[#1a1625]/80 rounded-xl p-6 border border-purple-500/20 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-purple-500/20 animate-pulse"></div>
        <div className="flex-1">
          <div className="w-48 h-6 bg-purple-500/20 rounded animate-pulse mb-3"></div>
          <div className="w-64 h-4 bg-purple-500/10 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-[#1a1625]/80 rounded-xl p-4 border border-purple-500/20">
          <div className="w-full h-48 bg-purple-500/10 rounded-lg animate-pulse mb-3"></div>
          <div className="w-32 h-4 bg-purple-500/20 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);