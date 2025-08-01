"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Users, 
  ShoppingCart, 
  Plus,
  ArrowRight,
  FileText,
  Settings,
  BarChart3
} from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: "Add Customer",
      description: "Create a new customer",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/customers",
      action: "add"
    },
    {
      title: "Add Item",
      description: "Add new item to inventory",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/items",
      action: "add"
    },
    {
      title: "Create Sales Order",
      description: "Create a new sales order",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/sales-orders",
      action: "add"
    },
    {
      title: "View Customers",
      description: "Browse all customers",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/customers",
      action: "view"
    },
    {
      title: "View Items",
      description: "Browse inventory items",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/items",
      action: "view"
    },
    {
      title: "View Sales Orders",
      description: "Browse all sales orders",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/sales-orders",
      action: "view"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used actions and navigation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-3 hover:shadow-md transition-shadow"
              onClick={() => router.push(action.href)}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`p-2 rounded-lg ${action.bgColor}`}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                {action.action === "add" && (
                  <Plus className="h-4 w-4 text-muted-foreground" />
                )}
                {action.action === "view" && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 