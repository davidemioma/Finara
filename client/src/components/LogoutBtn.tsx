import { toast } from "sonner";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LogoutBtn = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      const res = await api.auth.logout.$get();

      if (!res.ok) {
        throw new Error("Something went wrong!");
      }
    },
    onSuccess: () => {
      navigate({ to: "/auth/sign-in" });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={() => mutate()} disabled={isPending}>
          <img src="icons/logout.svg" alt="logout-icon" loading="lazy" />
        </TooltipTrigger>

        <TooltipContent className="bg-[#000000]/70 text-white">
          <p>Sign out</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LogoutBtn;
