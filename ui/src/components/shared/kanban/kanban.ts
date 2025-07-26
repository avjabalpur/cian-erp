import type React from "react"
export interface KanbanColumn<T = any> {
  id: string
  title: string
  status: string
  color?: string
  limit?: number
}

export interface KanbanConfig<T = any> {
  columns: KanbanColumn<T>[]
  getItemStatus: (item: T) => string
  updateItemStatus: (item: T, newStatus: string) => T
  getItemId: (item: T) => string
}

export interface KanbanBoardProps<T = any> {
  items: T[]
  config: KanbanConfig<T>
  onItemMove: (item: T, newStatus: string) => void
  renderItem: (item: T) => React.ReactNode
  className?: string
}
