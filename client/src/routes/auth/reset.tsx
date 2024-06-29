import { api } from "@/lib/api";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/CustomInput";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "@/components/layouts/AuthLayout";
import { createFileRoute } from "@tanstack/react-router";
import {
  ResetSchema,
  ResetValidator,
} from "../../../../server/lib/validators/auth";

export const Route = createFileRoute("/auth/reset")({
  component: () => {
    const form = useForm<ResetValidator>({
      resolver: zodResolver(ResetSchema),
      defaultValues: {
        email: "",
      },
    });

    const { mutate, isPending } = useMutation({
      mutationKey: ["reset-password"],
      mutationFn: async (values: ResetValidator) => {
        const res = await api.auth["reset-password"].$post({ json: values });

        if (!res.ok) {
          const data = await res.json();

          throw new Error(data.error);
        }

        return res;
      },
      onSuccess: (res) => {
        if (res.ok) {
          toast.success("Password reset email sent!");
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

    const onSubmit = (values: ResetValidator) => {
      mutate(values);
    };

    return (
      <AuthLayout title="Forgot your password?" subTitle="Enter your email">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <CustomInput
                name="email"
                type="email"
                label="Email"
                control={form.control as any}
                placeholder="john.doe@example.com"
                isPending={isPending}
              />
            </div>

            <Button className="w-full" type="submit" disabled={isPending}>
              Send reset email
            </Button>
          </form>
        </Form>
      </AuthLayout>
    );
  },
});
