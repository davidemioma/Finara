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
  RegisterSchema,
  RegisterValidator,
} from "../../../../server/lib/validators/auth";
import CountryInput from "@/components/CountryInput";
import StateInput from "@/components/StateInput";

export const Route = createFileRoute("/auth/sign-up")({
  component: () => {
    const form = useForm<RegisterValidator>({
      resolver: zodResolver(RegisterSchema),
      defaultValues: {
        firstName: "",
        LastName: "",
        address: "",
        city: "",
        country: "",
        state: "",
        postcode: "",
        dateOfBirth: "",
        ssn: "",
        email: "",
        password: "",
      },
    });

    const { mutate, isPending } = useMutation({});

    const onSubmit = (values: RegisterValidator) => {};

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
                    name="LastName"
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
                    form={form}
                    label="Country"
                    disabled={isPending}
                  />

                  <StateInput
                    form={form}
                    label="State"
                    disabled={isPending}
                    country={form.getValues("country")}
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
                {isPending ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    Loading...
                  </>
                ) : (
                  "Sign up"
                )}
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
