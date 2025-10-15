import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import AdvancedItemMaster from "@/components/advanced-item-master"
import SalesPurchaseOrders from "@/components/sales-purchase-orders"
import MasterTablesManagement from "@/components/master-tables-management"
import { MainDashboard } from "@/components/main-dashboard"
import ProductFormulaMasters from "@/components/product-formula-masters"
import LocationEquipmentMasters from "@/components/location-equipment-masters"
import FinancialRegulatoryIntegration from "@/components/financial-regulatory-integration"
import BusinessPartnerMasters from "@/components/business-partner-masters"
import SalesDistribution from "@/components/sales-distribution"
import ProcurementModule from "@/components/procurement-module"
import ManufacturingDetailed from "@/components/manufacturing-detailed"
import InventoryManagement from "@/components/inventory-management"
import QualityControlComprehensive from "@/components/quality-control-comprehensive"
import ERPHeader from "@/components/erp-header"
import RDClinicalManagement from "@/components/rd-clinical-management"
import ComplianceValidation from "@/components/compliance-validation"
import FinancialAnalytics from "@/components/financial-analytics"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <ERPHeader />

      <Tabs defaultValue="dashboard" className="w-full">
        <div className="border-b bg-white px-6 py-4">
          <TabsList className="grid w-full grid-cols-12 max-w-full">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="masters">Masters</TabsTrigger>
            <TabsTrigger value="sales">Sales & Distribution</TabsTrigger>
            <TabsTrigger value="procurement">Procurement</TabsTrigger>
            <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="quality">Quality Control</TabsTrigger>
            <TabsTrigger value="rd-clinical">R&D & Clinical</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="mt-0">
          <MainDashboard />
        </TabsContent>

        <TabsContent value="masters" className="mt-0">
          <div className="p-6">
            <Tabs defaultValue="items" className="w-full">
              <TabsList className="grid w-full grid-cols-6 max-w-4xl mb-6">
                <TabsTrigger value="items">Item Master</TabsTrigger>
                <TabsTrigger value="products">Product & Formula</TabsTrigger>
                <TabsTrigger value="partners">Business Partners</TabsTrigger>
                <TabsTrigger value="locations">Location & Equipment</TabsTrigger>
                <TabsTrigger value="customers">Customers & Vendors</TabsTrigger>
                <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
              </TabsList>

              <TabsContent value="items">
                <AdvancedItemMaster />
              </TabsContent>

              <TabsContent value="products">
                <ProductFormulaMasters />
              </TabsContent>

              <TabsContent value="partners">
                <BusinessPartnerMasters />
              </TabsContent>

              <TabsContent value="locations">
                <LocationEquipmentMasters />
              </TabsContent>

              <TabsContent value="customers">
                <MasterTablesManagement />
              </TabsContent>

              <TabsContent value="warehouses">
                <div className="text-center py-8 text-muted-foreground">
                  Additional Warehouse Management - Coming Soon
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="mt-0">
          <SalesDistribution />
        </TabsContent>

        <TabsContent value="procurement" className="mt-0">
          <ProcurementModule />
        </TabsContent>

        <TabsContent value="manufacturing" className="mt-0">
          <div className="p-6">
            <ManufacturingDetailed />
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-0">
          <div className="p-6">
            <SalesPurchaseOrders />
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mt-0">
          <InventoryManagement />
        </TabsContent>

        <TabsContent value="quality" className="mt-0">
          <QualityControlComprehensive />
        </TabsContent>

        <TabsContent value="rd-clinical" className="mt-0">
          <div className="p-6">
            <RDClinicalManagement />
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-0">
          <div className="p-6">
            <ComplianceValidation />
          </div>
        </TabsContent>

        <TabsContent value="financial" className="mt-0">
          <div className="p-6">
            <FinancialRegulatoryIntegration />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <div className="p-6">
            <FinancialAnalytics />
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-0">
          <div className="p-6 text-center py-8 text-muted-foreground">Reports & Analytics - Coming Soon</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
