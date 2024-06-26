import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-up")({
  component: () => <div>Hello /auth/sign-up!</div>,
});
