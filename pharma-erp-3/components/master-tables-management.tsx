"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Edit,
  Eye,
  Trash2,
  Filter,
  Download,
  Upload,
  Building,
  Users,
  MapPin,
  Banknote,
  Settings,
} from "lucide-react"

interface MasterRecord {
  id: string
  code: string
  name: string
  status: string
  createdDate: string
  lastModified: string
  [key: string]: any
}

const masterTableConfigs = {
  warehouse: {
    title: "Warehouse Master",
    icon: Building,
    fields: [
      { key: "code", label: "Warehouse Code", type: "text", required: true },
      { key: "name", label: "Warehouse Name", type: "text", required: true },
      {
        key: "type",
        label: "Type",
        type: "select",
        options: ["Raw Material", "Finished Goods", "Quarantine", "Transit"],
      },
      { key: "location", label: "Location", type: "text" },
      { key: "address", label: "Address", type: "textarea" },
      { key: "city", label: "City", type: "text" },
      { key: "state", label: "State", type: "text" },
      { key: "country", label: "Country", type: "select", options: ["USA", "India", "Germany", "UK"] },
      { key: "postalCode", label: "Postal Code", type: "text" },
      { key: "manager", label: "Manager", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "email", label: "Email", type: "email" },
      { key: "capacity", label: "Capacity (sq ft)", type: "number" },
      { key: "temperatureControlled", label: "Temperature Controlled", type: "checkbox" },
      { key: "minTemp", label: "Min Temperature (°C)", type: "number" },
      { key: "maxTemp", label: "Max Temperature (°C)", type: "number" },
      { key: "humidityControlled", label: "Humidity Controlled", type: "checkbox" },
      { key: "gmpCertified", label: "GMP Certified", type: "checkbox" },
      { key: "certificationNo", label: "Certification No", type: "text" },
      { key: "certificationExpiry", label: "Certification Expiry", type: "date" },
      { key: "insurancePolicy", label: "Insurance Policy", type: "text" },
      { key: "insuranceExpiry", label: "Insurance Expiry", type: "date" },
      { key: "costCenter", label: "Cost Center", type: "text" },
      { key: "glAccount", label: "GL Account", type: "text" },
    ],
    mockData: [
      {
        id: "1",
        code: "WH-RM-01",
        name: "Raw Materials Warehouse A",
        type: "Raw Material",
        location: "Building A, Floor 1",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        manager: "Rajesh Kumar",
        capacity: 50000,
        temperatureControlled: true,
        gmpCertified: true,
        status: "Active",
        createdDate: "2024-01-01",
        lastModified: "2024-01-15",
      },
      {
        id: "2",
        code: "WH-FG-01",
        name: "Finished Goods Warehouse",
        type: "Finished Goods",
        location: "Building B, Floor 2",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        manager: "Priya Sharma",
        capacity: 75000,
        temperatureControlled: true,
        gmpCertified: true,
        status: "Active",
        createdDate: "2024-01-01",
        lastModified: "2024-01-10",
      },
    ],
  },
  customer: {
    title: "Customer Master",
    icon: Users,
    fields: [
      { key: "code", label: "Customer Code", type: "text", required: true },
      { key: "name", label: "Customer Name", type: "text", required: true },
      {
        key: "type",
        label: "Customer Type",
        type: "select",
        options: ["Hospital", "Distributor", "Retailer", "Government", "Export"],
      },
      { key: "category", label: "Category", type: "select", options: ["A", "B", "C"] },
      { key: "registrationNo", label: "Registration No", type: "text" },
      { key: "taxId", label: "Tax ID", type: "text" },
      { key: "licenseNo", label: "License No", type: "text" },
      { key: "licenseExpiry", label: "License Expiry", type: "date" },
      { key: "contactPerson", label: "Contact Person", type: "text" },
      { key: "designation", label: "Designation", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "mobile", label: "Mobile", type: "text" },
      { key: "email", label: "Email", type: "email" },
      { key: "website", label: "Website", type: "text" },
      { key: "address", label: "Address", type: "textarea" },
      { key: "city", label: "City", type: "text" },
      { key: "state", label: "State", type: "text" },
      { key: "country", label: "Country", type: "select", options: ["USA", "India", "Germany", "UK"] },
      { key: "postalCode", label: "Postal Code", type: "text" },
      { key: "paymentTerms", label: "Payment Terms", type: "select", options: ["Net 15", "Net 30", "Net 45", "COD"] },
      { key: "creditLimit", label: "Credit Limit", type: "number" },
      { key: "currency", label: "Currency", type: "select", options: ["USD", "EUR", "INR", "GBP"] },
      {
        key: "priceList",
        label: "Price List",
        type: "select",
        options: ["Standard", "Hospital", "Government", "Export"],
      },
      { key: "salesRep", label: "Sales Representative", type: "text" },
      { key: "territory", label: "Territory", type: "text" },
      { key: "establishedYear", label: "Established Year", type: "number" },
      { key: "annualTurnover", label: "Annual Turnover", type: "number" },
      { key: "bankName", label: "Bank Name", type: "text" },
      { key: "bankAccount", label: "Bank Account", type: "text" },
      { key: "routingNumber", label: "Routing Number", type: "text" },
    ],
    mockData: [
      {
        id: "1",
        code: "CUST-001",
        name: "Apollo Hospitals Enterprise Ltd",
        type: "Hospital",
        category: "A",
        contactPerson: "Dr. Suresh Reddy",
        phone: "+91-40-23607777",
        email: "procurement@apollohospitals.com",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        paymentTerms: "Net 30",
        creditLimit: 5000000,
        currency: "INR",
        status: "Active",
        createdDate: "2024-01-01",
        lastModified: "2024-01-12",
      },
      {
        id: "2",
        code: "CUST-002",
        name: "Max Healthcare Institute Ltd",
        type: "Hospital",
        category: "A",
        contactPerson: "Mr. Amit Gupta",
        phone: "+91-11-26692251",
        email: "purchase@maxhealthcare.com",
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        paymentTerms: "Net 45",
        creditLimit: 3000000,
        currency: "INR",
        status: "Active",
        createdDate: "2024-01-02",
        lastModified: "2024-01-14",
      },
    ],
  },
  vendor: {
    title: "Vendor Master",
    icon: Users,
    fields: [
      { key: "code", label: "Vendor Code", type: "text", required: true },
      { key: "name", label: "Vendor Name", type: "text", required: true },
      {
        key: "type",
        label: "Vendor Type",
        type: "select",
        options: ["API Supplier", "Excipient Supplier", "Packaging Material", "Equipment", "Service Provider"],
      },
      {
        key: "category",
        label: "Category",
        type: "select",
        options: ["Approved", "Qualified", "Under Evaluation", "Blacklisted"],
      },
      { key: "gmpStatus", label: "GMP Status", type: "select", options: ["GMP Certified", "GMP Pending", "Non-GMP"] },
      {
        key: "regulatoryApproval",
        label: "Regulatory Approval",
        type: "select",
        options: ["FDA", "EMA", "CDSCO", "WHO-GMP"],
      },
      { key: "qualificationDate", label: "Qualification Date", type: "date" },
      { key: "requalificationDue", label: "Requalification Due", type: "date" },
      { key: "contactPerson", label: "Contact Person", type: "text" },
      { key: "designation", label: "Designation", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "mobile", label: "Mobile", type: "text" },
      { key: "email", label: "Email", type: "email" },
      { key: "website", label: "Website", type: "text" },
      { key: "address", label: "Address", type: "textarea" },
      { key: "city", label: "City", type: "text" },
      { key: "state", label: "State", type: "text" },
      { key: "country", label: "Country", type: "select", options: ["USA", "India", "Germany", "UK", "China"] },
      { key: "postalCode", label: "Postal Code", type: "text" },
      {
        key: "paymentTerms",
        label: "Payment Terms",
        type: "select",
        options: ["Net 15", "Net 30", "Net 45", "Advance"],
      },
      { key: "currency", label: "Currency", type: "select", options: ["USD", "EUR", "INR", "GBP"] },
      { key: "bankName", label: "Bank Name", type: "text" },
      { key: "bankAccount", label: "Bank Account", type: "text" },
      { key: "swiftCode", label: "SWIFT Code", type: "text" },
      { key: "taxId", label: "Tax ID", type: "text" },
      { key: "registrationNo", label: "Registration No", type: "text" },
      { key: "insurancePolicy", label: "Insurance Policy", type: "text" },
      { key: "insuranceExpiry", label: "Insurance Expiry", type: "date" },
    ],
    mockData: [
      {
        id: "1",
        code: "VEND-001",
        name: "Sigma-Aldrich Corporation",
        type: "API Supplier",
        category: "Approved",
        gmpStatus: "GMP Certified",
        regulatoryApproval: "FDA",
        contactPerson: "John Smith",
        phone: "+1-314-771-5765",
        email: "pharma@sigmaaldrich.com",
        city: "St. Louis",
        state: "Missouri",
        country: "USA",
        paymentTerms: "Net 30",
        currency: "USD",
        status: "Active",
        createdDate: "2024-01-01",
        lastModified: "2024-01-08",
      },
    ],
  },
  bank: {
    title: "Bank Master",
    icon: Banknote,
    fields: [
      { key: "code", label: "Bank Code", type: "text", required: true },
      { key: "name", label: "Bank Name", type: "text", required: true },
      { key: "branch", label: "Branch Name", type: "text" },
      { key: "accountNo", label: "Account Number", type: "text" },
      {
        key: "accountType",
        label: "Account Type",
        type: "select",
        options: ["Current", "Savings", "Overdraft", "Term Deposit"],
      },
      { key: "currency", label: "Currency", type: "select", options: ["USD", "EUR", "INR", "GBP"] },
      { key: "swiftCode", label: "SWIFT Code", type: "text" },
      { key: "routingNumber", label: "Routing Number", type: "text" },
      { key: "ibanCode", label: "IBAN Code", type: "text" },
      { key: "contactPerson", label: "Contact Person", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "email", label: "Email", type: "email" },
      { key: "address", label: "Address", type: "textarea" },
      { key: "city", label: "City", type: "text" },
      { key: "state", label: "State", type: "text" },
      { key: "country", label: "Country", type: "select", options: ["USA", "India", "Germany", "UK"] },
      { key: "postalCode", label: "Postal Code", type: "text" },
      { key: "openingBalance", label: "Opening Balance", type: "number" },
      { key: "currentBalance", label: "Current Balance", type: "number" },
      { key: "overdraftLimit", label: "Overdraft Limit", type: "number" },
      { key: "interestRate", label: "Interest Rate (%)", type: "number" },
      { key: "charges", label: "Monthly Charges", type: "number" },
      { key: "glAccount", label: "GL Account", type: "text" },
      { key: "costCenter", label: "Cost Center", type: "text" },
    ],
    mockData: [
      {
        id: "1",
        code: "BANK-001",
        name: "HDFC Bank Ltd",
        branch: "Bandra Kurla Complex",
        accountNo: "50200012345678",
        accountType: "Current",
        currency: "INR",
        swiftCode: "HDFCINBB",
        contactPerson: "Rahul Mehta",
        phone: "+91-22-66316000",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        currentBalance: 15000000,
        status: "Active",
        createdDate: "2024-01-01",
        lastModified: "2024-01-10",
      },
    ],
  },
  location: {
    title: "Location Master",
    icon: MapPin,
    fields: [
      { key: "code", label: "Location Code", type: "text", required: true },
      { key: "name", label: "Location Name", type: "text", required: true },
      {
        key: "type",
        label: "Location Type",
        type: "select",
        options: ["Plant", "Warehouse", "Office", "Laboratory", "R&D Center"],
      },
      { key: "parentLocation", label: "Parent Location", type: "text" },
      { key: "address", label: "Address", type: "textarea" },
      { key: "city", label: "City", type: "text" },
      { key: "state", label: "State", type: "text" },
      { key: "country", label: "Country", type: "select", options: ["USA", "India", "Germany", "UK"] },
      { key: "postalCode", label: "Postal Code", type: "text" },
      { key: "timeZone", label: "Time Zone", type: "select", options: ["UTC", "IST", "EST", "PST", "CET"] },
      { key: "manager", label: "Location Manager", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "email", label: "Email", type: "email" },
      { key: "area", label: "Area (sq ft)", type: "number" },
      { key: "capacity", label: "Capacity", type: "number" },
      { key: "operationalHours", label: "Operational Hours", type: "text" },
      { key: "gmpCertified", label: "GMP Certified", type: "checkbox" },
      { key: "isoCertified", label: "ISO Certified", type: "checkbox" },
      { key: "regulatoryLicense", label: "Regulatory License", type: "text" },
      { key: "licenseExpiry", label: "License Expiry", type: "date" },
      { key: "insurancePolicy", label: "Insurance Policy", type: "text" },
      { key: "insuranceExpiry", label: "Insurance Expiry", type: "date" },
      { key: "costCenter", label: "Cost Center", type: "text" },
      { key: "glAccount", label: "GL Account", type: "text" },
    ],
    mockData: [
      {
        id: "1",
        code: "LOC-001",
        name: "Mumbai Manufacturing Plant",
        type: "Plant",
        address: "Plot No. 123, MIDC Industrial Area",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        manager: "Suresh Patel",
        area: 250000,
        gmpCertified: true,
        isoCertified: true,
        status: "Active",
        createdDate: "2024-01-01",
        lastModified: "2024-01-05",
      },
    ],
  },
}

