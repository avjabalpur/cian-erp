"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RightDrawer } from "@/components/shared/right-drawer"
import type { PropertyPair } from "@/types/property"

interface PropertyDetailsFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (propertyData: Omit<PropertyPair, "id">) => void
  editingProperty: PropertyPair | null
}

export function PropertyDetailsForm({ isOpen, onClose, onSave, editingProperty }: PropertyDetailsFormProps) {
  const [formData, setFormData] = useState({
    propertyKey: "",
    propertyLabel: "",
    propertyDescription: "",
    propertyValue: "",
  })

  useEffect(() => {
    if (isOpen && editingProperty) {
      setFormData({
        propertyKey: editingProperty.propertyKey,
        propertyLabel: editingProperty.propertyLabel,
        propertyDescription: editingProperty.propertyDescription || "",
        propertyValue: editingProperty.propertyValue || "",
      })
    } else if (isOpen && !editingProperty) {
      setFormData({
        propertyKey: "",
        propertyLabel: "",
        propertyDescription: "",
        propertyValue: "",
      })
    }
  }, [isOpen, editingProperty])

  const handleSave = () => {
    if (formData.propertyKey.trim() && formData.propertyLabel.trim()) {
      onSave({
        propertyKey: formData.propertyKey.trim(),
        propertyLabel: formData.propertyLabel.trim(),
        propertyDescription: formData.propertyDescription.trim() || undefined,
        propertyValue: formData.propertyValue.trim() || undefined,
      })
    }
  }

  const handleCancel = () => {
    onClose()
  }

  const updateFormField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = formData.propertyKey.trim() && formData.propertyLabel.trim()

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={editingProperty ? "Edit Property Details" : "Add Property Details"}
      description="Fill in the property information below"
      size="md"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyKey">Property Key *</Label>
            <Input
              id="propertyKey"
              placeholder="Enter property key..."
              value={formData.propertyKey}
              onChange={(e) => updateFormField("propertyKey", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="propertyLabel">Property Label *</Label>
            <Input
              id="propertyLabel"
              placeholder="Enter property label..."
              value={formData.propertyLabel}
              onChange={(e) => updateFormField("propertyLabel", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="propertyDescription">Property Description</Label>
            <Textarea
              id="propertyDescription"
              placeholder="Enter property description (optional)..."
              value={formData.propertyDescription}
              onChange={(e) => updateFormField("propertyDescription", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="propertyValue">Property Value</Label>
            <Input
              id="propertyValue"
              placeholder="Enter property value (optional)..."
              value={formData.propertyValue}
              onChange={(e) => updateFormField("propertyValue", e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t">
          <Button onClick={handleSave} disabled={!isFormValid} className="flex-1">
            {editingProperty ? "Update Property" : "Save Property"}
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </RightDrawer>
  )
}
