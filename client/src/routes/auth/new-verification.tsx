import { toast } from "sonner";
import { ZodError } from "zod";
import { api } from "@/lib/api";
import Spinner from "@/components/Spinner";
import { useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import AuthLayout from "@/components/layouts/AuthLayout";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/new-verification")({
  component: () => {
    const navigate = useNavigate();

    const urlSearchString = window.location.search;

    const params = new URLSearchParams(urlSearchString);

    const token = params.get("token") || undefined;

    const { mutate, isPending } = useMutation({
      mutationKey: ["verify-email", token],
      mutationFn: async () => {
        if (!token) return;

        const res = await api.auth["verify-email"].$patch({ json: { token } });

        if (!res.ok) {
          const data = await res.json();

          throw new Error(data.error);
        }

        return res;
      },
      onSuccess: (res) => {
        if (res?.ok) {
          toast.success(
            "Email has been verified. Redirecting to sign in page...",
          );

          navigate({ to: "/auth/sign-in" });
        }
      },
      onError: (err) => {
        if (err instanceof ZodError) {
          toast.error(err.issues.map((issues) => issues.message).join(" ,"));
        } else {
          toast.error(err.message);
        }
      },
    });

    const verify = useCallback(() => {
      mutate();
    }, [token]);

    useEffect(() => {
      verify();
    }, [verify]);

    return (
      <AuthLayout
        title="Email Verification"
        subTitle="Confirming your verification"
      >
        <div className="mb-3 flex w-full items-center justify-center">
          {isPending && <Spinner />}
        </div>

        <p className="text-center text-[14px] font-normal leading-5 text-gray-600">
          Back to login?{" "}
          <Link to="/auth/sign-in" className="font-medium text-bankGradient">
            Sign in
          </Link>
        </p>
      </AuthLayout>
    );
  },
});
