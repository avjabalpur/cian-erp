import { Button } from "@/components/ui/button"
import { RightDrawer } from "@/components/shared/right-drawer"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ConfigSettingInformationForm } from "./config-setting-information-form"
import { useCreateConfigSetting, useUpdateConfigSetting } from "@/hooks/use-config-settings"
import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { configSettingFormSchema, ConfigSettingFormValues } from "@/validations/config-setting"
import { UpdateConfigSettingData } from "@/types/config-setting"

interface ConfigSettingDrawerProps {
  isOpen: boolean
  onClose: () => void
  configSetting?: any | null
  onSuccess?: () => void
}

export function ConfigSettingDrawer({ isOpen, onClose, configSetting, onSuccess }: ConfigSettingDrawerProps) {
  const form = useForm<ConfigSettingFormValues>({
    resolver: zodResolver(configSettingFormSchema),
    defaultValues: {
      settingKey: configSetting?.settingKey || '',
      settingName: configSetting?.settingName || '',
      description: configSetting?.description || '',
      stringValue: configSetting?.stringValue || '',
      integerValue: configSetting?.integerValue || undefined,
      booleanValue: configSetting?.booleanValue || undefined,
      decimalValue: configSetting?.decimalValue || undefined,
      defaultValue: configSetting?.defaultValue || '',
      isActive: configSetting?.isActive ?? true,
    },
  })

  const { control, handleSubmit, reset, formState: { isSubmitting } } = form
  const createConfigSettingMutation = useCreateConfigSetting()
  const updateConfigSettingMutation = useUpdateConfigSetting()

  useEffect(() => {
    if (configSetting) {
      reset({
        settingKey: configSetting.settingKey || '',
        settingName: configSetting.settingName || '',
        description: configSetting.description || '',
        stringValue: configSetting.stringValue || '',
        integerValue: configSetting.integerValue || undefined,
        booleanValue: configSetting.booleanValue || undefined,
        decimalValue: configSetting.decimalValue || undefined,
        defaultValue: configSetting.defaultValue || '',
        isActive: configSetting.isActive ?? true,
      })
    } else {
      reset({
        settingKey: '',
        settingName: '',
        description: '',
        stringValue: '',
        integerValue: undefined,
        booleanValue: undefined,
        decimalValue: undefined,
        defaultValue: '',
        isActive: true,
      })
    }
  }, [configSetting, reset])

  const onSubmit = async (data: ConfigSettingFormValues) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
      }
      
      if (configSetting) {
        const result = await updateConfigSettingMutation.mutateAsync({ 
          id: configSetting.id, 
          data: payload as UpdateConfigSettingData 
        })
        if (result) {
          toast({ title: 'Success', description: 'Config setting updated successfully' })
          reset()
          onSuccess?.()
        }
      } else {
        const result = await createConfigSettingMutation.mutateAsync(payload)
        if (result) {
          toast({ title: 'Success', description: 'Config setting created successfully' })
          reset()
          onSuccess?.()
        }
      }
    } catch (error: any) {
      console.error('Config setting operation failed:', error)
      toast({
        title: 'Error',
        description: error?.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={configSetting ? 'Edit Config Setting' : 'Create Config Setting'}
      description={configSetting ? 'Update config setting details' : 'Add a new config setting to the system'}
      size="2xl"
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ConfigSettingInformationForm control={control} />
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || createConfigSettingMutation.isPending || updateConfigSettingMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createConfigSettingMutation.isPending || updateConfigSettingMutation.isPending}
            >
              {createConfigSettingMutation.isPending || updateConfigSettingMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </RightDrawer>
  )
}