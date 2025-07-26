import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Grip, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column {
  id: string;
  header: string;
  description?: string;
}

interface DragDropGroupingProps {
  availableColumns: Column[];
  groupedColumns: string[];
  onGroupingChange: (newGrouping: string[]) => void;
  className?: string;
}

// Draggable item component for available columns
const DraggableColumnItem: React.FC<{
  column: Column;
  isGrouped: boolean;
}> = ({ column, isGrouped }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "cursor-grab active:cursor-grabbing select-none transition-all",
        isDragging && "opacity-50",
        isGrouped 
          ? "border-blue-300 bg-blue-100 text-blue-800 hover:bg-blue-200" 
          : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
      )}
      {...attributes}
      {...listeners}
    >
      <Grip className="h-3 w-3 mr-1" />
      {column.header}
    </div>
  );
};

// Sortable item component for grouped columns
const SortableGroupedColumn: React.FC<{
  column: Column;
  onRemove: (columnId: string) => void;
}> = ({ column, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'grouped-column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "cursor-grab active:cursor-grabbing select-none transition-all border-blue-300 bg-blue-100 text-blue-800 hover:bg-blue-200 pr-1",
        isDragging && "opacity-50"
      )}
      {...attributes}
      {...listeners}
    >
      <Grip className="h-3 w-3 mr-1" />
      {column.header}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(column.id);
        }}
        className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

// Droppable area component
const DroppableGroupArea: React.FC<{
  children: React.ReactNode;
  isEmpty: boolean;
}> = ({ children, isEmpty }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'group-area',
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[60px] p-4 border-2 border-dashed rounded-lg transition-colors",
        isEmpty 
          ? "border-gray-300 bg-gray-50 text-muted-foreground" 
          : "border-blue-300 bg-blue-50",
        isOver && "border-blue-500 bg-blue-100"
      )}
    >
      {isEmpty ? (
        <div className="flex items-center justify-center h-full text-sm">
          <span>Drag columns here to group by them</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {children}
        </div>
      )}
    </div>
  );
};

export const DragDropGrouping: React.FC<DragDropGroupingProps> = ({
  availableColumns,
  groupedColumns,
  onGroupingChange,
  className = '',
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const activeColumn = availableColumns.find(col => col.id === activeId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle dropping on the group area
    if (overId === 'group-area') {
      if (!groupedColumns.includes(activeId)) {
        onGroupingChange([...groupedColumns, activeId]);
      }
    }
    // Handle reordering within grouped columns
    else if (groupedColumns.includes(activeId) && groupedColumns.includes(overId)) {
      const oldIndex = groupedColumns.indexOf(activeId);
      const newIndex = groupedColumns.indexOf(overId);
      
      if (oldIndex !== newIndex) {
        const newGrouping = [...groupedColumns];
        newGrouping.splice(oldIndex, 1);
        newGrouping.splice(newIndex, 0, activeId);
        onGroupingChange(newGrouping);
      }
    }

    setActiveId(null);
  };

  const handleRemoveFromGroup = (columnId: string) => {
    onGroupingChange(groupedColumns.filter(id => id !== columnId));
  };

  const groupedColumnObjects = groupedColumns
    .map(id => availableColumns.find(col => col.id === id))
    .filter(Boolean) as Column[];

  const ungroupedColumns = availableColumns.filter(col => !groupedColumns.includes(col.id));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Column Grouping</CardTitle>
          <p className="text-sm text-muted-foreground">
            Drag columns from available columns to the grouping area, or reorder grouped columns by dragging them.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Available Columns */}
          <div>
            <h4 className="text-sm font-medium mb-2">Available Columns</h4>
            <div className="flex flex-wrap gap-2">
              <SortableContext items={ungroupedColumns.map(col => col.id)}>
                {ungroupedColumns.map(column => (
                  <DraggableColumnItem
                    key={column.id}
                    column={column}
                    isGrouped={false}
                  />
                ))}
              </SortableContext>
            </div>
          </div>

          <Separator />

          {/* Grouped Columns */}
          <div>
            <h4 className="text-sm font-medium mb-2">
              Grouped Columns {groupedColumns.length > 0 && `(${groupedColumns.length})`}
            </h4>
            <SortableContext 
              items={groupedColumns}
              strategy={horizontalListSortingStrategy}
            >
              <DroppableGroupArea isEmpty={groupedColumns.length === 0}>
                {groupedColumnObjects.map(column => (
                  <SortableGroupedColumn
                    key={column.id}
                    column={column}
                    onRemove={handleRemoveFromGroup}
                  />
                ))}
              </DroppableGroupArea>
            </SortableContext>
          </div>

        
        </CardContent>
      </Card>

      <DragOverlay>
        {activeColumn && (
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-blue-300 bg-blue-100 text-blue-800 opacity-80">
            <Grip className="h-3 w-3 mr-1" />
            {activeColumn.header}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
