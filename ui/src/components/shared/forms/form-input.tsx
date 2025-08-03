import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormFieldBaseProps } from "./types";
import { FieldValues } from "react-hook-form";

type InputProps = React.ComponentProps<typeof Input>;

interface FormInputProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  placeholder?: string;
  inputProps?: Omit<InputProps, 'name' | 'disabled'>;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  className,
  inputProps = {},
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-y-0', className)}>
          <FormLabel className="text-[12px] font-medium">{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder || label}
              disabled={disabled}
              {...field}
              value={field.value ?? ""} // Ensure value is never null
              {...inputProps}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}