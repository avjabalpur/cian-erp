"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus, Edit, Eye, Download, Upload } from "lucide-react"
import { DenseItemForm } from "./dense-item-form"

interface ItemMaster {
  id: number
  item_code: string
  item_name: string
  short_name: string
  item_type_id: number
  product_type: string
  active: boolean
  qc_required: boolean
  manufactured: boolean
  bought_out: boolean
  sold: boolean
  key_product: boolean
  // ... all 54 fields would be here
}

const sampleItems: ItemMaster[] = [
  {
    id: 1,
    item_code: "API-001",
    item_name: "Paracetamol API 500mg",
    short_name: "PCM-500",
    item_type_id: 1,
    product_type: "Active Ingredient",
    active: true,
    qc_required: true,
    manufactured: false,
    bought_out: true,
    sold: false,
    key_product: true,
  },
  {
    id: 2,
    item_code: "CAP-002",
    item_name: "Paracetamol Capsules 500mg",
    short_name: "PCM-CAP-500",
    item_type_id: 2,
    product_type: "Finished Product",
    active: true,
    qc_required: true,
    manufactured: true,
    bought_out: false,
    sold: true,
    key_product: true,
  },
  {
    id: 3,
    item_code: "EXC-003",
    item_name: "Microcrystalline Cellulose",
    short_name: "MCC",
    item_type_id: 3,
    product_type: "Excipient",
    active: true,
    qc_required: true,
    manufactured: false,
    bought_out: true,
    sold: false,
    key_product: false,
  },
]

