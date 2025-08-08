"use client";

import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface MetricsDisplayProps {
  marginPercentage: number;
  value: number;
  profit: number;
  className?: string;
}

export function MetricsDisplay({ marginPercentage, value, profit, className }: MetricsDisplayProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(2)}%`;
  };

  return (
    <TooltipProvider>
      <div className={`flex flex-col space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Margin %</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Profit margin percentage</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-lg font-semibold">{formatPercentage(marginPercentage)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Value</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Total order value</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-lg font-semibold">{formatCurrency(value)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Profit</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Total profit amount</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-lg font-semibold">{formatCurrency(profit)}</span>
        </div>
      </div>
    </TooltipProvider>
  );
} 