import { cn } from "@/lib/utils";
import { CategoryCount } from "@/lib/utils";
import { topCategoryStyles } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";

type Props = {
  category: CategoryCount;
};

const Category = ({ category }: Props) => {
  const {
    bg,
    circleBg,
    text: { main, count },
    progress: { bg: progressBg, indicator },
    icon,
  } = topCategoryStyles[category.name as keyof typeof topCategoryStyles] ||
  topCategoryStyles.default;

  return (
    <div className={cn("flex gap-5 rounded-xl p-4", bg)}>
      <div
        className={cn(
          "flex size-10 flex-shrink-0 items-center justify-center rounded-full",
          circleBg,
        )}
      >
        <img
          src={icon}
          width={20}
          height={20}
          alt={category.name}
          loading="lazy"
        />
      </div>

      <div className="flex w-full flex-1 flex-col gap-2">
        <div className="flex justify-between text-[14px] leading-5">
          <h2 className={cn("font-medium", main)}>{category.name}</h2>

          <h3 className={cn("font-normal", count)}>{category.count}</h3>
        </div>

        <Progress
          className={cn("h-2 w-full", progressBg)}
          indicatorClassName={cn("h-2 w-full", indicator)}
          value={(category.count / category.totalCount) * 100}
        />
      </div>
    </div>
  );
};

export default Category;
