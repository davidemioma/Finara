import { Input } from "./ui/input";
import { StateProps } from "@/types";
import states from "../data/states.json";
import { useEffect, useState } from "react";
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
  country: string;
};

const StateInput = ({ form, label, disabled, country }: Props) => {
  const [value, setValue] = useState("");

  const s = states.filter(
    (state) => state.country_name.toLowerCase() === country.toLowerCase(),
  ) as StateProps[];

  const [stateList, setStateList] = useState<StateProps[]>(s);

  useEffect(() => {
    setStateList(() =>
      s.filter((state) =>
        state.country_name.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  }, [value, s]);

  return (
    <FormField
      control={form.control}
      name="country"
      disabled={!country.trim() || disabled}
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
                onChange={(e) => setValue(e.target.value)}
                disabled={!country.trim() || disabled}
              />

              <ScrollArea className="h-[200px] w-full">
                {stateList.length === 0 ? (
                  <div className="flex items-center justify-center p-4 text-sm">
                    No state found.
                  </div>
                ) : (
                  <>
                    {stateList?.map((state) => (
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
