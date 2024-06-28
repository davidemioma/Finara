import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/CustomInput";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  LoginSchema,
  LoginValidator,
} from "../../../../server/lib/validators/auth";

export const Route = createFileRoute("/auth/sign-in")({
  component: () => {
    const [showTwoFactor, setShowTwoFactor] = useState(false);

    const form = useForm<LoginValidator>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
        email: "",
        password: "",
        code: undefined,
      },
    });

    const { mutate, isPending } = useMutation({});

    const onSubmit = (values: LoginValidator) => {};

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
                        <Link to="/">Forgot password?</Link>
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
