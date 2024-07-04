import { Skeleton } from "../ui/skeleton";

const CardSkeletons = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <Skeleton className="h-7 w-40" />

      <div className="flex flex-wrap gap-6">
        {new Array(6).fill("").map((_, i) => (
          <Skeleton
            key={i}
            className="h-[190px] w-full max-w-[320px] rounded-[20px]"
          />
        ))}
      </div>
    </div>
  );
};

export default CardSkeletons;
