import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormFieldBaseProps } from "./types";
import { FieldValues } from "react-hook-form";
import { Search } from "lucide-react";

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
            <div className="flex gap-2">
              <Input
                placeholder={placeholder || label}
                disabled={disabled}
                {...field}
                value={displayValue ? displayValue(field.value || "") : field.value || ""}
                readOnly
                className="flex-1"
                {...inputProps}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onLookupClick}
                disabled={disabled}
                className="px-3"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
