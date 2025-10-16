'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useGenerateItemCode } from '../hooks';
import { toast } from 'sonner';

const VALID_ITEM_TYPES = ["RM", "PM", "CO", "CG", "SP", "IM", "FG", "TR", "SV", "SF", "AD", "SC"];

interface ItemCodeGeneratorProps {
  onCodeGenerated?: (code: string) => void;
  initialValue?: string;
}

export function ItemCodeGenerator({ onCodeGenerated, initialValue }: ItemCodeGeneratorProps) {
  const [itemType, setItemType] = useState(initialValue || '');
  const [isReadonly, setIsReadonly] = useState(!!initialValue);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(!!initialValue);
  
  const generateItemCodeMutation = useGenerateItemCode();

  const handleItemTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setItemType(value);
    setError('');

    if (value && VALID_ITEM_TYPES.includes(value)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleBlur = async () => {
    if (!itemType.trim()) {
      setError('Required');
      return;
    }

    if (!VALID_ITEM_TYPES.includes(itemType.toUpperCase())) {
      setError('Invalid');
      return;
    }

    try {
      const response = await generateItemCodeMutation.mutateAsync({
        itemCode: itemType.toUpperCase()
      });
      
      const generatedCode = response.itemCode;
      setItemType(generatedCode);
      setIsReadonly(true);
      setError('');
      
      // Call the callback to pass the generated code to parent
      if (onCodeGenerated) {
        console.log('🔑 Generated item code:', generatedCode);
        onCodeGenerated(generatedCode);
      }
      
      toast.success(`Item code generated: ${generatedCode}`);
    } catch (error: any) {
      setError('Failed to generate code');
      toast.error(error?.message || 'Failed to generate item code');
    }
  };

  return (
    <div className="relative">
      <Input
        value={itemType}
        onChange={handleItemTypeChange}
        onBlur={handleBlur}
        placeholder="Enter 2-letter code"
        className={`h-8 text-xs ${error ? 'border-red-500' : isValid ? 'border-green-500' : ''} ${isReadonly ? 'bg-muted font-mono font-semibold' : ''}`}
        disabled={isReadonly || generateItemCodeMutation.isPending}
        maxLength={isReadonly ? undefined : 2}
      />
      {error && <div className="absolute -bottom-5 left-0 text-xs text-red-500">{error}</div>}
      {generateItemCodeMutation.isPending && (
        <div className="absolute -bottom-5 left-0 text-xs text-blue-500">Generating...</div>
      )}
      {!isReadonly && !error && !generateItemCodeMutation.isPending && (
        <div className="absolute -bottom-5 left-0 text-xs text-muted-foreground">
          Valid: {VALID_ITEM_TYPES.join(', ')}
        </div>
      )}
    </div>
  );
}

