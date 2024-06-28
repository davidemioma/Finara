import { Input } from "./ui/input";
import { CountryProps } from "@/types";
import { useEffect, useState } from "react";
import countries from "../data/countries.json";
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

const CountryInput = ({ form, label, disabled }: Props) => {
  const [value, setValue] = useState("");

  const c = countries as CountryProps[];

  const [countryList, setCountryList] = useState<CountryProps[]>(c);

  useEffect(() => {
    setCountryList(() =>
      c.filter((country) =>
        country.name.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  }, [value, c]);

  return (
    <FormField
      control={form.control}
      name="country"
      disabled={disabled}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-[14px] font-medium leading-5">
            {label}
          </FormLabel>

          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Country..." />
              </SelectTrigger>
            </FormControl>

            <SelectContent className="w-full p-0">
              <Input
                className="mb-3 border-x-0 border-b border-t-0 bg-transparent"
                placeholder="Search country..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={disabled}
              />

              {countryList.length === 0 ? (
                <div className="flex items-center justify-center p-4 text-sm">
                  No country found.
                </div>
              ) : (
                <ScrollArea className="h-[200px] w-full">
                  {countryList?.map((country) => (
                    <SelectItem
                      key={country.id}
                      className="w-full p-2"
                      value={country.name}
                    >
                      <div className="flex items-end gap-2">
                        <span>{country.emoji}</span>

                        <span className="">{country.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </ScrollArea>
              )}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CountryInput;
