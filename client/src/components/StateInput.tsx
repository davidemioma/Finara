import { Input } from "./ui/input";
import { StateProps } from "@/types";
import states from "../data/states.json";
import { useEffect, useState } from "react";
import useCountry from "@/hooks/use-country";
import { UseFormReturn } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RegisterValidator } from "@/server/lib/validators/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  form: UseFormReturn<RegisterValidator>;
  label: string;
  disabled: boolean;
};

const StateInput = ({ form, label, disabled }: Props) => {
  const { country } = useCountry();

  const [value, setValue] = useState("");

  const [filteredStates, setFilteredStates] = useState<StateProps[]>(
    states as StateProps[],
  );

  useEffect(() => {
    const filtered = states.filter(
      (state) => state.country_name.toLowerCase() === country,
    ) as StateProps[];

    setFilteredStates(filtered);

    setValue("");

    form.setValue("state", "");
  }, [country, form]);

  useEffect(() => {
    const filtered = states.filter(
      (state) =>
        state.country_name.toLowerCase() === country &&
        state.name.toLowerCase().includes(value.toLowerCase()),
    ) as StateProps[];

    setFilteredStates(filtered);
  }, [value, country, form]);

  return (
    <FormField
      control={form.control}
      name="state"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-[14px] font-medium leading-5">
            {label}
          </FormLabel>

          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={!country.trim() || disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select State..." />
              </SelectTrigger>
            </FormControl>

            <SelectContent className="w-full p-0">
              <Input
                className="mb-3 border-x-0 border-b border-t-0 bg-transparent"
                placeholder="Search State..."
                value={value}
                autoFocus
                onChange={(e) => setValue(e.target.value)}
                disabled={!country.trim() || disabled}
                autoComplete="new-password"
              />

              <ScrollArea className="h-[200px] w-full">
                {filteredStates.length === 0 ? (
                  <div className="flex items-center justify-center p-4 text-sm">
                    No state found.
                  </div>
                ) : (
                  <>
                    {filteredStates?.map((state) => (
                      <SelectItem
                        key={state.id}
                        className="w-full p-2"
                        value={state.name}
                      >
                        <div className="flex items-end gap-2">
                          <span className="">{state.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </ScrollArea>
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StateInput;
