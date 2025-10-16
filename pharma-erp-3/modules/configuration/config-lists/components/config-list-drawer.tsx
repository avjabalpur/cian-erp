'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RightDrawer } from '@/components/shared/right-drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfigList, ConfigListValue } from '../types';
import { configListSchema, ConfigListFormValues } from '../validations';
import { FormInput } from '@/components/shared/forms/form-input';
import { FormCheckbox } from '@/components/shared/forms/form-checkbox';
import { FormTextArea } from '@/components/shared/forms/form-text-area';
import { toast } from 'sonner';
import {
  useCreateConfigList,
  useUpdateConfigList,
  useConfigListValuesByListId,
  useCreateConfigListValue,
  useUpdateConfigListValue,
  useDeleteConfigListValue
} from '../hooks';
import { Plus, Trash2 } from 'lucide-react';

interface ConfigListDrawerProps {
  configList: ConfigList | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
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

export function ConfigListDrawer({ configList, open, onOpenChange, mode }: ConfigListDrawerProps) {
  const createConfigList = useCreateConfigList();
  const updateConfigList = useUpdateConfigList();
  const createConfigListValue = useCreateConfigListValue();
  const updateConfigListValue = useUpdateConfigListValue();
  const deleteConfigListValue = useDeleteConfigListValue();

  const [configValues, setConfigValues] = useState<ConfigListValueInput[]>([]);
  const [newValue, setNewValue] = useState<ConfigListValueInput>({
    valueCode: '',
    valueName: '',
    displayOrder: 0,
    isActive: true,
  });

  // Load existing config values when editing
  const { data: existingValues = [], isLoading: loadingValues } = useConfigListValuesByListId(
    configList?.id || 0
  );

  const form = useForm<ConfigListFormValues>({
    resolver: zodResolver(configListSchema),
    defaultValues: {
      listCode: '',
      listName: '',
      description: '',
      isActive: true,
    },
  });

  // Load config list data when editing
  useEffect(() => {
    if (configList) {
      form.reset({
        listCode: configList.listCode,
        listName: configList.listName,
        description: configList.description || '',
        isActive: configList.isActive,
      });
    } else {
      form.reset({
        listCode: '',
        listName: '',
        description: '',
        isActive: true,
      });
      setConfigValues([]);
    }
  }, [configList, form]);

  // Load existing config values
  useEffect(() => {
    if (configList?.id && existingValues.length > 0 && configValues.length === 0) {
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
        valueCode: '',
        valueName: '',
        displayOrder: configValues.length + 2,
        isActive: true,
      });
    }
  };

