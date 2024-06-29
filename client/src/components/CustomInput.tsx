import { Input } from "@/components/ui/input";
import { Control, FieldPath } from "react-hook-form";
import {
  LoginValidator,
  RegisterValidator,
  ResetValidator,
  NewPasswordValidator,
  SettingsValidator,
} from "@/server/lib/validators/auth";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  control: Control<
    | LoginValidator
    | RegisterValidator
    | ResetValidator
    | NewPasswordValidator
    | SettingsValidator
  >;
  name: FieldPath<
    | LoginValidator
    | RegisterValidator
    | ResetValidator
    | NewPasswordValidator
    | SettingsValidator
  >;
  label: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  isPending: boolean;
  offAutoComplete?: boolean;
};

const CustomInput = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  isPending,
  offAutoComplete,
}: Props) => {
  if (name === "isTwoFactorEnabled") return null;

  return (
    <>
      {offAutoComplete ? (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[14px] font-medium leading-5">
                {label}
              </FormLabel>

              <FormControl>
                <Input
                  {...field}
                  className="rounded-lg border border-gray-300 text-[16px] leading-6 text-gray-900 placeholder:text-[16px] placeholder:leading-6 placeholder:text-gray-500"
                  disabled={isPending}
                  placeholder={placeholder}
                  type={type}
                  autoComplete="new-password"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[14px] font-medium leading-5">
                {label}
              </FormLabel>

              <FormControl>
                <Input
                  {...field}
                  className="rounded-lg border border-gray-300 text-[16px] leading-6 text-gray-900 placeholder:text-[16px] placeholder:leading-6 placeholder:text-gray-500"
                  disabled={isPending}
                  placeholder={placeholder}
                  type={type}
                />
              </FormControl>

              <FormMessage className="mt-2 text-[12px] leading-4 text-red-500" />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default CustomInput;
