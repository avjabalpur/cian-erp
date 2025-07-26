import { Control, FieldValues, Path } from 'react-hook-form';

export interface FormFieldBaseProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}
