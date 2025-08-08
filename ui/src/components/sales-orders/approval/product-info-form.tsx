"use client";

import { Control, useWatch } from "react-hook-form";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { SalesOrderUpdateFormValues } from "@/validations/sales-order";
import { SalesOrderOptionsMaster } from "@/lib/constants/sales-order-options";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormTextArea } from "@/components/shared/forms/form-text-area";

interface ProductInfoFormProps {
  control: Control<SalesOrderUpdateFormValues>;
  disabled?: boolean;
}

export function ProductInfoForm({ control, disabled }: ProductInfoFormProps) {
  // Watch dosage name to conditionally show fields
  const watchedValues = useWatch({ control });
  const dosageName = watchedValues.dosageName;

  // Determine which fields to show based on dosage form
  const showTabletFields = dosageName === "TABLET";
  const showCapsuleFields = dosageName === "CAPSULE";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Specifications</CardTitle>
        <CardDescription>
          Detailed product specifications and manufacturing details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Product Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Product Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormTextArea
              control={control}
              name="composition"
              label="Composition"
              placeholder="Enter product composition"
              disabled={disabled}
              rows={3}
            />
            
            <FormInput
              control={control}
              name="packShort"
              label="Pack Short"
              placeholder="Enter pack short description"
              disabled={disabled}
            />
            
            <FormSelect
              control={control}
              name="shelfLife"
              label="Shelf Life"
              options={SalesOrderOptionsMaster.shelfLife}
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="colour"
              label="Colour"
              placeholder="Enter product colour"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Tablet Specific Fields */}
        {showTabletFields && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tablet Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                control={control}
                name="tabletType"
                label="Tablet Type"
                options={SalesOrderOptionsMaster.tabletTypes}
                disabled={disabled}
              />
              
              <FormSelect
                control={control}
                name="tabletSize"
                label="Tablet Size"
                options={SalesOrderOptionsMaster.tabletSizes}
                disabled={disabled}
              />
              
              <FormInput
                control={control}
                name="changePart"
                label="Change Part"
                placeholder="Enter change part details"
                disabled={disabled}
              />
            </div>
          </div>
        )}

        {/* Capsule Specific Fields */}
        {showCapsuleFields && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Capsule Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                control={control}
                name="capsuleSize"
                label="Capsule Size"
                options={SalesOrderOptionsMaster.capsuleSizes}
                disabled={disabled}
              />
            </div>
          </div>
        )}

        {/* Packaging Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Packaging Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              control={control}
              name="shipperSize"
              label="Shipper Size"
              options={SalesOrderOptionsMaster.shipperSizes}
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="qtyPerShipper"
              label="Quantity per Shipper"
              placeholder="Enter quantity per shipper"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="noOfShipper"
              label="Number of Shippers"
              placeholder="Enter number of shippers"
              disabled={disabled}
            />
            
            <FormSelect
              control={control}
              name="flavour"
              label="Flavour"
              options={SalesOrderOptionsMaster.flavours}
              disabled={disabled}
            />
            
            <FormSelect
              control={control}
              name="fragrance"
              label="Fragrance"
              options={SalesOrderOptionsMaster.fragrances}
              disabled={disabled}
            />
          </div>
        </div>

        {/* Quantity and Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Quantity & Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="quantity"
              label="Quantity"
              placeholder="Enter quantity"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="focQty"
              label="FOC Quantity"
              placeholder="Enter FOC quantity"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="mrp"
              label="MRP"
              placeholder="Enter MRP"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="billingRate"
              label="Billing Rate"
              placeholder="Enter billing rate"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="costing"
              label="Costing"
              placeholder="Enter costing"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Manufacturing Charges */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Manufacturing Charges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="inventoryCharges"
              label="Inventory Charges"
              placeholder="Enter inventory charges"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="cylinderCharge"
              label="Cylinder Charge"
              placeholder="Enter cylinder charge"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="plateCharges"
              label="Plate Charges"
              placeholder="Enter plate charges"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Manufacturing Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Manufacturing Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              control={control}
              name="domino"
              label="Domino/Stereo"
              options={SalesOrderOptionsMaster.domino}
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="stereo"
              label="Stereo"
              placeholder="Enter stereo details"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Drawing References */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Drawing References</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="shipperDrawingRefCode"
              label="Shipper Drawing Ref Code"
              placeholder="Enter shipper drawing reference"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="ctnOuterDrawingRefNo"
              label="CTN Outer Drawing Ref No"
              placeholder="Enter outer carton drawing reference"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="ctnInnerDrawingRefNo"
              label="CTN Inner Drawing Ref No"
              placeholder="Enter inner carton drawing reference"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="foilDrawingRefNo"
              label="Foil Drawing Ref No"
              placeholder="Enter foil drawing reference"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="leafletDrawingRefNo"
              label="Leaflet Drawing Ref No"
              placeholder="Enter leaflet drawing reference"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="tubeDrawingRefNo"
              label="Tube Drawing Ref No"
              placeholder="Enter tube drawing reference"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="labelDrawingRefNo"
              label="Label Drawing Ref No"
              placeholder="Enter label drawing reference"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Production Management Stock */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Production Management Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="pmOuterCtnStock"
              label="PM Outer CTN Stock"
              placeholder="Enter outer carton stock"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="pmInnerCtnStock"
              label="PM Inner CTN Stock"
              placeholder="Enter inner carton stock"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="pmFoilStock"
              label="PM Foil Stock"
              placeholder="Enter foil stock"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="pmLeafletStock"
              label="PM Leaflet Stock"
              placeholder="Enter leaflet stock"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="pmTubeStock"
              label="PM Tube Stock"
              placeholder="Enter tube stock"
              disabled={disabled}
            />
            
            <FormInput
              control={control}
              name="pmLabelStock"
              label="PM Label Stock"
              placeholder="Enter label stock"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Drug Approval */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Drug Approval</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="drugApprovalUnder"
              label="Drug Approval Under"
              placeholder="Enter drug approval details"
              disabled={disabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}