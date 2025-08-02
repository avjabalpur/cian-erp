"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ConfigListValue } from "@/types/config-list";
import { useConfigListValuesByListCode } from "@/hooks/config/use-config-lists";

interface ConfigListSelectProps {
  listCode: string;
  value?: string | number;
  onChange: (value: string | number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showCode?: boolean;
  showOrder?: boolean;
  allowClear?: boolean;
}

interface ConfigListValueOption {
  value: string;
  label: string;
  code: string;
  order: number;
  isActive: boolean;
}

export function ConfigListSelect({
  listCode,
  value,
  onChange,
  placeholder = "Select a value...",
  disabled = false,
  className,
  showCode = false,
  showOrder = false,
  allowClear = false,
}: ConfigListSelectProps) {
  const [open, setOpen] = useState(false);
  const { data: configValues = [], isLoading, error } = useConfigListValuesByListCode(listCode);

  // Transform config values to options format
  const options: ConfigListValueOption[] = configValues.map(value => ({
    value: value.valueCode,
    label: value.valueName,
    code: value.valueCode,
    order: value.displayOrder,
    isActive: value.isActive,
  }));

  // Find the selected option
  const selectedOption = options.find(option => option.value === value);

  // Filter active options only
  const activeOptions = options.filter(option => option.isActive);

  const handleSelect = (selectedValue: string) => {
    if (value === selectedValue && allowClear) {
      onChange(undefined);
    } else {
      onChange(selectedValue);
    }
    setOpen(false);
  };

  const handleClear = () => {
    onChange(undefined);
  };

  if (error) {
    return (
      <div className={cn("flex items-center justify-center h-10 px-3 border rounded-md bg-red-50", className)}>
        <span className="text-sm text-red-600">Failed to load options</span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedOption && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20" />
            </div>
          ) : selectedOption ? (
            <div className="flex items-center space-x-2 truncate">
              {showOrder && (
                <Badge variant="outline" className="text-xs">
                  {selectedOption.order}
                </Badge>
              )}
              <span className="truncate">{selectedOption.label}</span>
              {showCode && (
                <Badge variant="secondary" className="text-xs">
                  {selectedOption.code}
                </Badge>
              )}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${listCode} values...`} />
          <CommandList>
            <CommandEmpty>No values found.</CommandEmpty>
            <CommandGroup>
              {activeOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center space-x-2 flex-1">
                    {showOrder && (
                      <Badge variant="outline" className="text-xs min-w-[30px]">
                        {option.order}
                      </Badge>
                    )}
                    <span className="flex-1">{option.label}</span>
                    {showCode && (
                      <Badge variant="secondary" className="text-xs">
                        {option.code}
                      </Badge>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Multi-select version
interface ConfigListMultiSelectProps {
  listCode: string;
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxItems?: number;
}

export function ConfigListMultiSelect({
  listCode,
  value = [],
  onChange,
  placeholder = "Select values...",
  disabled = false,
  className,
  maxItems,
}: ConfigListMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const { data: configValues = [], isLoading, error } = useConfigListValuesByListCode(listCode);

  // Transform config values to options format
  const options: ConfigListValueOption[] = configValues.map(value => ({
    value: value.valueCode,
    label: value.valueName,
    code: value.valueCode,
    order: value.displayOrder,
    isActive: value.isActive,
  }));

  // Filter active options only
  const activeOptions = options.filter(option => option.isActive);

  const handleSelect = (selectedValue: string) => {
    const newValue = value.includes(selectedValue)
      ? value.filter(v => v !== selectedValue)
      : maxItems && value.length >= maxItems
      ? value
      : [...value, selectedValue];
    
    onChange(newValue);
  };

  const handleRemove = (valueToRemove: string) => {
    onChange(value.filter(v => v !== valueToRemove));
  };

  const selectedOptions = options.filter(option => value.includes(option.value));

  if (error) {
    return (
      <div className={cn("flex items-center justify-center h-10 px-3 border rounded-md bg-red-50", className)}>
        <span className="text-sm text-red-600">Failed to load options</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              value.length === 0 && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-20" />
              </div>
            ) : value.length > 0 ? (
              <span>{value.length} selected</span>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${listCode} values...`} />
            <CommandList>
              <CommandEmpty>No values found.</CommandEmpty>
              <CommandGroup>
                {activeOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="flex-1">{option.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {option.code}
                      </Badge>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Items Display */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="cursor-pointer hover:bg-red-100"
              onClick={() => handleRemove(option.value)}
            >
              {option.label}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
} 