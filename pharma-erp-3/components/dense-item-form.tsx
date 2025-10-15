"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Save, X } from "lucide-react"

interface DenseItemFormProps {
  item?: any
  onSave: (item: any) => void
  onCancel: () => void
}

export function DenseItemForm({ item, onSave, onCancel }: DenseItemFormProps) {
  const [formData, setFormData] = useState(item || {})
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    manufacturing: true,
    quality: true,
    sales: false,
    regulatory: false,
    inventory: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const SectionHeader = ({ title, section, count }: { title: string; section: string; count: number }) => (
    <div
      className="flex items-center justify-between py-1 px-2 bg-slate-100 cursor-pointer hover:bg-slate-200 border-b"
      onClick={() => toggleSection(section)}
    >
      <div className="flex items-center gap-2">
        {expandedSections[section] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <span className="font-medium text-sm">{title}</span>
        <span className="text-xs text-slate-500">({count} fields)</span>
      </div>
    </div>
  )

  const FormField = ({
    label,
    children,
    className = "",
  }: { label: string; children: React.ReactNode; className?: string }) => (
    <div className={`space-y-1 ${className}`}>
      <Label className="text-xs font-medium text-slate-700">{label}</Label>
      {children}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-slate-50">
          <h2 className="text-lg font-semibold">{item ? "Edit Item" : "New Item"}</h2>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <div className="p-4 space-y-2">
            {/* Basic Information */}
            <Card className="border-slate-200">
              <SectionHeader title="Basic Information" section="basic" count={12} />
              {expandedSections.basic && (
                <div className="p-3 grid grid-cols-6 gap-3 text-xs">
                  <FormField label="Item Code *">
                    <Input
                      value={formData.item_code || ""}
                      onChange={(e) => updateField("item_code", e.target.value)}
                      className="h-8 text-xs"
                      placeholder="AUTO-GEN"
                    />
                  </FormField>
                  <FormField label="Item Name *">
                    <Input
                      value={formData.item_name || ""}
                      onChange={(e) => updateField("item_name", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Generic Name">
                    <Input
                      value={formData.generic_name || ""}
                      onChange={(e) => updateField("generic_name", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Brand Name">
                    <Input
                      value={formData.brand_name || ""}
                      onChange={(e) => updateField("brand_name", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Item Type *">
                    <Select value={formData.item_type || ""} onValueChange={(value) => updateField("item_type", value)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="raw_material">Raw Material</SelectItem>
                        <SelectItem value="finished_good">Finished Good</SelectItem>
                        <SelectItem value="semi_finished">Semi-Finished</SelectItem>
                        <SelectItem value="packaging">Packaging</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Category">
                    <Select value={formData.category || ""} onValueChange={(value) => updateField("category", value)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="capsule">Capsule</SelectItem>
                        <SelectItem value="liquid">Liquid</SelectItem>
                        <SelectItem value="powder">Powder</SelectItem>
                        <SelectItem value="injection">Injection</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Strength">
                    <Input
                      value={formData.strength || ""}
                      onChange={(e) => updateField("strength", e.target.value)}
                      className="h-8 text-xs"
                      placeholder="e.g., 500mg"
                    />
                  </FormField>
                  <FormField label="Unit of Measure *">
                    <Select value={formData.uom || ""} onValueChange={(value) => updateField("uom", value)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">Pieces</SelectItem>
                        <SelectItem value="kg">Kilogram</SelectItem>
                        <SelectItem value="ltr">Liter</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="strip">Strip</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="HSN Code">
                    <Input
                      value={formData.hsn_code || ""}
                      onChange={(e) => updateField("hsn_code", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Pharmacopoeia">
                    <Select
                      value={formData.pharmacopoeia_name || ""}
                      onValueChange={(value) => updateField("pharmacopoeia_name", value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usp">USP</SelectItem>
                        <SelectItem value="bp">BP</SelectItem>
                        <SelectItem value="ip">IP</SelectItem>
                        <SelectItem value="ep">EP</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Status">
                    <Select value={formData.status || "active"} onValueChange={(value) => updateField("status", value)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Description" className="col-span-6">
                    <Textarea
                      value={formData.description || ""}
                      onChange={(e) => updateField("description", e.target.value)}
                      className="h-16 text-xs resize-none"
                      placeholder="Item description..."
                    />
                  </FormField>
                </div>
              )}
            </Card>

            {/* Manufacturing */}
            <Card className="border-slate-200">
              <SectionHeader title="Manufacturing & Production" section="manufacturing" count={15} />
              {expandedSections.manufacturing && (
                <div className="p-3 grid grid-cols-6 gap-3 text-xs">
                  <FormField label="Manufacturing Type">
                    <Select
                      value={formData.manufacturing_type || ""}
                      onValueChange={(value) => updateField("manufacturing_type", value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_house">In-House</SelectItem>
                        <SelectItem value="contract">Contract Manufacturing</SelectItem>
                        <SelectItem value="third_party">Third Party</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Batch Size">
                    <Input
                      type="number"
                      value={formData.batch_size || ""}
                      onChange={(e) => updateField("batch_size", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Lead Time (Days)">
                    <Input
                      type="number"
                      value={formData.lead_time_days || ""}
                      onChange={(e) => updateField("lead_time_days", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Shelf Life (Months)">
                    <Input
                      type="number"
                      value={formData.shelf_life_months || ""}
                      onChange={(e) => updateField("shelf_life_months", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Storage Condition">
                    <Select
                      value={formData.storage_condition || ""}
                      onValueChange={(value) => updateField("storage_condition", value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="room_temp">Room Temperature</SelectItem>
                        <SelectItem value="cold_storage">Cold Storage (2-8°C)</SelectItem>
                        <SelectItem value="frozen">Frozen (-20°C)</SelectItem>
                        <SelectItem value="controlled">Controlled Room Temperature</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Packaging Type">
                    <Select
                      value={formData.packaging_type || ""}
                      onValueChange={(value) => updateField("packaging_type", value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blister">Blister Pack</SelectItem>
                        <SelectItem value="bottle">Bottle</SelectItem>
                        <SelectItem value="vial">Vial</SelectItem>
                        <SelectItem value="sachet">Sachet</SelectItem>
                        <SelectItem value="tube">Tube</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="batch_required"
                      checked={formData.batch_required || false}
                      onCheckedChange={(checked) => updateField("batch_required", checked)}
                    />
                    <Label htmlFor="batch_required" className="text-xs">
                      Batch Required
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="serial_required"
                      checked={formData.serial_required || false}
                      onCheckedChange={(checked) => updateField("serial_required", checked)}
                    />
                    <Label htmlFor="serial_required" className="text-xs">
                      Serial Required
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="expiry_required"
                      checked={formData.expiry_required || false}
                      onCheckedChange={(checked) => updateField("expiry_required", checked)}
                    />
                    <Label htmlFor="expiry_required" className="text-xs">
                      Expiry Required
                    </Label>
                  </div>
                  <FormField label="Allergen Info">
                    <Input
                      value={formData.allergen_info || ""}
                      onChange={(e) => updateField("allergen_info", e.target.value)}
                      className="h-8 text-xs"
                      placeholder="e.g., Contains lactose"
                    />
                  </FormField>
                  <FormField label="Route of Admin">
                    <Select
                      value={formData.route_of_administration || ""}
                      onValueChange={(value) => updateField("route_of_administration", value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oral">Oral</SelectItem>
                        <SelectItem value="topical">Topical</SelectItem>
                        <SelectItem value="injection">Injection</SelectItem>
                        <SelectItem value="inhalation">Inhalation</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Dosage Form">
                    <Input
                      value={formData.dosage_form || ""}
                      onChange={(e) => updateField("dosage_form", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                </div>
              )}
            </Card>

            {/* Quality Control */}
            <Card className="border-slate-200">
              <SectionHeader title="Quality Control & Testing" section="quality" count={10} />
              {expandedSections.quality && (
                <div className="p-3 grid grid-cols-6 gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="qc_required"
                      checked={formData.qc_required || false}
                      onCheckedChange={(checked) => updateField("qc_required", checked)}
                    />
                    <Label htmlFor="qc_required" className="text-xs">
                      QC Required
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="incoming_inspection"
                      checked={formData.incoming_inspection || false}
                      onCheckedChange={(checked) => updateField("incoming_inspection", checked)}
                    />
                    <Label htmlFor="incoming_inspection" className="text-xs">
                      Incoming Inspection
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in_process_testing"
                      checked={formData.in_process_testing || false}
                      onCheckedChange={(checked) => updateField("in_process_testing", checked)}
                    />
                    <Label htmlFor="in_process_testing" className="text-xs">
                      In-Process Testing
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="finished_product_testing"
                      checked={formData.finished_product_testing || false}
                      onCheckedChange={(checked) => updateField("finished_product_testing", checked)}
                    />
                    <Label htmlFor="finished_product_testing" className="text-xs">
                      Finished Product Testing
                    </Label>
                  </div>
                  <FormField label="Test Method">
                    <Input
                      value={formData.test_method || ""}
                      onChange={(e) => updateField("test_method", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Specification">
                    <Input
                      value={formData.specification || ""}
                      onChange={(e) => updateField("specification", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                </div>
              )}
            </Card>

            {/* Sales & Pricing */}
            <Card className="border-slate-200">
              <SectionHeader title="Sales & Pricing" section="sales" count={8} />
              {expandedSections.sales && (
                <div className="p-3 grid grid-cols-6 gap-3 text-xs">
                  <FormField label="Standard Rate">
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.standard_rate || ""}
                      onChange={(e) => updateField("standard_rate", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Purchase Rate">
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.purchase_rate || ""}
                      onChange={(e) => updateField("purchase_rate", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="MRP">
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.mrp || ""}
                      onChange={(e) => updateField("mrp", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Tax Category">
                    <Select
                      value={formData.tax_category || ""}
                      onValueChange={(value) => updateField("tax_category", value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gst_5">GST 5%</SelectItem>
                        <SelectItem value="gst_12">GST 12%</SelectItem>
                        <SelectItem value="gst_18">GST 18%</SelectItem>
                        <SelectItem value="gst_28">GST 28%</SelectItem>
                        <SelectItem value="exempt">Exempt</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_sales_item"
                      checked={formData.is_sales_item || false}
                      onCheckedChange={(checked) => updateField("is_sales_item", checked)}
                    />
                    <Label htmlFor="is_sales_item" className="text-xs">
                      Sales Item
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_purchase_item"
                      checked={formData.is_purchase_item || false}
                      onCheckedChange={(checked) => updateField("is_purchase_item", checked)}
                    />
                    <Label htmlFor="is_purchase_item" className="text-xs">
                      Purchase Item
                    </Label>
                  </div>
                </div>
              )}
            </Card>

            {/* Regulatory */}
            <Card className="border-slate-200">
              <SectionHeader title="Regulatory & Compliance" section="regulatory" count={6} />
              {expandedSections.regulatory && (
                <div className="p-3 grid grid-cols-6 gap-3 text-xs">
                  <FormField label="Drug License No">
                    <Input
                      value={formData.drug_license_no || ""}
                      onChange={(e) => updateField("drug_license_no", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Schedule">
                    <Select value={formData.schedule || ""} onValueChange={(value) => updateField("schedule", value)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="h">Schedule H</SelectItem>
                        <SelectItem value="h1">Schedule H1</SelectItem>
                        <SelectItem value="x">Schedule X</SelectItem>
                        <SelectItem value="otc">OTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="narcotic_drug"
                      checked={formData.narcotic_drug || false}
                      onCheckedChange={(checked) => updateField("narcotic_drug", checked)}
                    />
                    <Label htmlFor="narcotic_drug" className="text-xs">
                      Narcotic Drug
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="psychotropic_substance"
                      checked={formData.psychotropic_substance || false}
                      onCheckedChange={(checked) => updateField("psychotropic_substance", checked)}
                    />
                    <Label htmlFor="psychotropic_substance" className="text-xs">
                      Psychotropic
                    </Label>
                  </div>
                  <FormField label="Regulatory Status">
                    <Select
                      value={formData.regulatory_status || ""}
                      onValueChange={(value) => updateField("regulatory_status", value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="Registration No">
                    <Input
                      value={formData.registration_no || ""}
                      onChange={(e) => updateField("registration_no", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                </div>
              )}
            </Card>

            {/* Inventory */}
            <Card className="border-slate-200">
              <SectionHeader title="Inventory & Stock" section="inventory" count={8} />
              {expandedSections.inventory && (
                <div className="p-3 grid grid-cols-6 gap-3 text-xs">
                  <FormField label="Min Stock Level">
                    <Input
                      type="number"
                      value={formData.min_stock_level || ""}
                      onChange={(e) => updateField("min_stock_level", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Max Stock Level">
                    <Input
                      type="number"
                      value={formData.max_stock_level || ""}
                      onChange={(e) => updateField("max_stock_level", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Reorder Level">
                    <Input
                      type="number"
                      value={formData.reorder_level || ""}
                      onChange={(e) => updateField("reorder_level", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Reorder Qty">
                    <Input
                      type="number"
                      value={formData.reorder_qty || ""}
                      onChange={(e) => updateField("reorder_qty", e.target.value)}
                      className="h-8 text-xs"
                    />
                  </FormField>
                  <FormField label="Default Warehouse">
                    <Select
                      value={formData.default_warehouse || ""}
                      onValueChange={(value) => updateField("default_warehouse", value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">Main Warehouse</SelectItem>
                        <SelectItem value="raw_material">Raw Material Store</SelectItem>
                        <SelectItem value="finished_goods">Finished Goods</SelectItem>
                        <SelectItem value="quarantine">Quarantine</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="maintain_stock"
                      checked={formData.maintain_stock || false}
                      onCheckedChange={(checked) => updateField("maintain_stock", checked)}
                    />
                    <Label htmlFor="maintain_stock" className="text-xs">
                      Maintain Stock
                    </Label>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </form>
      </div>
    </div>
  )
}
