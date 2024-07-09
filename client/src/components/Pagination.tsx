import { formUrlQuery } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  page: number;
  totalPages: number;
};

export const Pagination = ({ page, totalPages }: Props) => {
  const navigate = useNavigate();

  const urlSearchString = window.location.search;

  const searchParams = new URLSearchParams(urlSearchString);

  const handleNavigation = (type: "prev" | "next") => {
    const pageNumber = type === "prev" ? page - 1 : page + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: pageNumber.toString(),
    });

    navigate({ to: newUrl });
  };

  return (
    <div className="flex justify-between gap-3">
      <Button
        className="p-0 hover:bg-transparent"
        size="lg"
        variant="ghost"
        onClick={() => handleNavigation("prev")}
        disabled={Number(page) <= 1}
      >
        <img
          className="mr-2"
          src="/icons/arrow-left.svg"
          width={20}
          height={20}
          alt="arrow"
          loading="lazy"
        />
        Prev
      </Button>

      <p className="text-14 flex items-center px-2">
        {page} / {totalPages}
      </p>

      <Button
        className="p-0 hover:bg-transparent"
        size="lg"
        variant="ghost"
        onClick={() => handleNavigation("next")}
        disabled={Number(page) >= totalPages}
      >
        Next
        <img
          className="ml-2 -scale-x-100"
          src="/icons/arrow-left.svg"
          width={20}
          height={20}
          alt="arrow"
          loading="lazy"
        />
      </Button>
    </div>
  );
};
