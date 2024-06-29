import { toast } from "sonner";
import { ZodError } from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/CustomInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, authUserQueryOptions } from "@/lib/api";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  LoginSchema,
  LoginValidator,
} from "../../../../server/lib/validators/auth";

export const Route = createFileRoute("/auth/sign-in")({
  component: () => {
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const [showTwoFactor, setShowTwoFactor] = useState(false);

    const form = useForm<LoginValidator>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
        email: "",
        password: "",
        code: undefined,
      },
    });

    const { mutate, isPending } = useMutation({
      mutationKey: ["sign-in"],
      mutationFn: async (values: LoginValidator) => {
        const res = await api.auth.login.$post({ json: values });

        if (!res.ok) {
          if (res.status === 403) {
            toast.info("Confirmation email sent!");
          }

          const data = await res.json();

          throw new Error(data.error || "Something went wrong!");
        }

        return res;
      },
      onSuccess: (res) => {
        if (res.ok) {
          if (res.status === 202) {
            setShowTwoFactor(true);
          } else {
            navigate({ to: "/" });

            queryClient.invalidateQueries({
              queryKey: [authUserQueryOptions.queryKey],
            });
          }
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

    const onSubmit = (values: LoginValidator) => {
      mutate(values);
    };

    return (
      <AuthLayout
        title="Log in"
        subTitle="Welcome back! Please enter your details."
      >
        <div className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {showTwoFactor ? (
                  <CustomInput
                    control={form.control}
                    name="code"
                    isPending={isPending}
                    label="Two Factor Code"
                    placeholder="123456"
                    offAutoComplete
                  />
                ) : (
                  <>
                    <CustomInput
                      control={form.control}
                      name="email"
                      isPending={isPending}
                      label="Email"
                      placeholder="john.doe@example.com"
                      type="email"
                    />

                    <>
                      <CustomInput
                        control={form.control}
                        name="password"
                        isPending={isPending}
                        label="Password"
                        placeholder="******"
                        type="password"
                      />

                      <Button
                        className="px-0 font-normal"
                        asChild
                        size="sm"
                        variant="link"
                        disabled={isPending}
                      >
                        <Link to="/auth/reset">Forgot password?</Link>
                      </Button>
                    </>
                  </>
                )}
              </div>

              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    Loading...
                  </>
                ) : showTwoFactor ? (
                  "Confirm"
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-[14px] font-normal leading-5 text-gray-600">
            Don't have an account?{" "}
            <Link to="/auth/sign-up" className="font-medium text-bankGradient">
              Sign up
            </Link>
          </p>
        </div>
      </AuthLayout>
    );
  },
});
