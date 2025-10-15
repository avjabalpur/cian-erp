'use client';

import { useEffect, useState, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/components/shared/forms/form-input';
import { FormCheckbox } from '@/components/shared/forms/form-checkbox';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';
import { Role } from '@/types/role';
import { usePermissions } from '@/hooks/use-permissions';
import { useGetRolePermissions } from '@/hooks/use-roles';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Permission } from '@/types/permission';

// Proper Zod schema for role form
const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().min(1, 'Description is required'),
  isActive: z.boolean().optional().default(true),
  permissions: z.array(z.string()).optional().default([]),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
  mode: 'create' | 'edit' | 'view';
  role?: Role | null | undefined | any;
  onSubmit: (data: RoleFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function RoleForm({ mode, role, onSubmit, isLoading, onCancel }: RoleFormProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema) as any,
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      isActive: role?.isActive ?? true,
      permissions: [],
    },
  });

  // Fetch available permissions from the API
  const permissionsData = usePermissions();
  
  // Fetch role-specific permissions when editing
  const { data: rolePermissionsData, isLoading: isLoadingRolePermissions } = useGetRolePermissions(role?.id || 0);

  // Get available permissions from API response
  const availablePermissions = permissionsData?.data || [];

  useEffect(() => {
    if (role) {
      // Extract permission names from role permissions data
      let permissionNames: string[] = [];
      
      if (Array.isArray(rolePermissionsData) && rolePermissionsData.length > 0) {
        // If we have role permissions data from API, extract permission names
        // Assuming rolePermissionsData contains objects with permissionId
        // We need to map these to permission names
        permissionNames = rolePermissionsData.map((rp: any) => {
          // Find the permission name by ID from available permissions
          const permission = availablePermissions.find((p: Permission) => p.id === rp.permissionId);
          return permission?.name || '';
        }).filter(Boolean);
      } else if (Array.isArray(role.permissions)) {
        // Fall back to role.permissions if available
        permissionNames = role.permissions || [];
      }
      
      // Populate form with role data
      form.reset({
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        permissions: permissionNames,
      });
    }
  }, [role, form, rolePermissionsData, availablePermissions]);

  const handleSubmit = async (data: RoleFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit role:', error);
    }
  };

  // Filter permissions based on search term
  const filteredPermissions = useMemo(() => {
    if (!searchTerm.trim()) {
      return availablePermissions;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return availablePermissions.filter((permission: Permission) => 
      permission.name.toLowerCase().includes(searchLower) ||
      permission.description?.toLowerCase().includes(searchLower) ||
      permission.moduleName?.toLowerCase().includes(searchLower) ||
      permission.actionType?.toLowerCase().includes(searchLower)
    );
  }, [availablePermissions, searchTerm]);

  // Group permissions by module for better organization
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    
    filteredPermissions.forEach((permission: Permission) => {
      const module = permission.moduleName || 'Other';
      if (!groups[module]) {
        groups[module] = [];
      }
      groups[module].push(permission);
    });
    
    // Sort modules and permissions within each module
    const sortedGroups: Record<string, Permission[]> = {};
    Object.keys(groups).sort().forEach(module => {
      sortedGroups[module] = groups[module].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return sortedGroups;
  }, [filteredPermissions]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={form.control}
            name="name"
            label="Role Name"
            placeholder="Enter role name"
            inputProps={{
              type: "text",
              autoComplete: "off",
            }}
            disabled={mode === 'view'}
          />

          <FormInput
            control={form.control}
            name="description"
            label="Description"
            placeholder="Enter role description"
            inputProps={{
              type: "text",
              autoComplete: "off",
            }}
            disabled={mode === 'view'}
          />

          <FormCheckbox
            control={form.control}
            name="isActive"
            label="Active"
            description="Enable this role for use"
            disabled={mode === 'view'}
          />
        </div>

        {/* Permissions Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Permissions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select the permissions that this role should have access to.
            </p>
          </div>

          {/* Search Input and Actions */}
          <div className="space-y-3">
            <div className="relative">
              <Label htmlFor="permission-search" className="sr-only">
                Search permissions
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="permission-search"
                  type="text"
                  placeholder="Search permissions by name, description, or module..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Bulk Actions */}
            {mode !== 'view' && filteredPermissions.length > 0 && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentPermissions = form.getValues('permissions') || [];
                    const newPermissions = [...new Set([...currentPermissions, ...filteredPermissions.map(p => p.name)])];
                    form.setValue('permissions', newPermissions);
                  }}
                >
                  Select All {searchTerm && 'Filtered'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentPermissions = form.getValues('permissions') || [];
                    const filteredPermissionNames = filteredPermissions.map(p => p.name);
                    const newPermissions = currentPermissions.filter(p => !filteredPermissionNames.includes(p));
                    form.setValue('permissions', newPermissions);
                  }}
                >
                  Clear All {searchTerm && 'Filtered'}
                </Button>
              </div>
            )}
          </div>
          
          {isLoadingRolePermissions && mode === 'edit' ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading role permissions...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedPermissions).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No permissions found matching your search.' : 'No permissions available.'}
                  </p>
                </div>
              ) : (
                Object.entries(groupedPermissions).map(([module, permissions]) => (
                  <div key={module} className="space-y-1">
                    <div className="flex items-center">
                      <h4 className="text-md font-medium text-foreground">{module}</h4>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                      {permissions.map((permission: Permission) => (
                        <FormField
                          key={permission.id}
                          control={form.control}
                          name="permissions"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(permission.name)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, permission.name]);
                                    } else {
                                      field.onChange(field.value.filter((p: string) => p !== permission.name));
                                    }
                                  }}
                                  disabled={mode === 'view'}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium cursor-pointer">
                                  {permission.name}
                                </FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  {permission.description}
                                </p>
                                {permission.actionType && (
                                  <p className="text-xs text-blue-600 font-medium">
                                    {permission.actionType}
                                  </p>
                                )}
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {mode !== 'view' && (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
