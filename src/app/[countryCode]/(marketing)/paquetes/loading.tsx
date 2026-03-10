import Spinner from "@modules/common/icons/spinner";

export default function Loading() {
  return (
    <div className="w-[90%] md:w-[85%] mx-auto mt-10 pb-12">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 space-y-4 animate-pulse">
          <div className="h-14 rounded-2xl bg-muted" />
          <div className="h-56 rounded-2xl bg-muted" />
          <div className="h-56 rounded-2xl bg-muted" />
        </div>

        <div className="w-full lg:w-3/4">
          <div className="flex items-center gap-3 text-[#2970b7] font-semibold mb-5">
            <Spinner size={25} />
            <span>Actualizando </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
            <div className="h-60 rounded-2xl bg-muted" />
            <div className="h-60 rounded-2xl bg-muted" />
            <div className="h-60 rounded-2xl bg-muted" />
            <div className="h-60 rounded-2xl bg-muted" />
            <div className="h-60 rounded-2xl bg-muted" />
            <div className="h-60 rounded-2xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
