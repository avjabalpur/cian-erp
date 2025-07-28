import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Reusable form components adapted for nuqs
interface NuqsFormInputProps {
    label: string;
    value: string | null;
    onChange: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    type?: "text" | "number";
    icon?: React.ReactNode;
  }

export function NuqsFormInput({
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
    className,
    type = "text",
    icon
  }: NuqsFormInputProps) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label>{label}</Label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-3 h-4 w-4 text-muted-foreground">
              {icon}
            </div>
          )}
          <Input
            type={type}
            placeholder={placeholder || label}
            value={value || ""}
            onChange={(e) => onChange(e.target.value || null)}
            disabled={disabled}
            className={icon ? "pl-10" : ""}
          />
        </div>
      </div>
    );
  }