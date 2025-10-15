'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useRoles } from '@/hooks/use-roles';
import { useGetUserRoles, useAssignUserRole, useRemoveUserRole } from '@/hooks/use-users';
import { toast } from 'sonner';
import { UserRole } from '@/types/user';
import { Role } from '@/types/role';
import { X, Shield, User, Plus, Trash2 } from 'lucide-react';

interface UserRoleAssignmentProps {
  userId: number;
  userName: string;
  onClose: () => void;
}

export function UserRoleAssignment({ userId, userName, onClose }: UserRoleAssignmentProps) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch available roles and current user roles
  const { data: rolesData, isLoading: rolesLoading } = useRoles();
  const roles = rolesData?.items || [];
  const { data: userRolesData, isLoading: userRolesLoading, refetch } = useGetUserRoles(userId.toString());
  const userRoles = userRolesData || [];

  const createUserRole = useAssignUserRole();
  const deleteUserRole = useRemoveUserRole();

  // Initialize selected roles with currently assigned roles
  useEffect(() => {
    if (userRoles.length > 0) {
      setSelectedRoleIds(userRoles.map((ur: UserRole) => ur.roleId));
    }
  }, [userRoles]);

  const handleRoleToggle = (roleId: number, checked: boolean) => {
    if (checked) {
      setSelectedRoleIds(prev => [...prev, roleId]);
    } else {
      setSelectedRoleIds(prev => prev.filter(id => id !== roleId));
    }
  };

  const handleAssignRoles = async () => {
    if (selectedRoleIds.length === 0) {
      toast.error('Please select at least one role to assign');
      return;
    }

    setIsAssigning(true);
    try {
      // Get currently assigned role IDs
      const currentRoleIds = userRoles.map((ur: UserRole) => ur.roleId);
      
      // Roles to add (newly selected)
      const rolesToAdd = selectedRoleIds.filter(roleId => !currentRoleIds.includes(roleId));
      
      // Roles to remove (deselected)
      const rolesToRemove = currentRoleIds.filter((roleId: number) => !selectedRoleIds.includes(roleId));

      // Add new roles
      for (const roleId of rolesToAdd) {
        await createUserRole.mutateAsync({ id: userId.toString(), roleId, assignedBy: 1, isActive: true });
      }

      // Remove deselected roles
      for (const roleId of rolesToRemove) {
        const userRole = userRoles.find((ur: UserRole) => ur.roleId === roleId);
        if (userRole) {
          await deleteUserRole.mutateAsync({ id: userRole.id.toString(), roleId: userRole.roleId.toString() });
        }
      }

      toast.success('User roles updated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to update user roles');
      console.error('Error updating user roles:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveRole = async (userRole: UserRole) => {
    try {
      await deleteUserRole.mutateAsync({ id: userRole.id.toString(), roleId: userRole.roleId.toString() });
      toast.success('Role removed successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to remove role');
      console.error('Error removing role:', error);
    }
  };

  const isLoading = rolesLoading || userRolesLoading;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Current Roles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-2 text-muted-foreground">
              Loading roles...
            </div>
          ) : userRoles.length === 0 ? (
            <div className="text-center py-2 text-muted-foreground">
              No roles assigned yet
            </div>
          ) : (
            <div className="space-y-2">
              {userRoles.map((userRole: UserRole) => (
                <div key={userRole.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium">{userRole.name || 'Unknown Role'}</div>
                      <div className="text-sm text-muted-foreground">
                        {userRole.description || 'No description'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={userRole.isActive ? "default" : "secondary"}>
                      {userRole.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRole(userRole)}
                      disabled={deleteUserRole.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Roles */}
      <Card className='mt-4'>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Available Roles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-2 text-muted-foreground">
              Loading available roles...
            </div>
          ) : (
            <div className="space-y-3">
              {roles?.map((role: Role) => {
                const isAssigned = userRoles.some((ur: UserRole) => ur.roleId === role.id);
                const isSelected = selectedRoleIds.includes(role.id);
                
                return (
                  <div key={role.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => handleRoleToggle(role.id, checked as boolean)}
                      disabled={isAssigning}
                    />
                    <Label htmlFor={`role-${role.id}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{role.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {role.description || 'No description'}
                          </div>
                        </div>
                        {isAssigned && (
                          <Badge variant="outline" className="ml-2">
                            Currently Assigned
                          </Badge>
                        )}
                      </div>
                    </Label>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleAssignRoles}
          disabled={isAssigning || isLoading}
        >
          {isAssigning ? 'Updating...' : 'Update Roles'}
        </Button>
      </div>
    </div>
  );
}
