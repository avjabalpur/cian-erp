"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { FormFieldBaseProps } from "./types"
import { FieldValues } from "react-hook-form"

type TextareaProps = React.ComponentProps<typeof Textarea>

interface FormTextareaProps<T extends FieldValues> extends FormFieldBaseProps<T> {
  placeholder?: string
  textareaProps?: Omit<TextareaProps, 'name' | 'disabled'>
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled = false,
  className,
  textareaProps = {},
}: FormTextareaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-y-2', className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder || label}
              disabled={disabled}
              className={cn('min-h-[100px]', textareaProps.className)}
              {...field}
              value={field.value ?? ""} // Ensure value is never null
              {...textareaProps}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
