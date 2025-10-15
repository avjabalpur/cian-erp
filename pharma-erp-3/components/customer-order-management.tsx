"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, Plus, Building2, Truck, Users, Factory, Calendar, DollarSign, Package } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Customer {
  id: string
  name: string
  type: "hospital" | "reseller" | "distributor" | "manufacturer"
  contactPerson: string
  email: string
  phone: string
  address: string
  creditLimit: number
  currentBalance: number
  paymentTerms: string
  status: "active" | "inactive" | "pending"
  lastOrderDate: string
  totalOrders: number
  totalValue: number
}

interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerType: "hospital" | "reseller" | "distributor" | "manufacturer"
  orderDate: string
  requestedDelivery: string
  status: "pending" | "confirmed" | "in-production" | "ready" | "shipped" | "delivered" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  totalValue: number
  items: Array<{
    productId: string
    productName: string
    productType: "capsule" | "tablet" | "liquid" | "sachet"
    quantity: number
    unit: string
    unitPrice: number
    totalPrice: number
    batchNumber?: string
  }>
  paymentStatus: "pending" | "partial" | "paid" | "overdue"
  shippingAddress: string
  notes?: string
}

const mockCustomers: Customer[] = [
  {
    id: "CUST001",
    name: "City General Hospital",
    type: "hospital",
    contactPerson: "Dr. Sarah Johnson",
    email: "procurement@citygeneral.com",
    phone: "+1-555-0123",
    address: "123 Medical Center Dr, Healthcare City, HC 12345",
    creditLimit: 500000,
    currentBalance: 45000,
    paymentTerms: "Net 30",
    status: "active",
    lastOrderDate: "2024-12-05",
    totalOrders: 156,
    totalValue: 2340000,
  },
  {
    id: "CUST002",
    name: "MedSupply Distributors Inc",
    type: "distributor",
    contactPerson: "Michael Chen",
    email: "orders@medsupply.com",
    phone: "+1-555-0456",
    address: "789 Distribution Blvd, Commerce Park, CP 67890",
    creditLimit: 750000,
    currentBalance: 125000,
    paymentTerms: "Net 45",
    status: "active",
    lastOrderDate: "2024-12-07",
    totalOrders: 89,
    totalValue: 1890000,
  },
  {
    id: "CUST003",
    name: "PharmaCare Retail Chain",
    type: "reseller",
    contactPerson: "Lisa Rodriguez",
    email: "purchasing@pharmacare.com",
    phone: "+1-555-0789",
    address: "456 Retail Plaza, Shopping District, SD 34567",
    creditLimit: 300000,
    currentBalance: 78000,
    paymentTerms: "Net 15",
    status: "active",
    lastOrderDate: "2024-12-08",
    totalOrders: 234,
    totalValue: 1560000,
  },
  {
    id: "CUST004",
    name: "Global Pharma Manufacturing",
    type: "manufacturer",
    contactPerson: "Robert Kim",
    email: "sourcing@globalpharma.com",
    phone: "+1-555-0321",
    address: "321 Industrial Way, Manufacturing Zone, MZ 78901",
    creditLimit: 1000000,
    currentBalance: 0,
    paymentTerms: "Net 60",
    status: "pending",
    lastOrderDate: "2024-11-15",
    totalOrders: 12,
    totalValue: 450000,
  },
]

