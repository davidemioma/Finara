import { useQuery } from "@tanstack/react-query";
import { authUserQueryOptions, accountsQueryOptions, api } from "@/lib/api";

const useAccount = () => {
  const urlSearchString = window.location.search;

  const searchParams = new URLSearchParams(urlSearchString);

  const id = searchParams.get("id") || undefined;

  const page = searchParams.get("page") || undefined;

  const { data: user, isLoading, isError } = useQuery(authUserQueryOptions);

  const {
    data,
    isLoading: accsLoading,
    isError: accsErr,
  } = useQuery(accountsQueryOptions);

  const bankId = id ? id : `${data?.accounts?.[0].dbBankId}`;

  const {
    data: accountData,
    isLoading: accLoading,
    isError: accErr,
  } = useQuery({
    queryKey: ["get-first-account", bankId],
    queryFn: async () => {
      if (!bankId) return;

      const res = await api.bank.account[":bankId"].$get({
        param: {
          bankId,
        },
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      return res.json();
    },
    staleTime: Infinity,
  });

  return {
    id,
    bankId,
    page,
    user,
    isLoading,
    isError,
    data,
    accsLoading,
    accsErr,
    accountData,
    accLoading,
    accErr,
  };
};

export default useAccount;
