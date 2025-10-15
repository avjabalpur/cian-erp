"use client"

import { useController, useFormContext, Control, FieldValues, Path } from "react-hook-form"
import { format, parseISO, isValid } from "date-fns"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"

interface FormDateInputProps<T extends FieldValues = FieldValues> {
  name: Path<T>
  control?: Control<T>
  label: string
  placeholder?: string
  disabled?: boolean
  className?: string
  required?: boolean
}

export function FormDateInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "",
  disabled = false,
  className = "",
  required = false,
}: FormDateInputProps<T>) {
  const context = useFormContext<T>()
  const {
    field: { value, onChange, ...field },
    fieldState: { error },
  } = useController({
    control: control || context.control,
    name,
    rules: { required },
  })

  let dateValue: Date | undefined = undefined
  if (value) {
    const parsed = typeof value === 'string' ? parseISO(value) : value
    if (isValid(parsed)) dateValue = parsed
  }

  return (
    <div className="space-y-0">
      <Label htmlFor={name} className={error ? 'text-destructive' : 'text-[12px] font-medium'}>
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={`w-full justify-start text-left font-normal ${!dateValue ? "text-muted-foreground" : ""} ${error ? 'border-destructive' : ''} ${className}`}
            disabled={disabled}
            id={name as string}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue ? format(dateValue, "yyyy-MM-dd") : (placeholder || "Pick a date")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={d => onChange(d ? d.toISOString() : null)}
            initialFocus
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm font-medium text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}
