"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DebouncedInputProps {
  value: string
  onChange: (value: string) => void
  delay?: number
  placeholder?: string
  className?: string
  disabled?: boolean
  type?: string
}

export function DebouncedInput({
  value: initialValue,
  onChange,
  delay = 500,
  placeholder,
  className,
  disabled = false,
  type = "text",
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue)

  // Update local state when initialValue changes
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== initialValue) {
        onChange(value)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay, onChange, initialValue])

  return (
    <Input
      {...props}
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className={cn(className)}
      disabled={disabled}
    />
  )
}
