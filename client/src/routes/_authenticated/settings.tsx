import { ZodError } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import Heading from "@/components/Heading";
import Spinner from "@/components/Spinner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/CustomInput";
import { authUserQueryOptions, api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import AppLayout from "@/components/layouts/AppLayout";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  SettingsSchema,
  SettingsValidator,
} from "../../../../server/lib/validators/auth";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

export const Route = createFileRoute("/_authenticated/settings")({
  component: () => {
    const queryClient = useQueryClient();

    const { data: user, isLoading, error } = useQuery(authUserQueryOptions);

    if (isLoading) {
      return (
        <div className="flex w-full items-center justify-center p-4">
          <Spinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex w-full items-center justify-center p-4">
          <p>Something went wrong!</p>
        </div>
      );
    }

    const form = useForm<SettingsValidator>({
      resolver: zodResolver(SettingsSchema),
      defaultValues: {
        firstName: user?.firstName || undefined,
        lastName: user?.lastName || undefined,
        email: user?.email || undefined,
        address: user?.address || undefined,
        city: user?.city || undefined,
        postcode: user?.postcode || undefined,
        ssn: user?.ssn || undefined,
        dateOfBirth: user?.dateOfBirth || undefined,
        isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
        password: undefined,
        newPassword: undefined,
      },
    });

    const { mutate, isPending } = useMutation({
      mutationKey: ["save-settings"],
      mutationFn: async (values: SettingsValidator) => {
        const res = await api.user["update-settings"].$patch({ json: values });

        if (!res.ok) {
          const data = await res.json();

          throw new Error(data.error);
        }

        return res;
      },
      onSuccess: (res) => {
        if (res.ok) {
          if (res.status === 202) {
            toast.success("Confirmation link has been sent to your new email");
          } else {
            toast.success("Settings updated");
          }

          form.reset();

          queryClient.invalidateQueries({
            queryKey: [authUserQueryOptions.queryKey],
          });
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

    const onSubmit = (values: SettingsValidator) => {
      mutate(values);
    };

    return (
      <AppLayout>
        <main className="no-scrollbar flex h-screen w-full overflow-y-scroll">
          <div className="page-container">
            <Heading
              title="Settings"
              subtitle="Customise your Account"
              type="title"
            />

            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
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

                  <div className="grid gap-4 sm:grid-cols-2">
                    <CustomInput
                      control={form.control as any}
                      name="email"
                      isPending={isPending}
                      label="Email"
                      placeholder="john.doe@example.com"
                      type="email"
                    />

                    <FormField
                      control={form.control}
                      name="isTwoFactorEnabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Two Factor Authentication</FormLabel>

                            <FormDescription>
                              Enable two factor authentication for your account
                            </FormDescription>
                          </div>

                          <FormControl>
                            <Switch
                              disabled={isPending}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <CustomInput
                      control={form.control as any}
                      name="password"
                      isPending={isPending}
                      label="Password"
                      placeholder="******"
                      type="password"
                    />

                    <CustomInput
                      control={form.control as any}
                      name="newPassword"
                      isPending={isPending}
                      label="New Password"
                      placeholder="******"
                      type="password"
                    />
                  </div>
                </div>

                <div className="flex w-full justify-end">
                  <Button disabled={isPending} type="submit">
                    {isPending ? <Spinner /> : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </main>
      </AppLayout>
    );
  },
});
