import PlaidLink from "@/components/PlaidLink";
import { UserProps } from "@/server/lib/middleware";
import AuthLayout from "@/components/layouts/AuthLayout";
import { authUserQueryOptions, bankCountQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    try {
      const user = await queryClient.fetchQuery(authUserQueryOptions);

      const bankCount = await queryClient.fetchQuery(bankCountQueryOptions);

      return { user, bankCount };
    } catch (e) {
      return { user: null, bankCount: 0 };
    }
  },
  component: () => {
    const { user, bankCount } = Route.useRouteContext();

    if (!user) {
      return <Navigate to="/auth/sign-in" />;
    }

    if (user && bankCount === 0) {
      return (
        <AuthLayout
          title={`Welcome, ${user.firstName}`}
          subTitle="Connect your bank account"
        >
          <PlaidLink user={user as UserProps} variant="primary" />
        </AuthLayout>
      );
    }

    return <Outlet />;
  },
});
