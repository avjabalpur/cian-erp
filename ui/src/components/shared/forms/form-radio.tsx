import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { FormFieldBaseProps, SelectOption } from "./types";
import { FieldValues } from "react-hook-form";

interface FormRadioGroupProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  options: SelectOption[];
  orientation?: 'horizontal' | 'vertical';
  showLabel?: boolean;
}

export function FormRadioGroup<T extends FieldValues>({
  control,
  name,
  label,
  options,
  disabled = false,
  className,
  orientation = 'vertical',
  showLabel = true,
}: FormRadioGroupProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-y-0', className)}>
          {showLabel && <FormLabel className="text-[12px] font-medium">{label}</FormLabel>}
          <FormControl>
            <RadioGroup 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={disabled}
              className={cn({
                'flex flex-wrap gap-4': orientation === 'horizontal',
                'space-y-2': orientation === 'vertical',
              })}
            >
              {options.map(opt => (
                <FormItem 
                  key={opt.value} 
                  className={cn(
                    'flex items-center space-x-2',
                    orientation === 'horizontal' && 'flex-shrink-0'
                  )}
                >
                  <RadioGroupItem 
                    value={opt.value} 
                    id={`${name}-${opt.value}`} 
                  />
                  <FormLabel 
                    htmlFor={`${name}-${opt.value}`}
                    className={cn('font-normal', {
                      'cursor-pointer': !disabled,
                      'cursor-not-allowed opacity-50': disabled,
                    })}
                  >
                    {opt.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}