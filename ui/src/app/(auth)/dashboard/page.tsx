import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to CIAN Pharma ERP - Your comprehensive pharmaceutical management system
        </p>
      </div>
      <DashboardStats />
      <QuickActions />
    </div>
  )
}
