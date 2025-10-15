'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { UserForm } from './user-form';
import { CreateUserData, UpdateUserData, User } from '@/types/user';
import { toast } from 'sonner';
import { useCreateUser, useUpdateUser } from '@/hooks/use-users';

interface UserDrawerProps {
  user: User | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
}

export function UserDrawer({ user, open, onOpenChange, mode }: UserDrawerProps) {

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New User';
      case 'edit':
        return 'Edit User';
      case 'view':
        return 'User Details';
      default:
        return 'User';
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (user) {
        const updateData: UpdateUserData = {
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          isActive: data.isActive || true,
          department: data.department || '',
          designation: data.designation || '',
          reportingManagerId: data.reportingManagerId,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          phone: data.phone,
          gender: data.gender,
          dob: data.dateOfBirth
      };
        await updateUser.mutateAsync({ id: user.id.toString(), data: updateData });
        toast.success('User updated successfully');
      } else {
        const createData: CreateUserData = {
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          isActive: data.isActive || true,
          department: data.department || '',
          designation: data.designation || '',
          password: data.password || '',
          reportingManagerId: data.reportingManagerId,
          isEmailVerified: false,
          isPhoneVerified: false,
          phone: data.phone,
          gender: data.gender,
          dob: data.dateOfBirth
      };
        await createUser.mutateAsync(createData);
        toast.success('User created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(user ? 'Failed to update user' : 'Failed to create user');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="xl"
    >
      <UserForm
        mode={mode}
        user={user}
        onSubmit={handleSubmit}
        isLoading={createUser.isPending || updateUser.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </RightDrawer>
  );
}
