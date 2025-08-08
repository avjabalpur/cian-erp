import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormFieldBaseProps } from "./types";
import { FieldValues } from "react-hook-form";

type InputProps = React.ComponentProps<typeof Input>;

interface FormLookupProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  placeholder?: string;
  inputProps?: Omit<InputProps, 'name' | 'disabled'>;
  onLookupClick: () => void;
  displayValue?: (value: string) => string;
}

export function FormLookup<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  className,
  inputProps = {},
  onLookupClick,
  displayValue,
}: FormLookupProps<T>) {
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
               value={displayValue ? displayValue(field.value || "") : field.value || ""}
               onChange={() => {}} // Prevent direct editing
               className={cn(
                 "cursor-pointer hover:bg-muted/50 transition-colors",
                 inputProps.className
               )}
               onClick={!disabled ? onLookupClick : undefined}
               onFocus={!disabled ? onLookupClick : undefined}
               {...inputProps}
             />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
