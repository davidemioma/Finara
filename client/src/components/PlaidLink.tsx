import { toast } from "sonner";
import { useCallback } from "react";
import { Button } from "./ui/button";
import { UserProps } from "@/server/lib/middleware";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsQueryOptions, api, bankCountQueryOptions } from "@/lib/api";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";

type Props = {
  user: UserProps;
  variant?: "primary" | "ghost";
};

const PlaidLink = ({ user, variant }: Props) => {
  const queryClient = useQueryClient();

  const { data: token, isPending: isLoading } = useQuery({
    queryKey: ["get-plaid-link-token", user.id],
    queryFn: async () => {
      const res = await api.user["create-link-token"].$post();

      if (!res.ok) {
        const data = await res.json();

        toast.error(data.error || "Something went wrong!");

        throw new Error("Something went wrong!");
      }

      const data = await res.json();

      return data.linkToken;
    },
    staleTime: Infinity,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["exchange-public-token", user.id],
    mutationFn: async (publicToken: string) => {
      await api.user["exchange-public-token"].$post({ json: { publicToken } });
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [
          bankCountQueryOptions.queryKey,
          accountsQueryOptions.queryKey,
          "get-first-account",
        ],
      });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      mutate(public_token);
    },
    [user],
  );

  const config: PlaidLinkOptions = {
    token: token || "",
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === "primary" ? (
        <Button
          className="rounded-lg border border-bankGradient bg-bank-gradient text-[16px] font-semibold leading-5 text-white shadow-form"
          onClick={() => open()}
          disabled={!ready || isLoading || isPending}
        >
          Connect bank
        </Button>
      ) : variant === "ghost" ? (
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-3 rounded-lg px-3 py-7 hover:bg-white lg:justify-start"
          onClick={() => open()}
          disabled={isLoading || isPending}
        >
          <img
            src="/icons/connect-bank.svg"
            width={24}
            height={24}
            loading="lazy"
            alt="connect bank"
          />

          <p className="text-[16px] font-semibold leading-5 text-black-2 xl:block">
            Connect bank
          </p>
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="flex justify-start gap-3 rounded-lg px-2"
          onClick={() => open()}
          disabled={isLoading || isPending}
        >
          <img
            src="/icons/connect-bank.svg"
            width={24}
            height={24}
            loading="lazy"
            alt="connect bank"
          />

          <p className="text-[12px] font-semibold leading-5 text-black-2 xl:block">
            Connect bank
          </p>
        </Button>
      )}
    </>
  );
};

export default PlaidLink;
