"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Search, Edit, Copy, FileText, Beaker, Package, Settings } from "lucide-react"

export default function ProductFormulaMasters() {
  const [activeView, setActiveView] = useState("list")
  const [selectedMaster, setSelectedMaster] = useState("product")

  const productMasters = [
    { id: "P001", name: "Paracetamol 500mg Tablet", category: "Analgesic", status: "Active", formulations: 3, boms: 2 },
    {
      id: "P002",
      name: "Amoxicillin 250mg Capsule",
      category: "Antibiotic",
      status: "Active",
      formulations: 2,
      boms: 1,
    },
    {
      id: "P003",
      name: "Vitamin C 1000mg Effervescent",
      category: "Vitamin",
      status: "Under Review",
      formulations: 1,
      boms: 1,
    },
  ]

  const formulaHeaders = [
    {
      id: "F001",
      productId: "P001",
      version: "1.2",
      status: "Approved",
      strength: "500mg",
      yield: "95.2%",
      batchSize: "10000",
    },
    {
      id: "F002",
      productId: "P001",
      version: "1.1",
      status: "Superseded",
      strength: "500mg",
      yield: "94.8%",
      batchSize: "10000",
    },
    {
      id: "F003",
      productId: "P002",
      version: "2.0",
      status: "Approved",
      strength: "250mg",
      yield: "96.1%",
      batchSize: "5000",
    },
  ]

  const renderProductMasterForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-3">
        <div>
          <Label className="text-xs font-medium">Product Code*</Label>
          <Input className="h-8 text-sm" placeholder="P001" />
        </div>
        <div className="col-span-2">
          <Label className="text-xs font-medium">Product Name*</Label>
          <Input className="h-8 text-sm" placeholder="Paracetamol 500mg Tablet" />
        </div>
        <div>
          <Label className="text-xs font-medium">Category*</Label>
          <Select>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="analgesic">Analgesic</SelectItem>
              <SelectItem value="antibiotic">Antibiotic</SelectItem>
              <SelectItem value="vitamin">Vitamin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium">Therapeutic Class</Label>
          <Input className="h-8 text-sm" placeholder="Pain Relief" />
        </div>
        <div>
          <Label className="text-xs font-medium">Status</Label>
          <Select>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3">
        <div>
          <Label className="text-xs font-medium">Dosage Form*</Label>
          <Select>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="capsule">Capsule</SelectItem>
              <SelectItem value="liquid">Liquid</SelectItem>
              <SelectItem value="sachet">Sachet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium">Strength</Label>
          <Input className="h-8 text-sm" placeholder="500mg" />
        </div>
        <div>
          <Label className="text-xs font-medium">Pack Size</Label>
          <Input className="h-8 text-sm" placeholder="10" />
        </div>
        <div>
          <Label className="text-xs font-medium">Pack Type</Label>
          <Input className="h-8 text-sm" placeholder="Blister" />
        </div>
        <div>
          <Label className="text-xs font-medium">Shelf Life (Months)</Label>
          <Input className="h-8 text-sm" placeholder="36" />
        </div>
        <div>
          <Label className="text-xs font-medium">Storage Condition</Label>
          <Input className="h-8 text-sm" placeholder="Room Temperature" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <Label className="text-xs font-medium">Regulatory Status</Label>
          <Select>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium">License Number</Label>
          <Input className="h-8 text-sm" placeholder="LIC001" />
        </div>
        <div>
          <Label className="text-xs font-medium">NDC Number</Label>
          <Input className="h-8 text-sm" placeholder="12345-678-90" />
        </div>
        <div>
          <Label className="text-xs font-medium">DEA Schedule</Label>
          <Select>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="ci">CI</SelectItem>
              <SelectItem value="cii">CII</SelectItem>
              <SelectItem value="ciii">CIII</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="col-span-6">
        <Label className="text-xs font-medium">Product Description</Label>
        <Textarea className="text-sm resize-none" rows={2} placeholder="Detailed product description..." />
      </div>
    </div>
  )

  const renderFormulaHeaderForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-3">
        <div>
          <Label className="text-xs font-medium">Formula ID*</Label>
          <Input className="h-8 text-sm" placeholder="F001" />
        </div>
        <div>
          <Label className="text-xs font-medium">Product Code*</Label>
          <Select>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="P001">P001 - Paracetamol 500mg</SelectItem>
              <SelectItem value="P002">P002 - Amoxicillin 250mg</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium">Version*</Label>
          <Input className="h-8 text-sm" placeholder="1.2" />
        </div>
        <div>
          <Label className="text-xs font-medium">Status</Label>
          <Select>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Draft" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="superseded">Superseded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium">Batch Size (Units)</Label>
          <Input className="h-8 text-sm" placeholder="10000" />
        </div>
        <div>
          <Label className="text-xs font-medium">Expected Yield %</Label>
          <Input className="h-8 text-sm" placeholder="95.2" />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3">
        <div>
          <Label className="text-xs font-medium">Manufacturing Method</Label>
          <Select>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wet-granulation">Wet Granulation</SelectItem>
              <SelectItem value="dry-granulation">Dry Granulation</SelectItem>
              <SelectItem value="direct-compression">Direct Compression</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium">Processing Time (Hours)</Label>
          <Input className="h-8 text-sm" placeholder="8.5" />
        </div>
        <div>
          <Label className="text-xs font-medium">Temperature Range</Label>
          <Input className="h-8 text-sm" placeholder="20-25°C" />
        </div>
        <div>
          <Label className="text-xs font-medium">Humidity Range</Label>
          <Input className="h-8 text-sm" placeholder="45-65%" />
        </div>
        <div>
          <Label className="text-xs font-medium">pH Range</Label>
          <Input className="h-8 text-sm" placeholder="6.0-7.0" />
        </div>
        <div>
          <Label className="text-xs font-medium">Approved By</Label>
          <Input className="h-8 text-sm" placeholder="QA Manager" />
        </div>
      </div>

      <div className="col-span-6">
        <Label className="text-xs font-medium">Manufacturing Instructions</Label>
        <Textarea className="text-sm resize-none" rows={3} placeholder="Detailed manufacturing instructions..." />
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Product & Formula Masters</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedMaster === "product" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMaster("product")}
              className="h-8"
            >
              <Package className="w-4 h-4 mr-1" />
              Product Master
            </Button>
            <Button
              variant={selectedMaster === "formula" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMaster("formula")}
              className="h-8"
            >
              <Beaker className="w-4 h-4 mr-1" />
              Formula Header
            </Button>
            <Button
              variant={selectedMaster === "bom" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMaster("bom")}
              className="h-8"
            >
              <FileText className="w-4 h-4 mr-1" />
              Bill of Materials
            </Button>
            <Button
              variant={selectedMaster === "routing" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMaster("routing")}
              className="h-8"
            >
              <Settings className="w-4 h-4 mr-1" />
              Routing Master
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 h-8 w-64 text-sm" placeholder="Search products, formulas..." />
          </div>
          <Button size="sm" className="h-8">
            <Plus className="w-4 h-4 mr-1" />
            New{" "}
            {selectedMaster === "product"
              ? "Product"
              : selectedMaster === "formula"
                ? "Formula"
                : selectedMaster === "bom"
                  ? "BOM"
                  : "Routing"}
          </Button>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="form">Form View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          {selectedMaster === "product" && (
            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-xs font-medium border-b">
                <div className="col-span-1">Code</div>
                <div className="col-span-3">Product Name</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Formulations</div>
                <div className="col-span-1">BOMs</div>
                <div className="col-span-2">Last Modified</div>
                <div className="col-span-1">Actions</div>
              </div>
              {productMasters.map((product) => (
                <div key={product.id} className="grid grid-cols-12 gap-2 p-3 text-sm border-b hover:bg-muted/30">
                  <div className="col-span-1 font-mono">{product.id}</div>
                  <div className="col-span-3 font-medium">{product.name}</div>
                  <div className="col-span-2">{product.category}</div>
                  <div className="col-span-1">
                    <Badge variant={product.status === "Active" ? "default" : "secondary"} className="text-xs">
                      {product.status}
                    </Badge>
                  </div>
                  <div className="col-span-1 text-center">{product.formulations}</div>
                  <div className="col-span-1 text-center">{product.boms}</div>
                  <div className="col-span-2 text-muted-foreground">2024-01-15 14:30</div>
                  <div className="col-span-1 flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedMaster === "formula" && (
            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-xs font-medium border-b">
                <div className="col-span-1">Formula ID</div>
                <div className="col-span-1">Product</div>
                <div className="col-span-1">Version</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Strength</div>
                <div className="col-span-1">Yield %</div>
                <div className="col-span-2">Batch Size</div>
                <div className="col-span-2">Approved Date</div>
                <div className="col-span-1">Approved By</div>
                <div className="col-span-1">Actions</div>
              </div>
              {formulaHeaders.map((formula) => (
                <div key={formula.id} className="grid grid-cols-12 gap-2 p-3 text-sm border-b hover:bg-muted/30">
                  <div className="col-span-1 font-mono">{formula.id}</div>
                  <div className="col-span-1 font-mono">{formula.productId}</div>
                  <div className="col-span-1">{formula.version}</div>
                  <div className="col-span-1">
                    <Badge variant={formula.status === "Approved" ? "default" : "secondary"} className="text-xs">
                      {formula.status}
                    </Badge>
                  </div>
                  <div className="col-span-1">{formula.strength}</div>
                  <div className="col-span-1">{formula.yield}</div>
                  <div className="col-span-2">{formula.batchSize} units</div>
                  <div className="col-span-2 text-muted-foreground">2024-01-10 09:15</div>
                  <div className="col-span-1 text-muted-foreground">QA Manager</div>
                  <div className="col-span-1 flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="form" className="mt-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                {selectedMaster === "product" ? "Product Master" : "Formula Header"} - New Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMaster === "product" ? renderProductMasterForm() : renderFormulaHeaderForm()}
              <Separator className="my-4" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button variant="outline" size="sm">
                  Save Draft
                </Button>
                <Button size="sm">Save & Approve</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
