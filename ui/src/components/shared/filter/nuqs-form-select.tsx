import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

interface NuqsFormSelectProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
}

export function NuqsFormSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className,
  allowClear = true
}: NuqsFormSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-[12px] font-medium">{label}</Label>
      <Select value={value || ""} onValueChange={(val) => onChange(val === "all" ? null : val)} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || `Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {allowClear && <SelectItem value="all">All</SelectItem>}
          {options?.map((option) => (
            <SelectItem key={option?.value || ""} value={option?.value || ""}>
              {option?.label || ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 