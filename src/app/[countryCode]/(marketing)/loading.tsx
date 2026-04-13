export default function MarketingLoading() {
  return (
    <div className="min-h-[70vh] overflow-hidden bg-[#f3f3f3]">
      <div className="relative isolate flex min-h-[56vh] items-center justify-center overflow-hidden bg-[#123251]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,#2970B7_0%,#123251_100%)]"
        />
        <div className="relative z-10 flex w-full max-w-5xl animate-pulse flex-col items-center gap-6 px-6 py-16 text-center">
          <div className="h-6 w-40 rounded-full bg-white/25" />
          <div className="h-16 w-full max-w-xl rounded-[32px] bg-white/20 sm:h-20" />
          <div className="h-5 w-full max-w-2xl rounded-full bg-white/15" />
          <div className="h-12 w-52 rounded-full bg-white/20" />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl animate-pulse gap-6 px-6 py-8 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`marketing-loading-card-${index}`}
            className="rounded-[28px] bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="h-48 rounded-[20px] bg-[#d9d9d9]" />
            <div className="mt-5 h-6 w-3/4 rounded-full bg-[#e7e7e7]" />
            <div className="mt-3 h-4 w-full rounded-full bg-[#eeeeee]" />
            <div className="mt-2 h-4 w-2/3 rounded-full bg-[#eeeeee]" />
          </div>
        ))}
      </div>
    </div>
  );
}
