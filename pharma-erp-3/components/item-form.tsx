"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, ChevronLeft, ChevronRight, Save, X } from "lucide-react"

interface ItemFormProps {
  item?: any
  onSave: (item: any) => void
  onCancel: () => void
}

export function ItemForm({ item, onSave, onCancel }: ItemFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Basic Information
    item_code: item?.item_code || "",
    item_name: item?.item_name || "",
    item_group: item?.item_group || "",
    brand: item?.brand || "",
    manufacturer: item?.manufacturer || "",
    description: item?.description || "",

    // Manufacturing Details
    manufacturing_type: item?.manufacturing_type || "",
    batch_size: item?.batch_size || "",
    shelf_life_months: item?.shelf_life_months || "",
    storage_conditions: item?.storage_conditions || "",
    packaging_type: item?.packaging_type || "",

    // Quality Control
    pharmacopoeia_name: item?.pharmacopoeia_name || "",
    active_ingredients: item?.active_ingredients || "",
    strength: item?.strength || "",
    dosage_form: item?.dosage_form || "",
    allergen_info: item?.allergen_info || "",

    // Regulatory
    drug_license_number: item?.drug_license_number || "",
    regulatory_status: item?.regulatory_status || "",
    controlled_substance: item?.controlled_substance || false,

    // Sales & Pricing
    selling_price: item?.selling_price || "",
    purchase_price: item?.purchase_price || "",
    mrp: item?.mrp || "",
    tax_category: item?.tax_category || "",

    // Inventory
    reorder_level: item?.reorder_level || "",
    max_stock_level: item?.max_stock_level || "",
    lead_time_days: item?.lead_time_days || "",

    // Additional fields for all 54 columns...
    is_active: item?.is_active ?? true,
    requires_batch_tracking: item?.requires_batch_tracking ?? true,
    temperature_controlled: item?.temperature_controlled ?? false,
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const formSteps = [
    {
      id: "basic",
      title: "Basic Information",
      description: "Core item details and identification",
      fields: ["item_code", "item_name", "item_group", "brand", "manufacturer", "description"],
      required: ["item_code", "item_name", "item_group"],
    },
    {
      id: "manufacturing",
      title: "Manufacturing",
      description: "Production and packaging specifications",
      fields: ["manufacturing_type", "batch_size", "shelf_life_months", "storage_conditions", "packaging_type"],
      required: ["manufacturing_type", "batch_size"],
    },
    {
      id: "quality",
      title: "Quality Control",
      description: "Pharmaceutical specifications and testing",
      fields: ["pharmacopoeia_name", "active_ingredients", "strength", "dosage_form", "allergen_info"],
      required: ["active_ingredients", "strength", "dosage_form"],
    },
    {
      id: "regulatory",
      title: "Regulatory",
      description: "Compliance and licensing information",
      fields: ["drug_license_number", "regulatory_status", "controlled_substance"],
      required: ["drug_license_number", "regulatory_status"],
    },
    {
      id: "pricing",
      title: "Sales & Pricing",
      description: "Commercial and financial details",
      fields: ["selling_price", "purchase_price", "mrp", "tax_category"],
      required: ["selling_price", "tax_category"],
    },
    {
      id: "inventory",
      title: "Inventory",
      description: "Stock management and logistics",
      fields: ["reorder_level", "max_stock_level", "lead_time_days"],
      required: ["reorder_level"],
    },
  ]

  const validateStep = (stepIndex: number) => {
    const step = formSteps[stepIndex]
    const errors: Record<string, string> = {}

    step.required.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = "This field is required"
      }
    })

    setValidationErrors(errors)

    if (Object.keys(errors).length === 0) {
      setCompletedSteps((prev) => new Set([...prev, stepIndex]))
      return true
    }
    return false
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSave = () => {
    // Validate all steps
    let allValid = true
    for (let i = 0; i < formSteps.length; i++) {
      if (!validateStep(i)) {
        allValid = false
        setCurrentStep(i)
        break
      }
    }

    if (allValid) {
      onSave(formData)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const renderField = (field: string) => {
    const value = formData[field as keyof typeof formData]
    const error = validationErrors[field]

    switch (field) {
      case "description":
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field} className="text-sm font-medium">
              {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Label>
            <Textarea
              id={field}
              value={value as string}
              onChange={(e) => updateField(field, e.target.value)}
              className={error ? "border-red-500" : ""}
              rows={3}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )

      case "item_group":
      case "manufacturing_type":
      case "storage_conditions":
      case "packaging_type":
      case "dosage_form":
      case "regulatory_status":
      case "tax_category":
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field} className="text-sm font-medium">
              {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Label>
            <Select value={value as string} onValueChange={(val) => updateField(field, val)}>
              <SelectTrigger className={error ? "border-red-500" : ""}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {getSelectOptions(field).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )

      case "controlled_substance":
      case "is_active":
      case "requires_batch_tracking":
      case "temperature_controlled":
        return (
          <div key={field} className="flex items-center space-x-2">
            <Checkbox
              id={field}
              checked={value as boolean}
              onCheckedChange={(checked) => updateField(field, checked)}
            />
            <Label htmlFor={field} className="text-sm font-medium">
              {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Label>
          </div>
        )

      default:
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field} className="text-sm font-medium">
              {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Label>
            <Input
              id={field}
              type={
                field.includes("price") ||
                field.includes("level") ||
                field.includes("size") ||
                field.includes("days") ||
                field.includes("months")
                  ? "number"
                  : "text"
              }
              value={value as string}
              onChange={(e) => updateField(field, e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )
    }
  }

  const getSelectOptions = (field: string) => {
    const options: Record<string, string[]> = {
      item_group: ["Raw Material", "Finished Product", "Packaging Material", "Intermediate"],
      manufacturing_type: ["Capsules", "Tablets", "Liquids", "Sachets", "Injections"],
      storage_conditions: ["Room Temperature", "Refrigerated (2-8°C)", "Frozen (-20°C)", "Controlled Room Temperature"],
      packaging_type: ["Blister Pack", "Bottle", "Vial", "Sachet", "Tube", "Ampoule"],
      dosage_form: ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment", "Powder"],
      regulatory_status: ["Approved", "Pending", "Under Review", "Rejected"],
      tax_category: ["GST 5%", "GST 12%", "GST 18%", "GST 28%", "Exempt"],
    }
    return options[field] || []
  }

  const currentStepData = formSteps[currentStep]
  const progress = ((currentStep + 1) / formSteps.length) * 100

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{item ? "Edit Item" : "Add New Item"}</h2>
              <p className="text-sm text-gray-600 mt-1">Complete all sections to create a comprehensive item record</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>
                Step {currentStep + 1} of {formSteps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="border-b px-6 py-3">
          <div className="flex space-x-1 overflow-x-auto">
            {formSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${
                  index === currentStep
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : completedSteps.has(index)
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {completedSteps.has(index) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                )}
                <span>{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
              <p className="text-sm text-gray-600">{currentStepData.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentStepData.fields.map((field) => renderField(field))}
              </div>

              {/* Required Fields Notice */}
              <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Required Fields</p>
                    <p className="text-xs text-amber-700 mt-1">
                      {currentStepData.required
                        .map((field) => field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()))
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {completedSteps.size > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {completedSteps.size} of {formSteps.length} sections completed
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              {currentStep < formSteps.length - 1 ? (
                <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700">
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="h-4 w-4 mr-1" />
                  Save Item
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