const mockOrders: Order[] = [
  {
    id: "ORD001",
    orderNumber: "ORD-HSP-001",
    customerId: "CUST001",
    customerName: "City General Hospital",
    customerType: "hospital",
    orderDate: "2024-12-05",
    requestedDelivery: "2024-12-15",
    status: "in-production",
    priority: "high",
    totalValue: 45000,
    paymentStatus: "pending",
    shippingAddress: "123 Medical Center Dr, Healthcare City, HC 12345",
    items: [
      {
        productId: "PROD001",
        productName: "Acetaminophen 500mg Capsules",
        productType: "capsule",
        quantity: 100000,
        unit: "units",
        unitPrice: 0.45,
        totalPrice: 45000,
        batchNumber: "ACE-CAP-240815-001",
      },
    ],
    notes: "Urgent order for emergency stock replenishment",
  },
  {
    id: "ORD002",
    orderNumber: "ORD-RET-002",
    customerId: "CUST003",
    customerName: "PharmaCare Retail Chain",
    customerType: "reseller",
    orderDate: "2024-12-03",
    requestedDelivery: "2024-12-10",
    status: "ready",
    priority: "medium",
    totalValue: 28500,
    paymentStatus: "paid",
    shippingAddress: "456 Retail Plaza, Shopping District, SD 34567",
    items: [
      {
        productId: "PROD002",
        productName: "Ibuprofen 200mg Tablets",
        productType: "tablet",
        quantity: 50000,
        unit: "units",
        unitPrice: 0.35,
        totalPrice: 17500,
      },
      {
        productId: "PROD003",
        productName: "Vitamin C Powder Sachets",
        productType: "sachet",
        quantity: 25000,
        unit: "sachets",
        unitPrice: 0.44,
        totalPrice: 11000,
      },
    ],
  },
  {
    id: "ORD003",
    orderNumber: "ORD-DIS-003",
    customerId: "CUST002",
    customerName: "MedSupply Distributors Inc",
    customerType: "distributor",
    orderDate: "2024-12-07",
    requestedDelivery: "2024-12-20",
    status: "confirmed",
    priority: "low",
    totalValue: 125000,
    paymentStatus: "partial",
    shippingAddress: "789 Distribution Blvd, Commerce Park, CP 67890",
    items: [
      {
        productId: "PROD004",
        productName: "Cough Syrup 120ml",
        productType: "liquid",
        quantity: 10000,
        unit: "bottles",
        unitPrice: 12.5,
        totalPrice: 125000,
      },
    ],
  },
  {
    id: "ORD004",
    orderNumber: "ORD-HSP-004",
    customerId: "CUST001",
    customerName: "City General Hospital",
    customerType: "hospital",
    orderDate: "2024-12-01",
    requestedDelivery: "2024-12-08",
    status: "shipped",
    priority: "urgent",
    totalValue: 67500,
    paymentStatus: "pending",
    shippingAddress: "123 Medical Center Dr, Healthcare City, HC 12345",
    items: [
      {
        productId: "PROD005",
        productName: "Antibiotic Capsules 250mg",
        productType: "capsule",
        quantity: 75000,
        unit: "units",
        unitPrice: 0.9,
        totalPrice: 67500,
      },
    ],
  },
]

const getCustomerTypeIcon = (type: string) => {
  switch (type) {
    case "hospital":
      return <Building2 className="h-4 w-4 text-red-600" />
    case "distributor":
      return <Truck className="h-4 w-4 text-blue-600" />
    case "reseller":
      return <Users className="h-4 w-4 text-green-600" />
    case "manufacturer":
      return <Factory className="h-4 w-4 text-purple-600" />
    default:
      return <Building2 className="h-4 w-4 text-gray-600" />
  }
}

