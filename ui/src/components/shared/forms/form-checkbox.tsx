import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { FormFieldBaseProps } from "./types";
import { FieldValues } from "react-hook-form";

interface FormCheckboxProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  inline?: boolean;
  description?: string;
}

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  className,
  inline = true,
  description,
}: FormCheckboxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(
          'space-y-0',
          inline ? 'flex flex-row items-start space-x-3' : 'space-y-2',
          className
        )}>
          <FormControl>
            <Checkbox 
              checked={field.value} 
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={cn({
                'mt-1': !inline && label,
              })}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className={cn({
              'cursor-pointer': !disabled,
            })}>
              {label}
            </FormLabel>
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <FormMessage className={inline ? 'ml-2' : ''} />
        </FormItem>
      )}
    />
  );
}