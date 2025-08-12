"use client"

import * as React from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import { X } from "lucide-react"
import { Button } from "../ui/button"

interface RightDrawerProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    description?: string
    className?: string
    size?: "sm" | "md" | "lg" | "xl" | "full" | "2xl" | "3xl" | "4xl" | "5xl"
}

export function RightDrawer({
    isOpen,
    onClose,
    children,
    title,
    description,
    className,
    size = "lg",
}: RightDrawerProps) {
    const sizeClasses = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        full: "sm:max-w-full",
        "2xl": "sm:max-w-2xl",
        "3xl": "sm:max-w-3xl",
        "4xl": "sm:max-w-4xl",
        "5xl": "sm:max-w-5xl",
    }

    return (

        <Sheet open={isOpen}  onOpenChange={(open) => !open && onClose()}>
            <SheetContent
                side="right"
                className={cn(
                    "w-full p-0 gap-0 ",
                    sizeClasses[size],
                    className
                )}>
                <ScrollArea className="h-full rounded-md border">
                    {(title || description) && (
                        <SheetHeader className="p-2 border-b bg-[#d1f2ff]">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex-1 min-w-0">
                                    {title && <SheetTitle className="text-lg font-semibold">{title}</SheetTitle>}
                                    {description && (
                                        <SheetDescription className="text-sm text-muted-foreground">
                                            {description}
                                        </SheetDescription>
                                    )}
                                </div>
                                
                            </div>
                        </SheetHeader>
                    )}

                    <div className="flex-1 overflow-y-auto p-4">
                        {children}
                    </div>
                </ScrollArea>
                
                {/* Hidden title for accessibility when no title is provided */}
                {!title && (
                    <SheetTitle className="sr-only">
                        Drawer Content
                    </SheetTitle>
                )}
            </SheetContent>
        </Sheet>

    )
}

// Hook for managing drawer state
export function useRightDrawer() {
    const [isOpen, setIsOpen] = React.useState(false)
    const openDrawer = React.useCallback(() => setIsOpen(true), [])
    const closeDrawer = React.useCallback(() => setIsOpen(false), [])
    const toggleDrawer = React.useCallback(() => setIsOpen((prev) => !prev), [])

    return {
        isOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
    }
}