const getStatusBadge = (status: string, type: "customer" | "order" | "payment") => {
  if (type === "customer") {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }
    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-xs font-medium`}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  if (type === "order") {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      "in-production": "bg-orange-100 text-orange-800 border-orange-200",
      ready: "bg-green-100 text-green-800 border-green-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    }
    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-xs font-medium`}>
        {status.replace("-", " ").toUpperCase()}
      </Badge>
    )
  }

  if (type === "payment") {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      partial: "bg-orange-100 text-orange-800 border-orange-200",
      paid: "bg-green-100 text-green-800 border-green-200",
      overdue: "bg-red-100 text-red-800 border-red-200",
    }
    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-xs font-medium`}>
        {status.toUpperCase()}
      </Badge>
    )
  }
}

const getPriorityBadge = (priority: string) => {
  const variants = {
    low: "bg-gray-100 text-gray-800 border-gray-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <Badge className={`${variants[priority as keyof typeof variants]} text-xs font-medium`}>
      {priority.toUpperCase()}
    </Badge>
  )
}

export function CustomerOrderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all")
  const [orderStatusFilter, setOrderStatusFilter] = useState("all")

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = customerTypeFilter === "all" || customer.type === customerTypeFilter

    return matchesSearch && matchesType
  })

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.productName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6 bg-green-50/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer & Order Management</h1>
          <p className="text-sm text-gray-600 mt-1">Customer relationships and order fulfillment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-green-700 hover:bg-green-800">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {/* Order Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders, customers, products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in-production">In Production</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Orders ({filteredOrders.length} active)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Order Info
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Timeline
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                      >
                        <td className="p-3">
                          <div>
                            <div className="font-medium text-sm text-gray-900 font-mono">{order.orderNumber}</div>
                            <div className="text-xs text-gray-500">Order Date: {order.orderDate}</div>
                            <div className="text-xs text-gray-400">ID: {order.id}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {getCustomerTypeIcon(order.customerType)}
                            <div>
                              <div className="font-medium text-sm text-gray-900">{order.customerName}</div>
                              <div className="text-xs text-gray-500 capitalize">{order.customerType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="font-medium">{item.productName}</span>
                                <span className="text-gray-500 ml-2">
                                  {item.quantity.toLocaleString()} {item.unit}
                                </span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="text-xs text-gray-500">+{order.items.length - 2} more items</div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm font-semibold text-gray-900">
                            ${order.totalValue.toLocaleString()}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-2">
                            {getStatusBadge(order.status, "order")}
                            {getPriorityBadge(order.priority)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {order.requestedDelivery}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">{getStatusBadge(order.paymentStatus, "payment")}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Edit</span>
                              ✏️
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">View details</span>
                              👁️
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          {/* Customer Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search customers, contacts, emails..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="hospital">Hospitals</SelectItem>
                    <SelectItem value="distributor">Distributors</SelectItem>
                    <SelectItem value="reseller">Resellers</SelectItem>
                    <SelectItem value="manufacturer">Manufacturers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customers Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Customers ({filteredCustomers.length} total)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Credit Info
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Order History
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCustomers.map((customer, index) => (
                      <tr
                        key={customer.id}
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {getCustomerTypeIcon(customer.type)}
                            <div>
                              <div className="font-medium text-sm text-gray-900">{customer.name}</div>
                              <div className="text-xs text-gray-500 capitalize">{customer.type}</div>
                              <div className="text-xs text-gray-400">ID: {customer.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="text-sm text-gray-900">{customer.contactPerson}</div>
                            <div className="text-xs text-gray-600">{customer.email}</div>
                            <div className="text-xs text-gray-500">{customer.phone}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="text-sm">
                              <span className="text-gray-600">Limit: </span>
                              <span className="font-medium">${customer.creditLimit.toLocaleString()}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Balance: </span>
                              <span className="font-medium">${customer.currentBalance.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-500">{customer.paymentTerms}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium">{customer.totalOrders}</span>
                              <span className="text-gray-600 ml-1">orders</span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">${customer.totalValue.toLocaleString()}</span>
                              <span className="text-gray-600 ml-1">total</span>
                            </div>
                            <div className="text-xs text-gray-500">Last: {customer.lastOrderDate}</div>
                          </div>
                        </td>
                        <td className="p-3">{getStatusBadge(customer.status, "customer")}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Edit</span>
                              ✏️
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">View details</span>
                              👁️
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockOrders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Pending Payment</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mockOrders.filter((o) => o.paymentStatus === "pending").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockCustomers.filter((c) => c.status === "active").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${mockOrders.reduce((sum, order) => sum + order.totalValue, 0).toLocaleString()}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
