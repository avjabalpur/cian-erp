'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/shared/forms/form-input"
import { FormSwitch } from "@/components/shared/forms/form-switch"

interface ItemSalesFormProps {
  control: any;
  itemId?: number;
}

export function ItemSalesForm({ control, itemId }: ItemSalesFormProps) {
  return (
    <div className="space-y-4">
      {/* Pack Size Details */}
      <Card>
        <CardHeader>
          <CardTitle>Pack Size Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSwitch
              control={control}
              name="salesDetail.packSizeApplicable"
              label="Pack Size Applicable"
            />
            <FormInput
              control={control}
              name="salesDetail.defaultPackSize"
              label="Default Pack Size"
              placeholder="Enter default pack size"
            />
          </div>
          <FormInput
            control={control}
            name="salesDetail.saleableUnitContains"
            label="Saleable Unit Contains"
            placeholder="0"
          />
        </CardContent>
      </Card>

      {/* Packing Details */}
      <Card>
        <CardHeader>
          <CardTitle>Packing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name="salesDetail.qtyPerBox"
              label="Qty./Box"
              placeholder="0"
            />
            <FormInput
              control={control}
              name="salesDetail.boxesPerCase"
              label="Boxes/Case"
              placeholder="0"
            />
            <FormInput
              control={control}
              name="salesDetail.qtyPerCase"
              label="Qty./Case"
              placeholder="0"
            />
          </div>
          <FormInput
            control={control}
            name="salesDetail.casePackingType"
            label="Case Packing Type"
            placeholder="Enter case packing type"
          />
          <FormInput
            control={control}
            name="salesDetail.packingRate"
            label="Packing Rate"
            placeholder="0.00"
          />
        </CardContent>
      </Card>

      {/* Weight & Dimensions */}
      <Card>
        <CardHeader>
          <CardTitle>Weight & Dimensions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name="salesDetail.netWeightCase"
              label="Net Weight/Case"
              placeholder="0.000"
            />
            <FormInput
              control={control}
              name="salesDetail.tareWeightCase"
              label="Tare Weight/Case"
              placeholder="0.000"
            />
            <FormInput
              control={control}
              name="salesDetail.grossWeightCase"
              label="Gross Weight/Case"
              placeholder="0.000"
            />
          </div>
          <FormInput
            control={control}
            name="salesDetail.grossWeightUnit"
            label="Gross Weight Unit"
            placeholder="e.g., KGS"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="salesDetail.caseDimensionsInches"
              label="Case Dimensions (Inches)"
              placeholder="L x W x H"
            />
            <FormInput
              control={control}
              name="salesDetail.caseVolumeCft"
              label="Case Volume (CFT)"
              placeholder="0.000"
            />
            <FormInput
              control={control}
              name="salesDetail.caseDimensionsCm"
              label="Case Dimensions (CM)"
              placeholder="L x W x H"
            />
            <FormInput
              control={control}
              name="salesDetail.caseVolumeCbm"
              label="Case Volume (CBM)"
              placeholder="0.000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sales & GTIN Details */}
      <Card>
        <CardHeader>
          <CardTitle>Sales & GTIN Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="salesDetail.minSaleRate"
              label="Min. Sale Rate"
              placeholder="0.00000"
            />
            <FormInput
              control={control}
              name="salesDetail.minSoQty"
              label="Min. SO Qty."
              placeholder="0"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name="salesDetail.primaryGtin"
              label="Primary GTIN"
              placeholder="Enter primary GTIN"
            />
            <FormInput
              control={control}
              name="salesDetail.secondaryGtin"
              label="Secondary GTIN"
              placeholder="Enter secondary GTIN"
            />
            <FormInput
              control={control}
              name="salesDetail.tertiaryGtin"
              label="Tertiary GTIN"
              placeholder="Enter tertiary GTIN"
            />
          </div>
          <FormInput
            control={control}
            name="salesDetail.interfaceCode"
            label="Interface Code"
            placeholder="Enter interface code"
          />
          <FormInput
            control={control}
            name="salesDetail.specs"
            label="Specifications"
            placeholder="Enter specifications"
          />
        </CardContent>
      </Card>
    </div>
  )
}

