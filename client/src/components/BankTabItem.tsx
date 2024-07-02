import { cn, formUrlQuery } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  name: string;
  active: boolean;
  bankId: string;
};

const BankTabItem = ({ name, active, bankId }: Props) => {
  const navigate = useNavigate();

  const urlSearchString = window.location.search;

  const searchParams = new URLSearchParams(urlSearchString);

  const onClick = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: bankId,
    });

    navigate({ to: newUrl });
  };

  return (
    <div
      className={cn(
        `border-b-4 px-2 py-2 transition-all sm:px-4`,
        active && "border-blue-600",
      )}
      onClick={onClick}
    >
      <p
        className={cn(
          `line-clamp-1 flex-1 text-[16px] font-medium leading-5 text-gray-500`,
          active && "text-blue-600",
        )}
      >
        {name}
      </p>
    </div>
  );
};

export default BankTabItem;
