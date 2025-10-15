import { useController } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface FormHorizontalRadioGroupProps {
  control: any
  name: string
  options: { value: string; label: string }[]
  className?: string
  required?: boolean
  disabled?: boolean
}

export function FormHorizontalRadioGroup({
  control,
  name,
  options,
  className,
  required,
  disabled,
}: FormHorizontalRadioGroupProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  return (
    <div className={`flex items-center space-x-4 ${className || ""}`}>
      <RadioGroup
        value={field.value}
        onValueChange={field.onChange}
        disabled={disabled}
        className="flex items-center space-x-4"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
            <Label htmlFor={`${name}-${option.value}`} className="text-[12px] font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  )
} 