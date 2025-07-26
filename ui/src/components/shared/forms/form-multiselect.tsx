import React from "react";
import { Controller } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface FormMultiSelectProps {
  control: any;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
}

export const FormMultiSelect: React.FC<FormMultiSelectProps> = ({ control, name, label, options, placeholder }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <div className="border rounded px-2 py-1">
          {options.map(option => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={Array.isArray(value) ? value.includes(option.value) : false}
                onChange={e => {
                  if (e.target.checked) {
                    onChange([...(value || []), option.value]);
                  } else {
                    onChange((value || []).filter((v: string) => v !== option.value));
                  }
                }}
              />
              <span>{option.label}</span>
            </label>
          ))}
          {options.length === 0 && <span className="text-gray-400">{placeholder || "No options"}</span>}
        </div>
      )}
    />
  </div>
); 