'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { DepartmentForm } from './department-form';
import { CreateDepartmentData, UpdateDepartmentData, Department } from '@/types/department';
import { toast } from 'sonner';
import { useCreateDepartment, useUpdateDepartment } from '@/hooks/use-departments';

interface DepartmentDrawerProps {
  department: Department | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
}

export function DepartmentDrawer({ department, open, onOpenChange, mode }: DepartmentDrawerProps) {
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Department';
      case 'edit':
        return 'Edit Department';
      case 'view':
        return 'Department Details';
      default:
        return 'Department';
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (department) {
        const updateData: UpdateDepartmentData = {
          id: department.id,
          code: data.code,
          name: data.name,
          description: data.description,
          status: data.status,
          headOfDepartment: data.headOfDepartment,
          employeeCount: data.employeeCount,
        };
        await updateDepartment.mutateAsync({ id: department.id.toString(), data: updateData });
        toast.success('Department updated successfully');
      } else {
        const createData: CreateDepartmentData = {
          code: data.code,
          name: data.name,
          description: data.description,
          status: data.status,
          headOfDepartment: data.headOfDepartment,
          employeeCount: data.employeeCount,
        };
        await createDepartment.mutateAsync(createData);
        toast.success('Department created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(department ? 'Failed to update department' : 'Failed to create department');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="xl"
    >
      <DepartmentForm
        mode={mode}
        department={department}
        onSubmit={handleSubmit}
        isLoading={createDepartment.isPending || updateDepartment.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </RightDrawer>
  );
}

