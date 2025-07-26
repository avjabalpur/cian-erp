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

interface RightDrawerProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    description?: string
    className?: string
    size?: "sm" | "md" | "lg" | "xl" | "full"
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
    }

    return (

        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent
                side="right"
                className={cn(
                    "w-full p-0 gap-0",
                    sizeClasses[size],
                    className
                )}>
                <ScrollArea className="h-full rounded-md border">
                    {(title || description) && (
                        <SheetHeader className="px-6 py-4 border-b bg-muted/30">
                            {title && <SheetTitle className="text-lg font-semibold">{title}</SheetTitle>}
                            {description && (
                                <SheetDescription className="text-sm text-muted-foreground">
                                    {description}
                                </SheetDescription>
                            )}
                        </SheetHeader>
                    )}

                    <div className="flex-1 overflow-y-auto p-6">
                        {children}
                    </div>
                </ScrollArea>
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
