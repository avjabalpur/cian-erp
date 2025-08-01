import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentCustomers } from "@/components/dashboard/recent-customers"
import { RecentItems } from "@/components/dashboard/recent-items"
import { RecentSalesOrders } from "@/components/dashboard/recent-sales-orders"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to CIAN Pharma ERP - Your comprehensive pharmaceutical management system
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentCustomers />
        <RecentItems />
        <RecentSalesOrders />
      </div>
    </div>
  )
}