export default function MasterTablesManagement() {
  const [activeTable, setActiveTable] = useState("warehouse")
  const [activeTab, setActiveTab] = useState("list")
  const [selectedRecord, setSelectedRecord] = useState<MasterRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const currentConfig = masterTableConfigs[activeTable as keyof typeof masterTableConfigs]
  const currentData = currentConfig.mockData

  const filteredData = currentData.filter((record) => {
    const matchesSearch =
      record.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const MasterForm = ({ record, isEdit = false }: { record?: MasterRecord; isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2">
        {currentConfig.fields.map((field) => (
          <div key={field.key} className={field.type === "textarea" ? "col-span-3" : "col-span-1"}>
            <label className="text-xs font-medium text-gray-600">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === "select" ? (
              <Select defaultValue={record?.[field.key]}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === "textarea" ? (
              <textarea
                className="w-full h-16 px-3 py-2 text-sm border rounded-md resize-none"
                defaultValue={record?.[field.key]}
                placeholder={field.label}
              />
            ) : field.type === "checkbox" ? (
              <div className="flex items-center space-x-2 mt-1">
                <input type="checkbox" defaultChecked={record?.[field.key]} className="w-4 h-4" />
                <span className="text-xs">Yes</span>
              </div>
            ) : (
              <Input type={field.type} className="h-8" defaultValue={record?.[field.key]} placeholder={field.label} />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={() => setActiveTab("list")}>
          Cancel
        </Button>
        <Button variant="outline">Save Draft</Button>
        <Button>Save & Activate</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Master Table Selection */}
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(masterTableConfigs).map(([key, config]) => {
          const IconComponent = config.icon
          return (
            <Button
              key={key}
              variant={activeTable === key ? "default" : "outline"}
              className="h-12 flex flex-col gap-1"
              onClick={() => {
                setActiveTable(key)
                setActiveTab("list")
              }}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-xs">{config.title}</span>
            </Button>
          )
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList className="grid w-auto grid-cols-3">
            <TabsTrigger value="list">{currentConfig.title} List</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="edit">Edit Record</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button size="sm" variant="outline">
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
          </div>
        </div>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-6 gap-2 p-3 bg-gray-50 rounded">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" className="h-8" placeholder="From Date" />
            <Input type="date" className="h-8" placeholder="To Date" />
            <Button size="sm" className="h-8">
              <Filter className="w-4 h-4 mr-1" />
              Apply
            </Button>
            <Button size="sm" variant="outline" className="h-8 bg-transparent">
              <Settings className="w-4 h-4 mr-1" />
              Columns
            </Button>
          </div>

          {/* Records Table */}
          <div className="border rounded">
            <div className="grid grid-cols-8 gap-2 p-2 bg-gray-50 text-xs font-medium border-b">
              <div>Code</div>
              <div className="col-span-2">Name</div>
              <div>Type/Category</div>
              <div>Status</div>
              <div>Created Date</div>
              <div>Last Modified</div>
              <div>Actions</div>
            </div>

            {filteredData.map((record) => (
              <div key={record.id} className="grid grid-cols-8 gap-2 p-2 text-xs border-b hover:bg-gray-50">
                <div className="font-medium text-blue-600">{record.code}</div>
                <div className="col-span-2">{record.name}</div>
                <div>{record.type || record.category || "-"}</div>
                <Badge variant={record.status === "Active" ? "default" : "secondary"} className="text-xs">
                  {record.status}
                </Badge>
                <div>{record.createdDate}</div>
                <div>{record.lastModified}</div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => {
                      setSelectedRecord(record)
                      setActiveTab("edit")
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Total Records</div>
                <div className="text-lg font-bold">{filteredData.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Active</div>
                <div className="text-lg font-bold text-green-600">
                  {filteredData.filter((r) => r.status === "Active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Inactive</div>
                <div className="text-lg font-bold text-red-600">
                  {filteredData.filter((r) => r.status === "Inactive").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-600">Pending</div>
                <div className="text-lg font-bold text-orange-600">
                  {filteredData.filter((r) => r.status === "Pending").length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New {currentConfig.title.replace(" Master", "")}</CardTitle>
            </CardHeader>
            <CardContent>
              <MasterForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>
                Edit {currentConfig.title.replace(" Master", "")}: {selectedRecord?.code}
              </CardTitle>
            </CardHeader>
            <CardContent>{selectedRecord && <MasterForm record={selectedRecord} isEdit={true} />}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
