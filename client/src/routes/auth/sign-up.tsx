import React, { Suspense, lazy } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import Spinner from "@/components/Spinner";
import { Form } from "@/components/ui/form";
import useCountry from "@/hooks/use-country";
import { Button } from "@/components/ui/button";
import StateInput from "@/components/StateInput";
import CustomInput from "@/components/CustomInput";
import { useMutation } from "@tanstack/react-query";
import CountryInput from "@/components/CountryInput";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  RegisterSchema,
  RegisterValidator,
} from "../../../../server/lib/validators/auth";

export const Route = createFileRoute("/auth/sign-up")({
  loader: () => (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  ),
  component: () => {
    const { setCountry } = useCountry();

    const form = useForm<RegisterValidator>({
      resolver: zodResolver(RegisterSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        country: "",
        state: "bbbb",
        postcode: "",
        dateOfBirth: "",
        ssn: "",
        email: "",
        password: "",
      },
    });

    const { mutate, isPending } = useMutation({
      mutationKey: ["sign-up"],
      mutationFn: async (values: RegisterValidator) => {
        const res = await api.auth.register.$post({ json: values });

        if (!res.ok) {
          const data = await res.json();

          throw new Error(data.error);
        }

        return res;
      },
      onSuccess: async (res) => {
        if (res.ok) {
          const data = await res.json();

          toast.success(data.message);
        }

        setCountry("");

        form.reset();
      },
      onError: (err) => {
        if (err instanceof ZodError) {
          toast.error(err.issues.map((issues) => issues.message).join(" ,"));
        } else {
          toast.error(err.message || "Something went wrong!");
        }
      },
    });

    const onSubmit = (values: RegisterValidator) => {
      mutate(values);
    };

    return (
      <AuthLayout title="Sign up" subTitle="Please enter your details.">
        <div className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <CustomInput
                    control={form.control as any}
                    name="firstName"
                    isPending={isPending}
                    label="First Name"
                    placeholder="Enter your first name"
                  />

                  <CustomInput
                    control={form.control as any}
                    name="lastName"
                    isPending={isPending}
                    label="Last Name"
                    placeholder="Enter your last name"
                  />
                </div>

                <CustomInput
                  control={form.control as any}
                  name="address"
                  isPending={isPending}
                  label="Address"
                  placeholder="Enter your specific address"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <CountryInput
                    form={form as any}
                    label="Country"
                    disabled={isPending}
                  />

                  <StateInput
                    form={form as any}
                    label="State"
                    disabled={isPending}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <CustomInput
                    control={form.control as any}
                    name="city"
                    isPending={isPending}
                    label="City"
                    placeholder="Enter your city"
                  />

                  <CustomInput
                    control={form.control as any}
                    name="postcode"
                    isPending={isPending}
                    label="Postal Code"
                    placeholder="ex: 11101"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <CustomInput
                    control={form.control as any}
                    name="dateOfBirth"
                    isPending={isPending}
                    label="Date of Birth"
                    placeholder="yyyy-mm-dd"
                    type="date"
                  />

                  <CustomInput
                    control={form.control as any}
                    name="ssn"
                    isPending={isPending}
                    label="SSN"
                    placeholder="ex: 1234"
                  />
                </div>

                <CustomInput
                  control={form.control as any}
                  name="email"
                  isPending={isPending}
                  label="Email"
                  placeholder="john.doe@example.com"
                  type="email"
                />

                <CustomInput
                  control={form.control as any}
                  name="password"
                  isPending={isPending}
                  label="Password"
                  placeholder="******"
                  type="password"
                />
              </div>

              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? <Spinner /> : "Sign up"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-[14px] font-normal leading-5 text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/sign-in" className="font-medium text-bankGradient">
              Sign in
            </Link>
          </p>
        </div>
      </AuthLayout>
    );
  },
});
