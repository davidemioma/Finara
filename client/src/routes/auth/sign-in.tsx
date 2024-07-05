import { toast } from "sonner";
import { ZodError } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "@/components/Spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/CustomInput";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, authUserQueryOptions, accountsQueryOptions } from "@/lib/api";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  LoginSchema,
  LoginValidator,
} from "../../../../server/lib/validators/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

            queryClient.refetchQueries({
              queryKey: [accountsQueryOptions.queryKey],
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
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Two Factor Code</FormLabel>

                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="123456"
                            autoComplete="new-password"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <>
                    <CustomInput
                      control={form.control as any}
                      name="email"
                      isPending={isPending}
                      label="Email"
                      placeholder="john.doe@example.com"
                      type="email"
                    />

                    <>
                      <CustomInput
                        control={form.control as any}
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
                {isPending ? <Spinner /> : showTwoFactor ? "Confirm" : "Login"}
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
