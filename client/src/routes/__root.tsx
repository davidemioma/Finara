import { Toaster } from "sonner";
import NotFound from "@/components/NotFound";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: () => <NotFound />,
  component: () => (
    <>
      <Toaster richColors position="bottom-right" />

      <Outlet />
    </>
  ),
});
