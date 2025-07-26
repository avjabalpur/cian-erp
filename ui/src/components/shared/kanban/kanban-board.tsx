"use client"

import type React from "react"
import { useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { KanbanBoardProps } from "./kanban"

interface DraggableItemProps {
  id: string
  children: React.ReactNode
}

function DraggableItem({ id, children }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""}`}
    >
      {children}
    </div>
  )
}

interface DroppableColumnProps {
  id: string
  children: React.ReactNode
  isOver: boolean
}

function DroppableColumn({ id, children, isOver }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] p-2 rounded-lg transition-all duration-200 ${
        isOver ? "bg-blue-50 dark:bg-blue-950/20 ring-2 ring-blue-300 dark:ring-blue-600" : ""
      }`}
    >
      {children}
    </div>
  )
}

export function KanbanBoard<T>({ items, config, onItemMove, renderItem, className = "" }: KanbanBoardProps<T>) {
  const [activeItem, setActiveItem] = useState<T | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const item = items.find((item) => config.getItemId(item) === active.id)
    setActiveItem(item || null)
    setActiveId(active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveItem(null)
      setActiveId(null)
      return
    }

    const activeItem = items.find((item) => config.getItemId(item) === active.id)
    const targetColumnId = over.id as string
    const targetColumn = config.columns.find((col) => col.id === targetColumnId)

    if (activeItem && targetColumn) {
      const currentStatus = config.getItemStatus(activeItem)
      if (currentStatus !== targetColumn.status) {
        console.log(`Moving item ${active.id} from ${currentStatus} to ${targetColumn.status}`)
        onItemMove(activeItem, targetColumn.status)
      }
    }

    setActiveItem(null)
    setActiveId(null)
  }

  const getItemsByStatus = (status: string) => {
    return items.filter((item) => config.getItemStatus(item) === status)
  }

  // Get the column that's being hovered over
  const getIsColumnOver = (columnId: string) => {
    // This will be handled by the droppable hook
    return false
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`flex gap-6 overflow-x-auto pb-4 ${className}`}>
        {config.columns.map((column) => {
          const columnItems = getItemsByStatus(column.status)

          return (
            <div key={column.id} className="flex-shrink-0 w-80">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {columnItems.length}
                      {column.limit && ` / ${column.limit}`}
                    </Badge>
                  </div>
                  {column.color && <div className="h-1 rounded-full" style={{ backgroundColor: column.color }} />}
                </CardHeader>
                <CardContent className="pt-0 px-2">
                  <DroppableColumnContent columnId={column.id}>
                    <div className="space-y-3">
                      {columnItems.map((item) => (
                        <DraggableItem key={config.getItemId(item)} id={config.getItemId(item)}>
                          {renderItem(item)}
                        </DraggableItem>
                      ))}
                    </div>
                  </DroppableColumnContent>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      <DragOverlay>
        {activeItem ? <div className="rotate-2 opacity-95 transform scale-105">{renderItem(activeItem)}</div> : null}
      </DragOverlay>
    </DndContext>
  )
}

// Separate component to handle the droppable logic
function DroppableColumnContent({ columnId, children }: { columnId: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] p-3 rounded-lg transition-all duration-200 ${
        isOver
          ? "bg-blue-50 dark:bg-blue-950/30 ring-2 ring-blue-300 dark:ring-blue-600 ring-opacity-50"
          : "hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
      }`}
    >
      {children}
    </div>
  )
}
