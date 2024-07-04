import { ZodError } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import Spinner from "@/components/Spinner";
import Heading from "@/components/Heading";
import useAccount from "@/hooks/use-account";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BankSelect from "@/components/BankSelect";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import AppLayout from "@/components/layouts/AppLayout";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TransferSchema,
  TransferValidator,
} from "../../../../server/lib/validators/transfer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

export const Route = createFileRoute("/_authenticated/payment-transfer")({
  component: () => {
    const { data: banks } = useAccount();

    const form = useForm<TransferValidator>({
      resolver: zodResolver(TransferSchema),
      defaultValues: {
        note: "",
        email: "",
        amount: 0,
        senderBank: "",
        sharaebleId: "",
      },
    });

    const { mutate, isPending } = useMutation({
      mutationKey: ["transfer"],
      mutationFn: async (values: TransferValidator) => {},
      onSuccess: (res) => {},
      onError: (err) => {
        if (err instanceof ZodError) {
          toast.error(err.issues.map((issues) => issues.message).join(" ,"));
        } else {
          toast.error(err.message);
        }
      },
    });

    const onSubmit = (values: TransferValidator) => {
      mutate(values);
    };

    return (
      <AppLayout>
        <div className="no-scrollbar flex h-screen w-full flex-col gap-8 overflow-y-scroll bg-gray-25 p-8 xl:py-12">
          <Heading
            type="title"
            title="Payment Transfer"
            subtitle="Please provide any specific details or notes related to the payment transfer."
          />

          <div className="w-full">
            <div className="flex flex-col gap-1.5 border-b border-gray-200 pb-5">
              <h3 className="text-[16px] font-semibold leading-5">
                Transfer details
              </h3>

              <p className="text-[12px] leading-4">
                Enter the details of the transfer.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="senderBank"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex w-full max-w-[850px] flex-col gap-3 pb-6 pt-5 md:flex-row lg:gap-8">
                        <div className="flex w-full max-w-[280px] flex-col gap-2">
                          <FormLabel className="text-[14px] font-medium leading-5 text-gray-700">
                            Select Source Bank
                          </FormLabel>

                          <FormDescription className="text-[12px] font-normal leading-4 text-gray-600">
                            Select the bank account you want to transfer funds
                            from
                          </FormDescription>
                        </div>

                        <div className="flex flex-1 flex-col gap-1">
                          <FormControl>
                            {banks && (
                              <BankSelect
                                accounts={banks?.accounts}
                                setValue={(value) => field.onChange(value)}
                              />
                            )}
                          </FormControl>

                          <FormMessage className="text-[12px] leading-4 text-red-500" />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex w-full max-w-[850px] flex-col gap-3 pb-6 pt-5 md:flex-row lg:gap-8">
                        <div className="flex w-full max-w-[280px] flex-col gap-2">
                          <FormLabel className="text-[14px] font-medium leading-5 text-gray-700">
                            Transfer Note (Optional)
                          </FormLabel>

                          <FormDescription className="text-[12px] font-normal leading-4 text-gray-600">
                            Please provide any additional information or
                            instructions related to the transfer
                          </FormDescription>
                        </div>

                        <div className="flex flex-1 flex-col gap-1">
                          <FormControl>
                            <Textarea
                              className="rounded-lg border border-gray-300 text-[16px] leading-6 text-gray-900 placeholder:text-[16px] placeholder:leading-6 placeholder:text-gray-500"
                              placeholder="Write a short note here"
                              {...field}
                              disabled={isPending}
                            />
                          </FormControl>

                          <FormMessage className="text-[12px] leading-4 text-red-500" />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-1.5 border-b border-gray-200 pb-5">
                  <h3 className="text-[16px] font-semibold leading-5">
                    Bank account details
                  </h3>

                  <p className="text-[12px] leading-4">
                    Enter the details of the recipient.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex w-full max-w-[850px] flex-col gap-3 pb-6 pt-5 md:flex-row md:items-center lg:gap-8">
                        <div className="flex w-full max-w-[280px] flex-col gap-2">
                          <FormLabel className="text-[14px] font-medium leading-5 text-gray-700">
                            Recipient&apos;s Email Address
                          </FormLabel>
                        </div>

                        <div className="flex flex-1 flex-col gap-1">
                          <FormControl>
                            <Input
                              className="rounded-lg border border-gray-300 text-[16px] leading-6 text-gray-900 placeholder:text-[16px] placeholder:leading-6 placeholder:text-gray-500"
                              placeholder="ex: johndoe@gmail.com"
                              {...field}
                              disabled={isPending}
                            />
                          </FormControl>

                          <FormMessage className="text-[12px] leading-4 text-red-500" />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sharaebleId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex w-full max-w-[850px] flex-col gap-3 pb-6 pt-5 md:flex-row md:items-center lg:gap-8">
                        <div className="flex w-full max-w-[280px] flex-col gap-2">
                          <FormLabel className="text-[14px] font-medium leading-5 text-gray-700">
                            Receiver&apos;s Plaid Sharable Id
                          </FormLabel>
                        </div>

                        <div className="flex flex-1 flex-col gap-1">
                          <FormControl>
                            <Input
                              className="rounded-lg border border-gray-300 text-[16px] leading-6 text-gray-900 placeholder:text-[16px] placeholder:leading-6 placeholder:text-gray-500"
                              placeholder="Enter the public account number"
                              {...field}
                              disabled={isPending}
                            />
                          </FormControl>

                          <FormMessage className="text-[12px] leading-4 text-red-500" />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex w-full max-w-[850px] flex-col gap-3 pb-6 pt-5 md:flex-row md:items-center lg:gap-8">
                        <div className="flex w-full max-w-[280px] flex-col gap-2">
                          <FormLabel className="text-[14px] font-medium leading-5 text-gray-700">
                            Amount
                          </FormLabel>
                        </div>

                        <div className="flex flex-1 flex-col gap-1">
                          <FormControl>
                            <Input
                              className="rounded-lg border border-gray-300 text-[16px] leading-6 text-gray-900 placeholder:text-[16px] placeholder:leading-6 placeholder:text-gray-500"
                              placeholder="ex: 5.00"
                              type="number"
                              step="0.01"
                              min={0}
                              {...field}
                              disabled={isPending}
                            />
                          </FormControl>

                          <FormMessage className="text-[12px] leading-4 text-red-500" />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="w-full max-w-[850px] border-t border-gray-200 py-5">
                  <Button
                    type="submit"
                    className="text-14 w-full bg-bank-gradient font-semibold text-white shadow-form"
                    disabled={isPending}
                  >
                    {isPending ? <Spinner /> : "Transfer Funds"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </AppLayout>
    );
  },
});
