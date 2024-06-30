import { api } from "@/lib/api";
import { useCallback } from "react";
import { Button } from "./ui/button";
import AuthLayout from "./layouts/AuthLayout";
import { useQuery } from "@tanstack/react-query";
import { UserProps } from "@/server/lib/middleware";
import { useNavigate } from "@tanstack/react-router";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { toast } from "sonner";

type Props = {
  user: UserProps;
  variant: string;
};

const PlaidLink = ({ user, variant }: Props) => {
  const navigate = useNavigate();

  const { data: token } = useQuery({
    queryKey: ["get-plaid-link-token", user.id],
    queryFn: async () => {
      // const res = await api.user["create-link-token"].$post();
      // if (!res.ok) {
      //   const data = await res.json();
      //   toast.error(data.error || "Something went wrong!");
      //   throw new Error("Something went wrong!");
      // }
      // const data = await res.json();
      // return data.linkToken;
    },
    staleTime: Infinity,
  });

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {},
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
          disabled={!ready}
        >
          Connect bank
        </Button>
      ) : variant === "ghost" ? (
        <Button
          variant="ghost"
          className="flex items-center justify-center gap-3 rounded-lg px-3 py-7 hover:bg-white lg:justify-start"
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
