import { Skeleton } from "@/components/ui/skeleton";

const TotalBoxSkeleton = () => {
  return (
    <section className="w-full rounded-xl border border-gray-200 p-4 shadow-chart sm:p-6">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex size-full max-w-[100px] items-center sm:max-w-[120px]">
          <Skeleton className="h-24 w-24 rounded-full border-[20px] border-gray-300" />
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex w-full items-center justify-between gap-4">
            <Skeleton className="h-5 w-32" />

            <Skeleton className="h-4 w-20" />
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-28" />

            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBoxSkeleton;
