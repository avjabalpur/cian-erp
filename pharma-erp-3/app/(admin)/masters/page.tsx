"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import AdvancedItemMaster from "@/components/advanced-item-master"
import MasterTablesManagement from "@/components/master-tables-management"
import ProductFormulaMasters from "@/components/product-formula-masters"
import LocationEquipmentMasters from "@/components/location-equipment-masters"
import BusinessPartnerMasters from "@/components/business-partner-masters"
import { cn } from "@/lib/utils"

const masterTabs = [
  { label: "Item Master", value: "items" },
  { label: "Product & Formula", value: "products" },
  { label: "Business Partners", value: "partners" },
  { label: "Location & Equipment", value: "locations" },
  { label: "Customers & Vendors", value: "customers" },
  { label: "Warehouses", value: "warehouses" },
]

export default function MastersPage() {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "items"

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="w-full">
          <div className="grid w-full grid-cols-6 gap-2 max-w-4xl mb-6">
            {masterTabs.map((tab) => {
              const isActive = activeTab === tab.value
              return (
                <Link
                  key={tab.value}
                  href={`/masters?tab=${tab.value}`}
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tab.label}
                </Link>
              )
            })}
          </div>

          {activeTab === "items" && <AdvancedItemMaster />}
          {activeTab === "products" && <ProductFormulaMasters />}
          {activeTab === "partners" && <BusinessPartnerMasters />}
          {activeTab === "locations" && <LocationEquipmentMasters />}
          {activeTab === "customers" && <MasterTablesManagement />}
          {activeTab === "warehouses" && (
            <div className="text-center py-8 text-muted-foreground">
              Additional Warehouse Management - Coming Soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
