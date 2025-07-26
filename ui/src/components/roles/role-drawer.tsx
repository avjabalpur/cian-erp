import { Button } from "@/components/ui/button";
import { Role, CreateRoleInput, UpdateRoleInput } from "@/types/role";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleInformationForm } from "./forms/role-information-form";
import { RightDrawer } from "@/components/shared/right-drawer";
import { toast } from "@/hooks/use-toast";
import { roleFormSchema, RoleFormValues } from "@/validations/role";
import { useCreateRole, useUpdateRole } from "@/hooks/use-roles";


interface RoleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
}

export function RoleDrawer({ isOpen, onClose, role }: RoleDrawerProps) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      isActive: role?.isActive || true,
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = form;
  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();

  const onSubmit = async (data: RoleFormValues) => {
    try {
      if (role) {
        // Update existing role
        const updateData: UpdateRoleInput = {
          id: role.id,
          ...data,
        };
        await updateRole({ id: role.id, data: updateData });
      } else {
        // Create new role
        const createData: CreateRoleInput = {
          ...data,
        };
        await createRole(createData);
      }
      
      toast({
        title: 'Success',
        description: role ? 'Role updated successfully' : 'Role created successfully',
      });
      
      reset();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={role ? 'Edit Role' : 'Create Role'}
      description={role ? 'Update role details' : 'Add a new role to the system'}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <RoleInformationForm control={control} />
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isCreating || isUpdating}
            >
              {isCreating || isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </RightDrawer>
  );
}
