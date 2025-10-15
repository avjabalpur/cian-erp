'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { OrganizationForm } from './organization-form';
import { CreateOrganizationData, UpdateOrganizationData, Organization } from '../types';
import { toast } from 'sonner';
import { useCreateOrganization, useUpdateOrganization } from '../hooks';

interface OrganizationDrawerProps {
  organization: Organization | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
}

export function OrganizationDrawer({ organization, open, onOpenChange, mode }: OrganizationDrawerProps) {
  const createOrganization = useCreateOrganization();
  const updateOrganization = useUpdateOrganization();
  
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Organization';
      case 'edit':
        return 'Edit Organization';
      case 'view':
        return 'Organization Details';
      default:
        return 'Organization';
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
      };

      if (organization) {

        const updatePayload = {
          ...data,
          id: organization.id,
        };

        await updateOrganization.mutateAsync({ id: organization.id, data: updatePayload });
        toast.success('Organization updated successfully');
      } else {
        await createOrganization.mutateAsync(payload);
        toast.success('Organization created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(organization ? 'Failed to update organization' : 'Failed to create organization');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="full"
    >
      <OrganizationForm
        mode={mode}
        organization={organization}
        onSubmit={handleSubmit}
        isLoading={createOrganization.isPending || updateOrganization.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </RightDrawer>
  );
}
