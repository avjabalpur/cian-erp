import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { FieldValues } from "react-hook-form"
import { FormFieldBaseProps } from "./types"

interface FormSwitchProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  /** Label to display next to the switch */
  label: string
  /** Additional class name for the form item */
  className?: string
}

export function FormSwitch<T extends FieldValues>({
  control,
  name,
  label,
  disabled = false,
  className,
  error,
}: FormSwitchProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-center justify-between space-x-2 space-y-0", className)}>
          <FormLabel className="text-sm font-normal">{label}</FormLabel>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={cn(
                error && "ring-1 ring-destructive ring-offset-1",
                "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
              )}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  )
}
