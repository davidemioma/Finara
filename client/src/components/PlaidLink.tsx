import { toast } from "sonner";
import { Button } from "./ui/button";
import AuthLayout from "./layouts/AuthLayout";
import { UserProps } from "@/server/lib/middleware";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsQueryOptions, api, bankCountQueryOptions } from "@/lib/api";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";

type Props = {
  user: UserProps;
  variant: string;
};

const PlaidLink = ({ user, variant }: Props) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [token, setToken] = useState("");

  const { mutate: getLinkToken, isPending: isLoading } = useMutation({
    mutationKey: ["get-plaid-link-token", user.id],
    mutationFn: async () => {
      const res = await api.user["create-link-token"].$post();

      if (!res.ok) {
        const data = await res.json();

        toast.error(data.error || "Something went wrong!");

        throw new Error("Something went wrong!");
      }

      const data = await res.json();

      return data.linkToken;
    },
    onSuccess: (data) => {
      setToken(data);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  useEffect(() => {
    getLinkToken();
  }, [user]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["exchange-public-token", user.id],
    mutationFn: async (publicToken: string) => {
      await api.user["exchange-public-token"].$post({ json: { publicToken } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [bankCountQueryOptions.queryKey],
      });

      queryClient.invalidateQueries({
        queryKey: [accountsQueryOptions.queryKey],
      });

      queryClient.invalidateQueries({
        queryKey: ["get-first-account"],
      });

      navigate({ to: "/" });
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
    <AuthLayout
      title={`Welcome, ${user.firstName}`}
      subTitle="Connect your bank account"
    >
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
          variant="secondary"
          className="flex justify-start gap-3 rounded-lg"
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
      )}
    </AuthLayout>
  );
};

export default PlaidLink;
