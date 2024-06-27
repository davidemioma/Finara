import { createFileRoute } from "@tanstack/react-router";
import AuthLayout from "../../components/layouts/AuthLayout";

export const Route = createFileRoute("/auth/sign-up")({
  component: () => (
    <AuthLayout title="Sign up" subTitle="Please enter your details.">
      Hello /auth/sign-up!
    </AuthLayout>
  ),
});
