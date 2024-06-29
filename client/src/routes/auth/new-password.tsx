import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ZodError } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/CustomInput";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "@/components/layouts/AuthLayout";
import {
  NewPasswordSchema,
  NewPasswordValidator,
} from "../../../../server/lib/validators/auth";

export const Route = createFileRoute("/auth/new-password")({
  component: () => {
    const navigate = useNavigate();

    const urlSearchString = window.location.search;

    const params = new URLSearchParams(urlSearchString);

    const token = params.get("token") || undefined;

    const form = useForm<NewPasswordValidator>({
      resolver: zodResolver(NewPasswordSchema),
      defaultValues: {
        password: "",
        token,
      },
    });

    const { mutate, isPending } = useMutation({
      mutationKey: ["change-password", token],
      mutationFn: async (values: NewPasswordValidator) => {
        if (!token) {
          toast.error("Invalid token!");

          return;
        }

        const res = await api.auth["new-password"].$patch({
          json: values,
        });

        if (!res.ok) {
          const data = await res.json();

          throw new Error(data.error);
        }

        return res;
      },
      onSuccess: (res) => {
        if (res?.ok) {
          toast.success(
            "Password has been reset. Redirecting to sign in page...",
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

    const onSubmit = (values: NewPasswordValidator) => {
      mutate(values);
    };

    return (
      <AuthLayout title="Reset your password" subTitle="Enter a new password">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <CustomInput
                name="password"
                type="password"
                label="Password"
                control={form.control as any}
                placeholder="******"
                isPending={isPending}
              />
            </div>

            <Button className="w-full" type="submit" disabled={isPending}>
              Reset password
            </Button>
          </form>
        </Form>
      </AuthLayout>
    );
  },
});
