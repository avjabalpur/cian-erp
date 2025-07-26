import { Button } from "@/components/ui/button"
import { Permission, CreatePermissionInput, UpdatePermissionInput } from "@/types/permission"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { permissionFormSchema, PermissionFormValues } from "@/validations/permission"
import { PermissionInformationForm } from "./forms/permission-information-form"
import { RightDrawer } from "@/components/shared/right-drawer"
import { toast } from "@/hooks/use-toast"
import { useCreatePermission, useUpdatePermission } from "@/hooks/use-permissions"
import { useEffect } from "react"

interface PermissionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  permission?: Permission | null;
}

export function PermissionDrawer({ isOpen, onClose, permission }: PermissionDrawerProps) {
  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      name: permission?.name || '',
      description: permission?.description || '',
      moduleName: permission?.moduleName || '',
      actionType: (permission?.actionType ? permission.actionType.split(',') : []) as any,
      isActive: permission?.isActive || true,
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting } } = form;
  const { mutate: createPermission, isPending: isCreating } = useCreatePermission();
  const { mutate: updatePermission, isPending: isUpdating } = useUpdatePermission();

  // Reset form values when editing a permission
  useEffect(() => {
    if (permission) {
      reset({
        name: permission.name || '',
        description: permission.description || '',
        moduleName: permission.moduleName || '',
        actionType: (permission.actionType ? permission.actionType.split(',') : []) as any,
        isActive: permission.isActive || true,
      });
    } else {
      reset({
        name: '',
        description: '',
        moduleName: '',
        actionType: [] as any,
        isActive: true,
      });
    }
  }, [permission, reset]);

  const onSubmit = async (data: PermissionFormValues) => {
    try {
      // Convert actionType array to comma-separated string
      const payload = {
        ...data,
        actionType: Array.isArray(data.actionType) ? data.actionType.join(",") : data.actionType,
      };
      if (permission) {
        const updateData: UpdatePermissionInput = {
          id: permission.id,
          ...payload,
        };
        await updatePermission(updateData);
      } else {
        const createData: CreatePermissionInput = {
          ...payload,
        };
        await createPermission(createData);
      }

      toast({
        title: 'Success',
        description: permission ? 'Permission updated successfully' : 'Permission created successfully',
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
      title={permission ? 'Edit Permission' : 'Create Permission'}
      description={permission ? 'Update permission details' : 'Add a new permission to the system'}
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <PermissionInformationForm control={control} />
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
  )
}
