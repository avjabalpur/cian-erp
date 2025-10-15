"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, MapPin, Factory, Warehouse, Wrench, Gauge, FlaskConical } from "lucide-react"

export default function LocationEquipmentMasters() {
  const [activeForm, setActiveForm] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Sample data for different master types
  const plantMasters = [
    {
      id: "PLT001",
      name: "Main Manufacturing Plant",
      location: "Mumbai",
      capacity: "50000 units/day",
      status: "Active",
      manager: "Dr. Sharma",
      established: "2015",
    },
    {
      id: "PLT002",
      name: "Secondary Plant",
      location: "Pune",
      capacity: "25000 units/day",
      status: "Active",
      manager: "Mr. Patel",
      established: "2018",
    },
    {
      id: "PLT003",
      name: "R&D Facility",
      location: "Bangalore",
      capacity: "Research Only",
      status: "Active",
      manager: "Dr. Kumar",
      established: "2020",
    },
  ]

  const warehouseMasters = [
    {
      id: "WH001",
      name: "Raw Material Warehouse",
      plant: "PLT001",
      capacity: "10000 sqft",
      temperature: "15-25°C",
      humidity: "45-65%",
      status: "Active",
    },
    {
      id: "WH002",
      name: "Finished Goods Warehouse",
      plant: "PLT001",
      capacity: "15000 sqft",
      temperature: "20-25°C",
      humidity: "40-60%",
      status: "Active",
    },
    {
      id: "WH003",
      name: "Cold Storage",
      plant: "PLT002",
      capacity: "5000 sqft",
      temperature: "2-8°C",
      humidity: "50-70%",
      status: "Active",
    },
  ]

  const equipmentMasters = [
    {
      id: "EQ001",
      name: "Tablet Press Machine",
      type: "Production",
      plant: "PLT001",
      line: "LINE001",
      capacity: "100000 tabs/hr",
      status: "Operational",
      lastMaintenance: "2024-01-15",
    },
    {
      id: "EQ002",
      name: "Capsule Filling Machine",
      type: "Production",
      plant: "PLT001",
      line: "LINE002",
      capacity: "50000 caps/hr",
      status: "Operational",
      lastMaintenance: "2024-01-10",
    },
    {
      id: "EQ003",
      name: "Liquid Filling Line",
      type: "Production",
      plant: "PLT002",
      line: "LINE003",
      capacity: "2000 bottles/hr",
      status: "Maintenance",
      lastMaintenance: "2024-01-20",
    },
  ]

  const lineMasters = [
    {
      id: "LINE001",
      name: "Tablet Production Line A",
      plant: "PLT001",
      products: "Tablets, Coated Tablets",
      capacity: "100000 units/day",
      status: "Running",
      efficiency: "95%",
    },
    {
      id: "LINE002",
      name: "Capsule Production Line",
      plant: "PLT001",
      products: "Hard Capsules, Soft Capsules",
      capacity: "50000 units/day",
      status: "Running",
      efficiency: "92%",
    },
    {
      id: "LINE003",
      name: "Liquid Production Line",
      plant: "PLT002",
      products: "Syrups, Suspensions",
      capacity: "2000 bottles/day",
      status: "Stopped",
      efficiency: "0%",
    },
  ]

  const vesselMasters = [
    {
      id: "VSL001",
      name: "Mixing Tank A",
      capacity: "5000L",
      material: "SS316L",
      plant: "PLT001",
      line: "LINE001",
      status: "Available",
      lastCleaned: "2024-01-22",
    },
    {
      id: "VSL002",
      name: "Reactor Vessel B",
      capacity: "3000L",
      material: "SS316L",
      plant: "PLT001",
      line: "LINE002",
      status: "In Use",
      lastCleaned: "2024-01-20",
    },
    {
      id: "VSL003",
      name: "Storage Tank C",
      capacity: "10000L",
      material: "SS304",
      plant: "PLT002",
      line: "LINE003",
      status: "Cleaning",
      lastCleaned: "2024-01-23",
    },
  ]

  const instrumentMasters = [
    {
      id: "INST001",
      name: "Temperature Sensor TS-001",
      type: "Temperature",
      location: "VSL001",
      range: "-50 to 200°C",
      accuracy: "±0.1°C",
      status: "Active",
      lastCalibration: "2024-01-15",
    },
    {
      id: "INST002",
      name: "Pressure Gauge PG-002",
      type: "Pressure",
      location: "VSL002",
      range: "0-10 bar",
      accuracy: "±0.05 bar",
      status: "Active",
      lastCalibration: "2024-01-10",
    },
    {
      id: "INST003",
      name: "pH Meter PH-003",
      type: "pH",
      location: "VSL003",
      range: "0-14 pH",
      accuracy: "±0.01 pH",
      status: "Calibration Due",
      lastCalibration: "2023-12-15",
    },
  ]

  const renderMasterTable = (data: any[], type: string, icon: any) => {
    const filteredData = data.filter((item) =>
      Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-lg font-semibold">{type}</h3>
            <Badge variant="secondary">{filteredData.length} records</Badge>
          </div>
          <Button onClick={() => setActiveForm(type)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New {type.split(" ")[0]}
          </Button>
        </div>

        <div className="grid gap-2 text-xs">
          <div className="grid grid-cols-12 gap-2 font-medium text-muted-foreground bg-muted/50 p-2 rounded">
            {Object.keys(data[0] || {}).map((key, index) => (
              <div key={key} className={index === 0 ? "col-span-1" : index === 1 ? "col-span-2" : "col-span-1"}>
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </div>
            ))}
            <div className="col-span-1">Actions</div>
          </div>

          {filteredData.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 p-2 border rounded hover:bg-muted/30">
              {Object.entries(item).map(([key, value], colIndex) => (
                <div
                  key={key}
                  className={
                    colIndex === 0 ? "col-span-1 font-mono" : colIndex === 1 ? "col-span-2 font-medium" : "col-span-1"
                  }
                >
                  {key === "status" ? (
                    <Badge
                      variant={
                        value === "Active" || value === "Operational" || value === "Running" || value === "Available"
                          ? "default"
                          : value === "Maintenance" || value === "Stopped" || value === "Cleaning"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {value as string}
                    </Badge>
                  ) : (
                    <span className="truncate block">{value as string}</span>
                  )}
                </div>
              ))}
              <div className="col-span-1 flex gap-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderForm = (type: string) => {
    const forms = {
      "Plant Masters": (
        <div className="grid grid-cols-6 gap-3 text-sm">
          <div className="space-y-1">
            <Label className="text-xs">Plant ID</Label>
            <Input placeholder="PLT001" className="h-8" />
          </div>
          <div className="space-y-1 col-span-2">
            <Label className="text-xs">Plant Name</Label>
            <Input placeholder="Manufacturing Plant Name" className="h-8" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Location</Label>
            <Input placeholder="City" className="h-8" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Capacity</Label>
            <Input placeholder="50000 units/day" className="h-8" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Status</Label>
            <Select>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Plant Manager</Label>
            <Input placeholder="Manager Name" className="h-8" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Established Year</Label>
            <Input placeholder="2015" className="h-8" />
          </div>
          <div className="space-y-1 col-span-2">
            <Label className="text-xs">Address</Label>
            <Input placeholder="Complete Address" className="h-8" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Phone</Label>
            <Input placeholder="+91-XXXXXXXXXX" className="h-8" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">License Number</Label>
            <Input placeholder="MFG/LICENSE/001" className="h-8" />
          </div>
        </div>
      ),
      "Equipment Masters": (
        <div className="grid grid-cols-6 gap-3 text-sm">
          <div className="space-y-1">
            <Label className="text-xs">Equipment ID</Label>
            <Input placeholder="EQ001" className="h-8" />
          </div>
          <div className="space-y-1 col-span-2">
            <Label className="text-xs">Equipment Name</Label>
            <Input placeholder="Machine Name" className="h-8" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Type</Label>
            <Select>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="packaging">Packaging</SelectItem>
                <SelectItem value="utility">Utility</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Plant</Label>
            <Select>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Plant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLT001">PLT001 - Main Plant</SelectItem>
                <SelectItem value="PLT002">PLT002 - Secondary Plant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Production Line</Label>
            <Select>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Line" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LINE001">LINE001</SelectItem>
                <SelectItem value="LINE002">LINE002</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Capacity</Label>
            <Input placeholder="100000 units/hr" className="h-8" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Manufacturer</Label>
            <Input placeholder="Equipment Manufacturer" className="h-8" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Model</Label>
            <Input placeholder="Model Number" className="h-8" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Serial Number</Label>
            <Input placeholder="Serial Number" className="h-8" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Installation Date</Label>
            <Input type="date" className="h-8" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Last Maintenance</Label>
            <Input type="date" className="h-8" />
          </div>
        </div>
      ),
    }

    return forms[type as keyof typeof forms] || <div>Form for {type}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Location & Equipment Masters</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search across all masters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
      </div>

      {activeForm && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">New {activeForm}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setActiveForm(null)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {renderForm(activeForm)}
            <div className="flex gap-2 mt-4">
              <Button size="sm">Save</Button>
              <Button variant="outline" size="sm">
                Save & New
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="plants" className="w-full">
        <TabsList className="grid w-full grid-cols-6 max-w-3xl">
          <TabsTrigger value="plants">Plant Masters</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouse Masters</TabsTrigger>
          <TabsTrigger value="equipment">Equipment Masters</TabsTrigger>
          <TabsTrigger value="lines">Line Masters</TabsTrigger>
          <TabsTrigger value="vessels">Vessel Masters</TabsTrigger>
          <TabsTrigger value="instruments">Instrument Masters</TabsTrigger>
        </TabsList>

        <TabsContent value="plants" className="mt-6">
          {renderMasterTable(plantMasters, "Plant Masters", <Factory className="h-5 w-5 text-blue-600" />)}
        </TabsContent>

        <TabsContent value="warehouses" className="mt-6">
          {renderMasterTable(warehouseMasters, "Warehouse Masters", <Warehouse className="h-5 w-5 text-green-600" />)}
        </TabsContent>

        <TabsContent value="equipment" className="mt-6">
          {renderMasterTable(equipmentMasters, "Equipment Masters", <Wrench className="h-5 w-5 text-orange-600" />)}
        </TabsContent>

        <TabsContent value="lines" className="mt-6">
          {renderMasterTable(lineMasters, "Line Masters", <MapPin className="h-5 w-5 text-purple-600" />)}
        </TabsContent>

        <TabsContent value="vessels" className="mt-6">
          {renderMasterTable(vesselMasters, "Vessel Masters", <FlaskConical className="h-5 w-5 text-cyan-600" />)}
        </TabsContent>

        <TabsContent value="instruments" className="mt-6">
          {renderMasterTable(instrumentMasters, "Instrument Masters", <Gauge className="h-5 w-5 text-red-600" />)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
