'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Department } from '../types';
import { departmentSchema, DepartmentFormData } from '../validations';
import { Loader2 } from 'lucide-react';

interface DepartmentFormProps {
  department?: Department;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (data: DepartmentFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DepartmentForm({ department, mode, onSubmit, onCancel, isLoading }: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: department || {
      code: '',
      name: '',
      description: '',
      status: 'Active',
      headOfDepartment: '',
      employeeCount: 0,
    },
  });

  const isViewMode = mode === 'view';
  const status = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Code */}
        <div className="space-y-2">
          <Label htmlFor="code">
            Department Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            {...register('code')}
            disabled={isViewMode}
            placeholder="e.g., PROD, QC, IT"
          />
          {errors.code && (
            <p className="text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Department Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register('name')}
            disabled={isViewMode}
            placeholder="e.g., Production, Quality Control"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Head of Department */}
        <div className="space-y-2">
          <Label htmlFor="headOfDepartment">Head of Department</Label>
          <Input
            id="headOfDepartment"
            {...register('headOfDepartment')}
            disabled={isViewMode}
            placeholder="e.g., John Doe"
          />
          {errors.headOfDepartment && (
            <p className="text-sm text-red-500">{errors.headOfDepartment.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={status}
            onValueChange={(value) => setValue('status', value)}
            disabled={isViewMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          disabled={isViewMode}
          placeholder="Brief description of the department"
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Form Actions */}
      {!isViewMode && (
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Create Department' : 'Update Department'}
          </Button>
        </div>
      )}
    </form>
  );
}

