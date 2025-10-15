import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FormFieldBaseProps } from "./types";
import { FieldValues, ControllerRenderProps, Path } from "react-hook-form";
import { ReactNode } from "react";

type CustomRenderProps<T extends FieldValues> = {
  field: {
    value: any;
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    disabled?: boolean;
  };
};

interface FormCustomProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  children: (props: CustomRenderProps<T>) => ReactNode;
  containerClassName?: string;
  className?: string;
  disabled?: boolean;
  showLabel?: boolean;
}

export function FormCustom<T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  showLabel = true,
  className,
  containerClassName,
  children,
}: FormCustomProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={cn('space-y-0', containerClassName)}>
          {showLabel && <FormLabel className="text-[12px] font-medium">{label}</FormLabel>}
          <FormControl>
            <div className={className}>
              {children({
                field: {
                  ...field,
                  value: field.value || '',
                  disabled: disabled || field.disabled,
                },
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
