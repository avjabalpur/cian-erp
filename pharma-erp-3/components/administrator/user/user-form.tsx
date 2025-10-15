'use client';

import { useEffect } from 'react';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/shared/forms/form-input';
import { FormSelect } from '@/components/shared/forms/form-select';
import { CreateUserData, UpdateUserData, User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { UserFormValues, userSchema } from '@/app/schemas/user-schema';


interface UserFormProps {
  mode: 'create' | 'edit' | 'view';
  user?: User | null | undefined;
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function UserForm({ mode, user, onSubmit, isLoading, onCancel }: UserFormProps) {

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      isActive: user?.isActive || true,
      department: user?.department || '',
      designation: user?.designation || '',
      password: user?.password || '',
      isEmailVerified: user?.isEmailVerified || false,
      isPhoneVerified: user?.isPhoneVerified || false,
      employeeId: user?.employeeId || '',
      phone: user?.phone || '',
      dob: user?.dob || '',
      gender: user?.gender || '',
    },
  });


  useEffect(() => {
    if (user) {
      // Populate form with user data
      form.reset({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        department: user.department,
        designation: user.designation,
        password: user.password,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        employeeId: user.employeeId,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
      });
    }
  }, [user, form]);

  const handleSubmit = async (data: UserFormValues) => {
    
    try {
      await onSubmit(data as CreateUserData | UpdateUserData);
    } catch (error) {
      console.error('Failed to submit user:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={form.control}
            name="username"
            label="Username"
            placeholder="Enter username"
            inputProps={{
              type: "text",
              autoComplete: "name",
            }}
            disabled={false}
          />
         {mode === 'create' && (
          <FormInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter password"
            inputProps={{
              type: "password",
              autoComplete: "password",
            }}
            disabled={false}
          />
         )}

          <FormInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter email"
            inputProps={{
              type: "email",
              autoComplete: "email",
            }}
            disabled={false}
          />
          <FormInput
            control={form.control}
            name="firstName"
            label="First Name"
            placeholder="Enter first name"
            inputProps={{
              type: "text",
              autoComplete: "name",
            }}
            disabled={false}
          />
          <FormInput
            control={form.control}
            name="lastName"
            label="Last Name"
            placeholder="Enter last name"
            inputProps={{
              type: "text",
              autoComplete: "name",
            }}
            disabled={false}
          />

          <FormSelect
            control={form.control}
            name="gender"
            label="Gender"
            options={[
              { value: 'M', label: 'Male' },
              { value: 'F', label: 'Female' },
              { value: 'O', label: 'Other' },
            ]}
            placeholder="Select gender"
          />

          <FormInput
            control={form.control}
            name="employeeId"
            label="Employee ID"
            placeholder="Enter employee ID"
            inputProps={{
              type: "text",
              autoComplete: "employee-id",
            }}
            disabled={false}
          />

          {/* <FormCustom
            control={form.control}
            name="reportingManagerId"
            label="Reporting Manager"
            className="w-full"
            containerClassName="w-full"
          >
            {({ field }) => {
              
              return (
                <UserOption
                  value={field.value}
                  onChange={(value) => {
                    const numValue = value ? Number(value) : null
                    field.onChange(numValue)
                    form.trigger('reportingManagerId')
                  }}
                  disabled={field.disabled}
                />
              )
            }}
          </FormCustom> */}

          <FormInput
            control={form.control}
            name="phone"
            label="Phone"
            placeholder="Enter phone number"
            inputProps={{
              type: "tel",
              autoComplete: "phone",
            }}
            disabled={false}
          />

          <FormInput
            control={form.control}
            name="dob"
            label="Date of Birth"
            placeholder="Enter date of birth"
            inputProps={{
              type: "date",
              autoComplete: "dob",
            }}
            disabled={false}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-6">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </Button>
      </div>
      
      </form>
    </FormProvider>
  );
}
