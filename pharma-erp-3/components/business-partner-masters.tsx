"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus, Edit, Eye, Filter } from "lucide-react"

export default function BusinessPartnerMasters() {
  const [activeTable, setActiveTable] = useState("customers")
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Sample data for different master tables
  const customerData = [
    {
      id: "CUST001",
      name: "Apollo Hospitals",
      type: "Hospital",
      category: "A",
      creditLimit: 500000,
      paymentTerms: "30 Days",
      gstNo: "29AABCU9603R1ZX",
      status: "Active",
      contactPerson: "Dr. Sharma",
      phone: "+91-9876543210",
      email: "procurement@apollo.com",
      address: "Chennai, Tamil Nadu",
    },
    {
      id: "CUST002",
      name: "MedPlus Pharmacy",
      type: "Retailer",
      category: "B",
      creditLimit: 200000,
      paymentTerms: "15 Days",
      gstNo: "36AABCU9603R1ZY",
      status: "Active",
      contactPerson: "Rajesh Kumar",
      phone: "+91-9876543211",
      email: "orders@medplus.com",
      address: "Hyderabad, Telangana",
    },
    {
      id: "CUST003",
      name: "Fortis Healthcare",
      type: "Hospital",
      category: "A",
      creditLimit: 750000,
      paymentTerms: "45 Days",
      gstNo: "07AABCU9603R1ZZ",
      status: "Active",
      contactPerson: "Dr. Patel",
      phone: "+91-9876543212",
      email: "supply@fortis.com",
      address: "Delhi, India",
    },
  ]

  const vendorData = [
    {
      id: "VEND001",
      name: "Sigma Aldrich",
      type: "Raw Material",
      category: "Preferred",
      creditRating: "AAA",
      paymentTerms: "30 Days",
      gstNo: "29AABCS9603R1ZX",
      status: "Active",
      contactPerson: "John Smith",
      phone: "+1-800-325-3010",
      email: "orders@sigmaaldrich.com",
      address: "St. Louis, MO, USA",
    },
    {
      id: "VEND002",
      name: "Merck KGaA",
      type: "API Supplier",
      category: "Strategic",
      creditRating: "AA+",
      paymentTerms: "45 Days",
      gstNo: "36AABCM9603R1ZY",
      status: "Active",
      contactPerson: "Hans Mueller",
      phone: "+49-6151-72-0",
      email: "supply@merckgroup.com",
      address: "Darmstadt, Germany",
    },
    {
      id: "VEND003",
      name: "Capsugel India",
      type: "Packaging",
      category: "Approved",
      creditRating: "A+",
      paymentTerms: "30 Days",
      gstNo: "07AABCC9603R1ZZ",
      status: "Active",
      contactPerson: "Amit Gupta",
      phone: "+91-22-6742-8000",
      email: "sales@capsugel.com",
      address: "Mumbai, Maharashtra",
    },
  ]

  const employeeData = [
    {
      id: "EMP001",
      name: "Dr. Rajesh Sharma",
      department: "Quality Control",
      designation: "QC Manager",
      empType: "Permanent",
      grade: "M3",
      reportingTo: "Dr. Patel",
      joiningDate: "2020-01-15",
      salary: 85000,
      phone: "+91-9876543213",
      email: "rajesh.sharma@company.com",
      address: "Bangalore, Karnataka",
    },
    {
      id: "EMP002",
      name: "Priya Nair",
      department: "Production",
      designation: "Production Supervisor",
      empType: "Permanent",
      grade: "S2",
      reportingTo: "Mr. Kumar",
      joiningDate: "2019-06-10",
      salary: 65000,
      phone: "+91-9876543214",
      email: "priya.nair@company.com",
      address: "Chennai, Tamil Nadu",
    },
    {
      id: "EMP003",
      name: "Amit Singh",
      department: "R&D",
      designation: "Formulation Scientist",
      empType: "Contract",
      grade: "S3",
      reportingTo: "Dr. Sharma",
      joiningDate: "2021-03-20",
      salary: 75000,
      phone: "+91-9876543215",
      email: "amit.singh@company.com",
      address: "Hyderabad, Telangana",
    },
  ]

  const contactData = [
    {
      id: "CONT001",
      name: "Dr. Suresh Kumar",
      company: "Apollo Hospitals",
      designation: "Chief Pharmacist",
      type: "Primary",
      phone: "+91-9876543216",
      email: "suresh.kumar@apollo.com",
      department: "Pharmacy",
      lastContact: "2024-01-15",
      notes: "Key decision maker for bulk orders",
    },
    {
      id: "CONT002",
      name: "Ms. Lakshmi Devi",
      company: "MedPlus Pharmacy",
      designation: "Purchase Manager",
      type: "Primary",
      phone: "+91-9876543217",
      email: "lakshmi.devi@medplus.com",
      department: "Procurement",
      lastContact: "2024-01-10",
      notes: "Handles all generic medicine purchases",
    },
    {
      id: "CONT003",
      name: "Mr. Ravi Teja",
      company: "Fortis Healthcare",
      designation: "Supply Chain Head",
      type: "Secondary",
      phone: "+91-9876543218",
      email: "ravi.teja@fortis.com",
      department: "Supply Chain",
      lastContact: "2024-01-08",
      notes: "Backup contact for urgent orders",
    },
  ]

  const addressData = [
    {
      id: "ADDR001",
      type: "Billing",
      company: "Apollo Hospitals",
      address1: "21, Greams Lane",
      address2: "Off Greams Road",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600006",
      country: "India",
      isDefault: true,
      gstNo: "29AABCU9603R1ZX",
    },
    {
      id: "ADDR002",
      type: "Shipping",
      company: "Apollo Hospitals",
      address1: "Apollo Health City",
      address2: "Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033",
      country: "India",
      isDefault: false,
      gstNo: "36AABCU9603R1ZY",
    },
    {
      id: "ADDR003",
      type: "Billing",
      company: "MedPlus Pharmacy",
      address1: "MedPlus House",
      address2: "Begumpet",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500016",
      country: "India",
      isDefault: true,
      gstNo: "36AABCM9603R1ZZ",
    },
  ]

  const getCurrentData = () => {
    switch (activeTable) {
      case "customers":
        return customerData
      case "vendors":
        return vendorData
      case "employees":
        return employeeData
      case "contacts":
        return contactData
      case "addresses":
        return addressData
      default:
        return []
    }
  }

  const getTableColumns = () => {
    switch (activeTable) {
      case "customers":
        return [
          "ID",
          "Name",
          "Type",
          "Category",
          "Credit Limit",
          "Payment Terms",
          "GST No",
          "Status",
          "Contact Person",
          "Phone",
          "Email",
          "Address",
        ]
      case "vendors":
        return [
          "ID",
          "Name",
          "Type",
          "Category",
          "Credit Rating",
          "Payment Terms",
          "GST No",
          "Status",
          "Contact Person",
          "Phone",
          "Email",
          "Address",
        ]
      case "employees":
        return [
          "ID",
          "Name",
          "Department",
          "Designation",
          "Type",
          "Grade",
          "Reporting To",
          "Joining Date",
          "Salary",
          "Phone",
          "Email",
          "Address",
        ]
      case "contacts":
        return ["ID", "Name", "Company", "Designation", "Type", "Phone", "Email", "Department", "Last Contact", "Notes"]
      case "addresses":
        return [
          "ID",
          "Type",
          "Company",
          "Address 1",
          "Address 2",
          "City",
          "State",
          "Pincode",
          "Country",
          "Default",
          "GST No",
        ]
      default:
        return []
    }
  }

  const renderTableRow = (item, index) => {
    switch (activeTable) {
      case "customers":
        return (
          <tr key={item.id} className="border-b hover:bg-gray-50">
            <td className="px-2 py-1 text-xs font-mono">{item.id}</td>
            <td className="px-2 py-1 text-xs font-medium">{item.name}</td>
            <td className="px-2 py-1 text-xs">{item.type}</td>
            <td className="px-2 py-1 text-xs">
              <Badge variant={item.category === "A" ? "default" : "secondary"}>{item.category}</Badge>
            </td>
            <td className="px-2 py-1 text-xs">₹{item.creditLimit.toLocaleString()}</td>
            <td className="px-2 py-1 text-xs">{item.paymentTerms}</td>
            <td className="px-2 py-1 text-xs font-mono">{item.gstNo}</td>
            <td className="px-2 py-1 text-xs">
              <Badge variant={item.status === "Active" ? "default" : "secondary"}>{item.status}</Badge>
            </td>
            <td className="px-2 py-1 text-xs">{item.contactPerson}</td>
            <td className="px-2 py-1 text-xs">{item.phone}</td>
            <td className="px-2 py-1 text-xs">{item.email}</td>
            <td className="px-2 py-1 text-xs">{item.address}</td>
            <td className="px-2 py-1">
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setEditingItem(item)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </td>
          </tr>
        )
      case "vendors":
        return (
          <tr key={item.id} className="border-b hover:bg-gray-50">
            <td className="px-2 py-1 text-xs font-mono">{item.id}</td>
            <td className="px-2 py-1 text-xs font-medium">{item.name}</td>
            <td className="px-2 py-1 text-xs">{item.type}</td>
            <td className="px-2 py-1 text-xs">
              <Badge variant="outline">{item.category}</Badge>
            </td>
            <td className="px-2 py-1 text-xs">
              <Badge variant="default">{item.creditRating}</Badge>
            </td>
            <td className="px-2 py-1 text-xs">{item.paymentTerms}</td>
            <td className="px-2 py-1 text-xs font-mono">{item.gstNo}</td>
            <td className="px-2 py-1 text-xs">
              <Badge variant={item.status === "Active" ? "default" : "secondary"}>{item.status}</Badge>
            </td>
            <td className="px-2 py-1 text-xs">{item.contactPerson}</td>
            <td className="px-2 py-1 text-xs">{item.phone}</td>
            <td className="px-2 py-1 text-xs">{item.email}</td>
            <td className="px-2 py-1 text-xs">{item.address}</td>
            <td className="px-2 py-1">
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setEditingItem(item)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </td>
          </tr>
        )
      case "employees":
        return (
          <tr key={item.id} className="border-b hover:bg-gray-50">
            <td className="px-2 py-1 text-xs font-mono">{item.id}</td>
            <td className="px-2 py-1 text-xs font-medium">{item.name}</td>
            <td className="px-2 py-1 text-xs">{item.department}</td>
            <td className="px-2 py-1 text-xs">{item.designation}</td>
            <td className="px-2 py-1 text-xs">
              <Badge variant={item.empType === "Permanent" ? "default" : "secondary"}>{item.empType}</Badge>
            </td>
            <td className="px-2 py-1 text-xs">{item.grade}</td>
            <td className="px-2 py-1 text-xs">{item.reportingTo}</td>
            <td className="px-2 py-1 text-xs">{item.joiningDate}</td>
            <td className="px-2 py-1 text-xs">₹{item.salary.toLocaleString()}</td>
            <td className="px-2 py-1 text-xs">{item.phone}</td>
            <td className="px-2 py-1 text-xs">{item.email}</td>
            <td className="px-2 py-1 text-xs">{item.address}</td>
            <td className="px-2 py-1">
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setEditingItem(item)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </td>
          </tr>
        )
      case "contacts":
        return (
          <tr key={item.id} className="border-b hover:bg-gray-50">
            <td className="px-2 py-1 text-xs font-mono">{item.id}</td>
            <td className="px-2 py-1 text-xs font-medium">{item.name}</td>
            <td className="px-2 py-1 text-xs">{item.company}</td>
            <td className="px-2 py-1 text-xs">{item.designation}</td>
            <td className="px-2 py-1 text-xs">
              <Badge variant={item.type === "Primary" ? "default" : "secondary"}>{item.type}</Badge>
            </td>
            <td className="px-2 py-1 text-xs">{item.phone}</td>
            <td className="px-2 py-1 text-xs">{item.email}</td>
            <td className="px-2 py-1 text-xs">{item.department}</td>
            <td className="px-2 py-1 text-xs">{item.lastContact}</td>
            <td className="px-2 py-1 text-xs">{item.notes}</td>
            <td className="px-2 py-1">
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setEditingItem(item)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </td>
          </tr>
        )
      case "addresses":
        return (
          <tr key={item.id} className="border-b hover:bg-gray-50">
            <td className="px-2 py-1 text-xs font-mono">{item.id}</td>
            <td className="px-2 py-1 text-xs">{item.type}</td>
            <td className="px-2 py-1 text-xs font-medium">{item.company}</td>
            <td className="px-2 py-1 text-xs">{item.address1}</td>
            <td className="px-2 py-1 text-xs">{item.address2}</td>
            <td className="px-2 py-1 text-xs">{item.city}</td>
            <td className="px-2 py-1 text-xs">{item.state}</td>
            <td className="px-2 py-1 text-xs">{item.pincode}</td>
            <td className="px-2 py-1 text-xs">{item.country}</td>
            <td className="px-2 py-1 text-xs">
              {item.isDefault ? <Badge variant="default">Yes</Badge> : <Badge variant="secondary">No</Badge>}
            </td>
            <td className="px-2 py-1 text-xs font-mono">{item.gstNo}</td>
            <td className="px-2 py-1">
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setEditingItem(item)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </td>
          </tr>
        )
      default:
        return null
    }
  }

  const filteredData = getCurrentData().filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Business Partner Masters</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            New {activeTable.slice(0, -1).charAt(0).toUpperCase() + activeTable.slice(1, -1)}
          </Button>
        </div>
      </div>

      <Tabs value={activeTable} onValueChange={setActiveTable} className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="customers">Customer Master</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Master</TabsTrigger>
          <TabsTrigger value="employees">Employee Master</TabsTrigger>
          <TabsTrigger value="contacts">Contact Master</TabsTrigger>
          <TabsTrigger value="addresses">Address Master</TabsTrigger>
        </TabsList>

        <div className="mt-4 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search ${activeTable}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {getTableColumns().map((column, index) => (
                        <th
                          key={index}
                          className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column}
                        </th>
                      ))}
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item, index) => renderTableRow(item, index))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {filteredData.length} of {getCurrentData().length} {activeTable}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
