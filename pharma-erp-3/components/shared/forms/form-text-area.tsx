import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FormFieldBaseProps } from "./types";
import { FieldValues } from "react-hook-form";

interface FormTextAreaProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  /** Textarea placeholder text */
  placeholder?: string;
  /** Number of rows to display */
  rows?: number;
}

export function FormTextArea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  className,
  rows = 4,
}: FormTextAreaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-y-0', className)}>
          <FormLabel className="text-[12px] font-medium">{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder || label}
              disabled={disabled}
              rows={rows}
              {...field}
              value={field.value ?? ""} // Ensure value is never null
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}