export default function AdvancedItemMaster() {
  const [selectedItem, setSelectedItem] = useState<ItemMaster | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "detail" | "form">("list")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<ItemMaster | null>(null)

  const filteredItems = sampleItems.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item_code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddNew = () => {
    setEditingItem(null)
    setShowForm(true)
  }

  const handleEdit = (item: ItemMaster) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleSaveItem = (itemData: any) => {
    console.log("Saving item:", itemData)
    setShowForm(false)
    setEditingItem(null)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  const ItemDetailView = ({ item }: { item: ItemMaster }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{item.item_name}</h2>
          <p className="text-sm text-gray-600">{item.item_code}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="sales">Sales & Distribution</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Item Identification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Item Code:</span> {item.item_code}
                </div>
                <div>
                  <span className="font-medium">Rev No:</span> R001
                </div>
                <div>
                  <span className="font-medium">Item Type ID:</span> {item.item_type_id}
                </div>
                <div>
                  <span className="font-medium">Sub Type:</span> 1
                </div>
                <div>
                  <span className="font-medium">GS Indicator:</span> Y
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Item Name:</span> {item.item_name}
                </div>
                <div>
                  <span className="font-medium">Short Name:</span> {item.short_name}
                </div>
                <div>
                  <span className="font-medium">Pharmacopoeia Name:</span> Paracetamolum
                </div>
                <div>
                  <span className="font-medium">Product Type:</span> {item.product_type}
                </div>
                <div>
                  <span className="font-medium">Goods Type:</span> Material
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Units & Measurements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Unit of Measure:</span> KG
                </div>
                <div>
                  <span className="font-medium">Issuing Unit:</span> GM
                </div>
                <div>
                  <span className="font-medium">UOM Conv Factor:</span> 1000
                </div>
                <div>
                  <span className="font-medium">UQC Conv Factor:</span> 1.0
                </div>
                <div>
                  <span className="font-medium">Desired Pack Size:</span> 25
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manufacturing" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Manufacturing Flags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={item.manufactured} />
                  <label className="text-sm">Manufactured</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={item.bought_out} />
                  <label className="text-sm">Bought Out</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={false} />
                  <label className="text-sm">Job Work</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={false} />
                  <label className="text-sm">Imported</label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Production Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Main Prod Centre:</span> Plant A
                </div>
                <div>
                  <span className="font-medium">Lead Time (Days):</span> 15
                </div>
                <div>
                  <span className="font-medium">Economic Order Qty:</span> 1000
                </div>
                <div>
                  <span className="font-medium">Std Mfg Fees/Unit:</span> ₹12.50
                </div>
                <div>
                  <span className="font-medium">Current Buyer:</span> John Smith
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quality Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={item.qc_required} />
                  <label className="text-sm">QC Required</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={false} />
                  <label className="text-sm">Allergen</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={true} />
                  <label className="text-sm">Active Ingredient</label>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Std Assay Strength:</span> 99.5%
                </div>
                <div className="text-sm">
                  <span className="font-medium">Std Loss on Dry:</span> 0.5%
                </div>
                <div className="text-sm">
                  <span className="font-medium">Allowed Allergen %:</span> 0.01%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Shelf Life & Storage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Shelf Life (Months):</span> 36
                </div>
                <div>
                  <span className="font-medium">Shelf Life (Days):</span> 1095
                </div>
                <div>
                  <span className="font-medium">Safety Stock:</span> 500
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox checked={true} />
                  <label className="text-sm">Mfg Date Applicable</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={true} />
                  <label className="text-sm">Expiry Date Applicable</label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Sales Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={item.sold} />
                  <label className="text-sm">Sold</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={item.key_product} />
                  <label className="text-sm">Key Product</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={false} />
                  <label className="text-sm">Exported</label>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Sales Division:</span> Pharma
                </div>
                <div className="text-sm">
                  <span className="font-medium">Product Group:</span> APIs
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pricing & Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Std Rate:</span> ₹850.00
                </div>
                <div>
                  <span className="font-medium">Conversion Factor:</span> 1.0
                </div>
                <div>
                  <span className="font-medium">Freight On:</span> Destination
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox checked={true} />
                  <label className="text-sm">Tax Credit Applicable</label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regulatory" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Regulatory Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={false} />
                  <label className="text-sm">Batch Not Applicable</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={false} />
                  <label className="text-sm">Track Serial Numbers</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={true} />
                  <label className="text-sm">Mfg Location Name Required</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={true} />
                  <label className="text-sm">Principal for Statutory Reporting</label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Documentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Drawing Reference:</span> DRG-API-001
                </div>
                <div>
                  <span className="font-medium">Vendor Part No:</span> VP-PCM-500
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox checked={true} />
                  <label className="text-sm">Mfg MM/YYYY Applicable</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={true} />
                  <label className="text-sm">Expiry MM/YYYY Applicable</label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Standard Rate:</span> ₹850.00
                </div>
                <div>
                  <span className="font-medium">Std Mfg Fees/Unit:</span> ₹12.50
                </div>
                <div>
                  <span className="font-medium">Economic Order Qty:</span> 1000
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox checked={true} />
                  <label className="text-sm">Tax Credit Applicable</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={false} />
                  <label className="text-sm">Packing/Freight/Insurance Services</label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  if (showForm) {
    return <DenseItemForm item={editingItem} onSave={handleSaveItem} onCancel={handleCancelForm} />
  }

  if (viewMode === "detail" && selectedItem) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode("list")}>
            ← Back to List
          </Button>
          <h1 className="text-lg font-semibold">Item Master Details</h1>
        </div>
        <ItemDetailView item={selectedItem} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Item Master (54 Fields)</h1>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-1" />
            New Item
          </Button>
          <Button size="sm" variant="outline">
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by item code, name, or any field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Item Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="api">Active Ingredient</SelectItem>
            <SelectItem value="finished">Finished Product</SelectItem>
            <SelectItem value="excipient">Excipient</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-1" />
          More Filters
        </Button>
      </div>

      <div className="space-y-2">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                  <div>
                    <div className="font-medium text-sm">{item.item_code}</div>
                    <div className="text-xs text-gray-500">ID: {item.id}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.item_name}</div>
                    <div className="text-xs text-gray-500">{item.short_name}</div>
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {item.product_type}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {item.manufactured && <Badge className="text-xs bg-blue-100 text-blue-800">MFG</Badge>}
                    {item.bought_out && <Badge className="text-xs bg-green-100 text-green-800">BO</Badge>}
                    {item.sold && <Badge className="text-xs bg-purple-100 text-purple-800">SOLD</Badge>}
                    {item.qc_required && <Badge className="text-xs bg-orange-100 text-orange-800">QC</Badge>}
                  </div>
                  <div className="text-right">
                    {item.key_product && <Badge className="text-xs bg-yellow-100 text-yellow-800">KEY</Badge>}
                  </div>
                  <div className="flex gap-1 justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedItem(item)
                        setViewMode("detail")
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-sm text-gray-500 text-center py-4">
        Showing {filteredItems.length} items • Click any item to view all 54 fields in organized tabs
      </div>
    </div>
  )
}
