import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import AuthLayout from "../../components/layouts/AuthLayout";
import {
  LoginSchema,
  LoginValidator,
} from "../../../../server/lib/validators/auth";

export const Route = createFileRoute("/auth/sign-in")({
  component: () => {
    const form = useForm<LoginValidator>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
        email: "",
        password: "",
        code: undefined,
      },
    });

    return (
      <AuthLayout
        title="Log in"
        subTitle="Welcome back! Please enter your details."
      >
        Hello /auth/sign-in!
      </AuthLayout>
    );
  },
});