  const removeConfigValue = (index: number) => {
    const valueToRemove = configValues[index];
    if (valueToRemove.id && !valueToRemove.isNew) {
      // Mark for deletion
      setConfigValues(configValues.map((v, i) =>
        i === index ? { ...v, isActive: false, isEdited: true } : v
      ));
    } else {
      // Remove new values immediately
      setConfigValues(configValues.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (data: ConfigListFormValues) => {
    try {
      const payload = {
        listCode: data.listCode,
        listName: data.listName,
        description: data.description,
        isActive: data.isActive ?? true,
      };

      let createdConfigListId: number;

      if (configList) {
        await updateConfigList.mutateAsync({ id: configList.id, data: payload });
        createdConfigListId = configList.id;
        toast.success('Config list updated successfully');
      } else {
        const result = await createConfigList.mutateAsync(payload);
        createdConfigListId = result.id;
        toast.success('Config list created successfully');
      }

      // Process config values
      if (configValues.length > 0) {
        for (const value of configValues) {
          try {
            if (value.isNew && value.isActive) {
              await createConfigListValue.mutateAsync({
                listId: createdConfigListId,
                valueCode: value.valueCode,
                valueName: value.valueName,
                displayOrder: value.displayOrder,
                isActive: value.isActive,
              });
            } else if (value.isEdited && value.id) {
              if (!value.isActive) {
                await deleteConfigListValue.mutateAsync(value.id);
              } else {
                await updateConfigListValue.mutateAsync({
                  id: value.id,
                  data: {
                    listId: createdConfigListId,
                    valueCode: value.valueCode,
                    valueName: value.valueName,
                    displayOrder: value.displayOrder,
                    isActive: value.isActive,
                  },
                });
              }
            }
          } catch (error) {
            console.error('Failed to process config value:', value, error);
          }
        }
        
        const newValuesCount = configValues.filter(v => v.isNew && v.isActive).length;
        if (newValuesCount > 0) {
          toast.success(`Added ${newValuesCount} config value(s)`);
        }
      }

      form.reset();
      setConfigValues([]);
      onOpenChange(false);
    } catch (error) {
      toast.error(configList ? 'Failed to update config list' : 'Failed to create config list');
    }
  };

  const handleClose = () => {
    form.reset();
    setConfigValues([]);
    onOpenChange(false);
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Config List';
      case 'edit':
        return 'Edit Config List';
      case 'view':
        return 'Config List Details';
      default:
        return 'Config List';
    }
  };

  const isLoading = createConfigList.isPending || updateConfigList.isPending;

  return (
    <RightDrawer
      open={open}
      onOpenChange={handleClose}
      title={getTitle()}
      size="xl"
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Config List Details */}
          <Card>
            <CardHeader>
              <CardTitle>Config List Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  control={form.control}
                  name="listCode"
                  label="List Code"
                  placeholder="Enter list code (e.g., hsn_type)"
                  required
                />
                <FormInput
                  control={form.control}
                  name="listName"
                  label="List Name"
                  placeholder="Enter list name"
                  required
                />
              </div>
              <FormTextArea
                control={form.control}
                name="description"
                label="Description"
                placeholder="Enter description"
                rows={3}
              />
              <FormCheckbox
                control={form.control}
                name="isActive"
                label="Active Status"
                inline={true}
              />
            </CardContent>
          </Card>

          {/* Config Values Section */}
          <Card>
            <CardHeader>
              <CardTitle>Config Values</CardTitle>
              <p className="text-sm text-muted-foreground">
                {configList ? 'Edit existing values or add new ones' : 'Add values for this config list'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Value Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <Label htmlFor="valueCode" className="text-xs">Value Code</Label>
                  <Input
                    id="valueCode"
                    value={newValue.valueCode}
                    onChange={(e) => setNewValue({ ...newValue, valueCode: e.target.value })}
                    placeholder="Code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valueName" className="text-xs">Value Name</Label>
                  <Input
                    id="valueName"
                    value={newValue.valueName}
                    onChange={(e) => setNewValue({ ...newValue, valueName: e.target.value })}
                    placeholder="Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayOrder" className="text-xs">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={newValue.displayOrder}
                    onChange={(e) => setNewValue({ ...newValue, displayOrder: parseInt(e.target.value) || 0 })}
                    placeholder="Order"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={addConfigValue}
                    disabled={!newValue.valueCode.trim() || !newValue.valueName.trim()}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
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
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {configValues.map((value, index) => (
                      <div
                        key={value.id ? `existing-${value.id}` : `new-${index}-${value.valueCode}`}
                        className={`flex items-center justify-between p-3 border rounded-lg ${
                          value.isActive ? 'bg-background' : 'bg-red-50 border-red-200'
                        } ${value.isNew ? 'border-blue-200 bg-blue-50' : ''} ${value.isEdited ? 'border-yellow-200 bg-yellow-50' : ''}`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <Badge variant="secondary" className="min-w-[60px]">
                            #{value.displayOrder}
                          </Badge>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{value.valueName}</div>
                            <div className="text-xs text-muted-foreground">{value.valueCode}</div>
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
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : configList ? 'Update Config List' : 'Create Config List'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </RightDrawer>
  );
}
