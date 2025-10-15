'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface RightDrawerProps {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'full' | '2xl' | '3xl' | '4xl';
}

const sizeClasses = {
  default: 'sm:max-w-md',
  sm: 'sm:max-w-sm',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-full',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
};

export function RightDrawer({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  size = 'default',
}: RightDrawerProps) {
  if (trigger) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          {trigger}
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className={`w-full ${sizeClasses[size]} p-0 flex flex-col`}
        >
          <SheetHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-lg font-semibold truncate">
                  {title}
                </SheetTitle>
                {description && (
                  <SheetDescription className="text-sm text-muted-foreground mt-1">
                    {description}
                  </SheetDescription>
                )}
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-2">
          <Card>
          <CardContent>
            {children}
           </CardContent>
          </Card>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className={`w-full ${sizeClasses[size]} p-0 flex flex-col`}
      >
        <SheetHeader className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg font-semibold truncate">
                {title}
              </SheetTitle>
              {description && (
                <SheetDescription className="text-sm text-muted-foreground mt-1">
                  {description}
                </SheetDescription>
              )}
            </div>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-2 py-1">
          <Card>
            <CardContent className='p-4'>
              {children}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
