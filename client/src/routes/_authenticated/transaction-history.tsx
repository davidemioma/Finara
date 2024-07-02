import AppLayout from "@/components/layouts/AppLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/transaction-history")({
  component: () => {
    const urlSearchString = window.location.search;

    const params = new URLSearchParams(urlSearchString);

    const id = params.get("id") || undefined;

    const page = params.get("page") || undefined;

    return (
      <AppLayout>
        Hello /_authenticated/transaction-history! {id} {page}
      </AppLayout>
    );
  },
});
