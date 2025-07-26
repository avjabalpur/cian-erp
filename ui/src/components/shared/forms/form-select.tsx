import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { FormFieldBaseProps, SelectOption } from "./types"
import { FieldValues, Path, PathValue } from "react-hook-form"
import { useEffect, useState } from "react"

interface FormSelectProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  /** Array of options for the select */
  options: SelectOption[]
  /** Placeholder text */
  placeholder?: string
  /** Whether to show a search input */
  showSearch?: boolean
  /** Whether to allow clearing the selection */
  allowClear?: boolean
  /** Custom class name for the select trigger */
  triggerClassName?: string
  /** Whether to show the label */
  showLabel?: boolean
  /** Whether the field is required */
  required?: boolean
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options = [],
  placeholder,
  disabled = false,
  className,
  showSearch = false,
  allowClear = false,
  triggerClassName,
  showLabel = true,
  required = false,
  ...props
}: FormSelectProps<T>) {
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={cn('space-y-2', className)}>
        {showLabel && (
          <FormLabel>
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
        )}
        <Select disabled>
          <SelectTrigger className={triggerClassName}>
            <SelectValue placeholder={placeholder || `Select ${label?.toLowerCase() || 'an option'}`} />
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={cn('space-y-2', className)}>
          {showLabel && (
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Select
              value={field.value ?? ''}
              onValueChange={(value: string) => {
                field.onChange(value === "__CLEAR__" ? "" : value as PathValue<T, Path<T>>)
              }}
              disabled={disabled}
            >
              <SelectTrigger className={cn('w-full', triggerClassName, error && 'border-destructive')}>
                <SelectValue placeholder={placeholder || `Select ${label?.toLowerCase() || 'an option'}`} />
              </SelectTrigger>
              <SelectContent>
                {allowClear && (
                  <SelectItem value="__CLEAR__">
                    <span className="text-muted-foreground">Clear selection</span>
                  </SelectItem>
                )}
                {options.map((opt) => (
                  <SelectItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}