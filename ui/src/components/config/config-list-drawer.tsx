"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCreateConfigList, useUpdateConfigList, useConfigListValuesByListId, useCreateConfigListValue, useUpdateConfigListValue, useDeleteConfigListValue } from "@/hooks/config/use-config-lists";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormTextarea } from "@/components/shared/forms/form-textarea";
import { FormCheckbox } from "@/components/shared/forms/form-checkbox";
import { RightDrawer } from "@/components/shared/right-drawer";
import { ConfigListFormData, configListSchema, ConfigListValueFormData } from "@/validations/config-list";
import { ConfigList, ConfigListValue } from "@/types/config-list";
import { Plus, X, Trash2, Edit2 } from "lucide-react";

interface ConfigListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  configList?: ConfigList | null;
  onSuccess: () => void;
}

interface ConfigListValueInput {
  id?: number;
  valueCode: string;
  valueName: string;
  displayOrder: number;
  isActive: boolean;
  isNew?: boolean;
  isEdited?: boolean;
}

export default function ConfigListDrawer({
  isOpen,
  onClose,
  configList,
  onSuccess,
}: ConfigListDrawerProps) {
  const { toast } = useToast();
  const createConfigListMutation = useCreateConfigList();
  const updateConfigListMutation = useUpdateConfigList();
  const createConfigListValueMutation = useCreateConfigListValue();
  const updateConfigListValueMutation = useUpdateConfigListValue();
  const deleteConfigListValueMutation = useDeleteConfigListValue();

  const [configValues, setConfigValues] = useState<ConfigListValueInput[]>([]);
  const [newValue, setNewValue] = useState<ConfigListValueInput>({
    valueCode: "",
    valueName: "",
    displayOrder: 0,
    isActive: true,
  });

  // Load existing config values when editing
  const { data: existingValues = [], isLoading: loadingValues } = useConfigListValuesByListId(
    configList?.id || 0
  );

  const form = useForm<ConfigListFormData>({
    resolver: zodResolver(configListSchema),
    defaultValues: {
      listCode: "",
      listName: "",
      description: "",
      isActive: true,
    },
  });

  const { control, handleSubmit, reset, formState: { isSubmitting, errors } } = form;

  // Load existing values when configList changes
  useEffect(() => {
    if (configList) {
      console.log('Setting form values for edit:', configList);
      reset({
        listCode: configList.listCode || "",
        listName: configList.listName || "",
        description: configList.description || "",
        isActive: configList.isActive ?? true,
      });
    } else {
      console.log('Setting form values for create');
      reset({
        listCode: "",
        listName: "",
        description: "",
        isActive: true,
      });
      setConfigValues([]);
    }
  }, [configList, reset]);

  // Load existing config values when they are fetched - FIXED to prevent infinite loop
  useEffect(() => {
    if (configList?.id && existingValues.length > 0 && configValues.length === 0) {
      console.log('Loading existing config values:', existingValues);
      setConfigValues(
        existingValues.map(value => ({
          id: value.id,
          valueCode: value.valueCode,
          valueName: value.valueName,
          displayOrder: value.displayOrder,
          isActive: value.isActive,
          isNew: false,
          isEdited: false,
        }))
      );
    }
  }, [configList?.id, existingValues.length, configValues.length]);

  const addConfigValue = () => {
    if (newValue.valueCode.trim() && newValue.valueName.trim()) {
      setConfigValues([...configValues, { 
        ...newValue, 
        isNew: true,
        displayOrder: configValues.length + 1 
      }]);
      setNewValue({
        valueCode: "",
        valueName: "",
        displayOrder: configValues.length + 2,
        isActive: true,
      });
    }
  };

  const removeConfigValue = (index: number) => {
    const valueToRemove = configValues[index];
    if (valueToRemove.id && !valueToRemove.isNew) {
      // Mark for deletion instead of removing immediately
      setConfigValues(configValues.map((v, i) => 
        i === index ? { ...v, isActive: false, isEdited: true } : v
      ));
    } else {
      // Remove new values immediately
      setConfigValues(configValues.filter((_, i) => i !== index));
    }
  };

  const updateConfigValue = (index: number, field: keyof ConfigListValueInput, value: any) => {
    const updatedValues = [...configValues];
    updatedValues[index] = { 
      ...updatedValues[index], 
      [field]: value,
      isEdited: true 
    };
    setConfigValues(updatedValues);
  };

  const onSubmit = async (data: ConfigListFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Config values to process:', configValues);
    
    try {
      const payload = {
        listCode: data.listCode,
        listName: data.listName,
        description: data.description,
        isActive: data.isActive,
      };

      console.log('Payload to be sent:', payload);

      let createdConfigListId: number;

      if (configList) {
        console.log('Updating config list with ID:', configList.id);
        const result = await updateConfigListMutation.mutateAsync({
          id: configList.id,
          data: payload,
        });
        console.log('Update result:', result);
        createdConfigListId = configList.id;
        toast({
          title: "Success",
          description: "Config list updated successfully",
        });
      } else {
        console.log('Creating new config list');
        const result = await createConfigListMutation.mutateAsync(payload);
        console.log('Create result:', result);
        createdConfigListId = result.id;
        toast({
          title: "Success",
          description: "Config list created successfully",
        });
      }

      // Process config values
      if (configValues.length > 0) {
        console.log('Processing config values for list ID:', createdConfigListId);
        
        for (const value of configValues) {
          try {
            if (value.isNew && value.isActive) {
              // Create new value
              console.log('Creating new config value:', value);
              await createConfigListValueMutation.mutateAsync({
                listId: createdConfigListId,
                valueCode: value.valueCode,
                valueName: value.valueName,
                displayOrder: value.displayOrder,
                isActive: value.isActive,
                extraData: null,
              });
            } else if (value.isEdited && value.id) {
              if (!value.isActive) {
                // Delete the value
                console.log('Deleting config value:', value);
                await deleteConfigListValueMutation.mutateAsync(value.id);
              } else {
                // Update existing value
                console.log('Updating config value:', value);
                await updateConfigListValueMutation.mutateAsync({
                  id: value.id,
                  data: {
                    listId: createdConfigListId,
                    valueCode: value.valueCode,
                    valueName: value.valueName,
                    displayOrder: value.displayOrder,
                    isActive: value.isActive,
                    extraData: null,
                  },
                });
              }
            }
          } catch (error) {
            console.error('Failed to process config value:', value, error);
            toast({
              title: "Warning",
              description: `Failed to process value: ${value.valueCode}`,
              variant: "destructive",
            });
          }
        }
        
        const newValuesCount = configValues.filter(v => v.isNew && v.isActive).length;
        const updatedValuesCount = configValues.filter(v => v.isEdited && v.id).length;
        
        if (newValuesCount > 0 || updatedValuesCount > 0) {
          toast({
            title: "Success",
            description: `Processed ${newValuesCount} new and ${updatedValuesCount} updated config values`,
          });
        }
      }

      reset();
      setConfigValues([]);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Config list operation failed:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response,
        status: error?.response?.status,
        data: error?.response?.data
      });
      
      // Handle specific error cases
      let errorMessage = configList 
        ? "Failed to update config list" 
        : "Failed to create config list";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    reset();
    setConfigValues([]);
    onClose();
  };

  const isLoading = createConfigListMutation.isPending || updateConfigListMutation.isPending;

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={configList ? "Edit Config List" : "Create New Config List"}
      description={configList 
        ? "Update the config list information and values below." 
        : "Fill in the information below to create a new config list with values."
      }
      size="xl"
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Config List Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Config List Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormInput
                  control={control}
                  name="listCode"
                  label="List Code"
                  placeholder="Enter list code (e.g., hsn_type)"
                  required
                />

                <FormInput
                  control={control}
                  name="listName"
                  label="List Name"
                  placeholder="Enter list name"
                  required
                />
              </div>

              <FormTextarea
                control={control}
                name="description"
                label="Description"
                placeholder="Enter description"
              />

              <FormCheckbox
                  control={control}
                  name="isActive"
                  label="Active Status"
                  inline={true}
                />
            </CardContent>
          </Card>

          {/* Config Values Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Config Values</CardTitle>
              <p className="text-sm text-muted-foreground">
                {configList ? "Edit existing values or add new ones" : "Add values for this config list"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Loading state for existing values */}
              {configList && loadingValues && (
                <div className="text-center py-2">
                  <div className="text-sm text-muted-foreground">Loading existing values...</div>
                </div>
              )}

              {/* Add New Value Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2 border rounded-lg bg-gray-50">
                <div>
                  <Label htmlFor="valueCode">Value Code</Label>
                  <Input
                    id="valueCode"
                    value={newValue.valueCode}
                    onChange={(e) => setNewValue({ ...newValue, valueCode: e.target.value })}
                    placeholder="Code"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="valueName">Value Name</Label>
                  <Input
                    id="valueName"
                    value={newValue.valueName}
                    onChange={(e) => setNewValue({ ...newValue, valueName: e.target.value })}
                    placeholder="Name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={newValue.displayOrder}
                    onChange={(e) => setNewValue({ ...newValue, displayOrder: parseInt(e.target.value) || 0 })}
                    placeholder="Order"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={addConfigValue}
                    disabled={!newValue.valueCode.trim() || !newValue.valueName.trim()}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Existing Values List */}
              {configValues.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Values ({configValues.filter(v => v.isActive).length} active)
                  </Label>
                  <div className="space-y-2 overflow-y-auto">
                    {configValues.map((value, index) => (
                      <div
                        key={value.id ? `existing-${value.id}` : `new-${index}-${value.valueCode}`}
                        className={`flex items-center justify-between p-2 border rounded-lg ${
                          value.isActive ? 'bg-white' : 'bg-red-50 border-red-200'
                        } ${value.isNew ? 'border-blue-200 bg-blue-50' : ''} ${value.isEdited ? 'border-yellow-200 bg-yellow-50' : ''}`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <Badge variant="secondary" className="min-w-[60px]">
                            {value.displayOrder}
                          </Badge>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{value.valueName}</div>
                            <div className="text-xs text-gray-500">{value.valueCode}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {value.isNew && <Badge variant="default" className="text-xs">New</Badge>}
                            {value.isEdited && <Badge variant="secondary" className="text-xs">Edited</Badge>}
                            {!value.isActive && <Badge variant="destructive" className="text-xs">Deleted</Badge>}
                            {value.isActive && !value.isNew && !value.isEdited && (
                              <Badge variant="outline" className="text-xs">Active</Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeConfigValue(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? "Saving..." : configList ? "Update Config List" : "Create Config List"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </RightDrawer>
  );
} 