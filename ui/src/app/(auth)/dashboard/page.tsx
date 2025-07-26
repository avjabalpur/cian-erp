import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Package, ShoppingCart, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      name: "Total Users",
      value: "156",
      change: "+12%",
      changeType: "positive",
      icon: Users,
    },
    {
      name: "Active Items",
      value: "2,847",
      change: "+5%",
      changeType: "positive",
      icon: Package,
    },
    {
      name: "Purchase Orders",
      value: "89",
      change: "-2%",
      changeType: "negative",
      icon: ShoppingCart,
    },
    {
      name: "Sales Orders",
      value: "234",
      change: "+18%",
      changeType: "positive",
      icon: FileText,
    },
  ]

  const recentOrders = [
    {
      id: "PO-2024-001",
      type: "Purchase",
      vendor: "ABC Pharmaceuticals",
      amount: "₹2,45,000",
      status: "Pending",
      date: "2024-01-15",
    },
    {
      id: "SO-2024-045",
      type: "Sales",
      customer: "City Hospital",
      amount: "₹1,85,000",
      status: "Approved",
      date: "2024-01-14",
    },
    {
      id: "PO-2024-002",
      type: "Purchase",
      vendor: "MedSupply Co.",
      amount: "₹95,000",
      status: "Completed",
      date: "2024-01-13",
    },
  ]

  const lowStockItems = [
    { name: "Paracetamol 500mg", current: 45, minimum: 100, unit: "Strips" },
    { name: "Amoxicillin 250mg", current: 23, minimum: 50, unit: "Vials" },
    { name: "Insulin Injection", current: 8, minimum: 25, unit: "Vials" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to CIAN Pharma ERP - Your comprehensive pharmaceutical management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest purchase and sales orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge variant="outline">{order.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.type === "Purchase" ? order.vendor : order.customer}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-medium">{order.amount}</p>
                    <Badge
                      variant={
                        order.status === "Completed" ? "default" : order.status === "Approved" ? "secondary" : "outline"
                      }
                    >
                      {order.status === "Completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {order.status === "Pending" && <Clock className="w-3 h-3 mr-1" />}
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>Items below minimum stock level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
                  <div className="space-y-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Current: {item.current} {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-orange-600 font-medium">
                      Min: {item.minimum} {item.unit}
                    </p>
                    <Badge variant="destructive">Low Stock</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Add Item</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Add Customer</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Create PO</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium">Create SO</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
