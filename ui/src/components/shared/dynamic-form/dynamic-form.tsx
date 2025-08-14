"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"
import { PropertyDetailsForm } from "./property-details-form"
import { Control, useController } from "react-hook-form"
import { PropertyPair } from "@/types/property"
import { useCreateExtensionData, useUpdateExtensionData, useDeleteExtensionData, useExtensionDataByEntity } from "@/hooks/sales-order/extension-data/use-extension-data"
import { useToast } from "@/hooks/use-toast"

interface KeyValueFormProps {
  control?: Control<any>
  name?: string
  itemId?: number
  entityType: string
}

export function KeyValueForm({ control, name = "properties", itemId ,entityType}: KeyValueFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<PropertyPair | null>(null)
  const { toast } = useToast()

  // Extension data hooks
  const createExtensionDataMutation = useCreateExtensionData()
  const updateExtensionDataMutation = useUpdateExtensionData()
  const deleteExtensionDataMutation = useDeleteExtensionData()

  // Fetch existing properties from API
  const { data: existingProperties = [], isLoading: isLoadingProperties } = useExtensionDataByEntity(
    entityType,
    itemId || 0
  )

  // Use react-hook-form controller to manage the field
  const {
    field: { value: pairs = [], onChange: setPairs },
  } = useController({
    name,
    control,
    defaultValue: [],
  })

  // Sync with API data when itemId changes
  useEffect(() => {
    if (itemId && existingProperties.length > 0) {
      const mappedProperties: PropertyPair[] = existingProperties.map(prop => ({
        id: prop.id.toString(),
        propertyKey: prop.propertyKey,
        propertyLabel: prop.propertyLabel,
        propertyDescription: prop.propertyDescription,
        propertyValue: prop.propertyValue,
      }))
      setPairs(mappedProperties)
    } else if (itemId) {
      setPairs([])
    }
  }, [itemId, existingProperties, setPairs])

  const handleSaveProperty = async (propertyData: Omit<PropertyPair, "id">) => {
    if (!itemId) {
      toast({
        title: "Error",
        description: "Item ID is required to save properties",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingProperty) {
        // Update existing property
        await updateExtensionDataMutation.mutateAsync({
          id: parseInt(editingProperty.id),
          data: {
            entityType: entityType,
            entityTypeId: itemId,
            propertyKey: propertyData.propertyKey,
            propertyLabel: propertyData.propertyLabel,
            propertyDescription: propertyData.propertyDescription,
            propertyValue: propertyData.propertyValue,
          }
        })

        toast({
          title: "Success",
          description: "Property updated successfully",
        })
      } else {
        // Create new property
        await createExtensionDataMutation.mutateAsync({
          entityType: "ItemMaster",
          entityTypeId: itemId,
          propertyKey: propertyData.propertyKey,
          propertyLabel: propertyData.propertyLabel,
          propertyDescription: propertyData.propertyDescription,
          propertyValue: propertyData.propertyValue,
        })

        toast({
          title: "Success",
          description: "Property created successfully",
        })
      }
      
      handleCloseDialog()
    } catch (error: any) {
      console.error('Error saving property:', error)
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Failed to save property",
        variant: "destructive",
      })
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingProperty(null)
  }

  const removePair = async (id: string) => {
    if (!itemId) {
      toast({
        title: "Error",
        description: "Item ID is required to delete properties",
        variant: "destructive",
      })
      return
    }

    try {
      await deleteExtensionDataMutation.mutateAsync({
        id: parseInt(id),
        entityType: "ItemMaster",
        entityTypeId: itemId,
      })

      toast({
        title: "Success",
        description: "Property deleted successfully",
      })
    } catch (error: any) {
      console.error('Error deleting property:', error)
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Failed to delete property",
        variant: "destructive",
      })
    }
  }

  const editProperty = (pair: PropertyPair) => {
    setEditingProperty(pair)
    setIsDialogOpen(true)
  }

  const handleRowClick = (pair: PropertyPair) => {
    editProperty(pair)
  }

  const handleAddNew = () => {
    if (!itemId) {
      toast({
        title: "Error",
        description: "Item ID is required to add properties",
        variant: "destructive",
      })
      return
    }
    setEditingProperty(null)
    setIsDialogOpen(true)
  }

  const isLoading = createExtensionDataMutation.isPending || 
                   updateExtensionDataMutation.isPending || 
                   deleteExtensionDataMutation.isPending || 
                   isLoadingProperties

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Property Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            type="button"
            onClick={handleAddNew} 
            className="w-full"
            disabled={isLoading || !itemId}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Button>
        </CardContent>
      </Card>

      {/* Property Details Form Modal */}
      <PropertyDetailsForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveProperty}
        editingProperty={editingProperty}
      />

      {/* Results Table */}
      {pairs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Properties ({pairs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Key</TableHead>
                  <TableHead>Property Label</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pairs.map((pair: PropertyPair) => (
                  <TableRow
                    key={pair.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(pair)}
                  >
                    <TableCell className="font-medium">{pair.propertyKey}</TableCell>
                    <TableCell>{pair.propertyLabel}</TableCell>
                    <TableCell className="max-w-xs">
                      {pair.propertyDescription ? (
                        <span className="text-sm text-gray-600">{pair.propertyDescription}</span>
                      ) : (
                        <span className="text-sm text-gray-400 italic">No description</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {pair.propertyValue ? (
                        pair.propertyValue
                      ) : (
                        <span className="text-sm text-gray-400 italic">No value</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            editProperty(pair)
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removePair(pair.id)
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {pairs.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {itemId 
                ? "No properties added yet. Click 'Add New Property' to get started!" 
                : "Properties will be available after the item is saved."
              }
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Loading properties...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
