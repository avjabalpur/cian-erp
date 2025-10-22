"use client";

import { Control, useWatch } from "react-hook-form";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { FormTextArea } from "@/components/shared/forms/form-text-area";
import { SalesOrderUpdateFormValues } from "../validations/sales-order.schema";

interface ProductInfoFormProps {
  control: Control<SalesOrderUpdateFormValues>;
  disabled?: boolean;
}

const tabletTypes = [
  { label: 'Select type', value: '-1' },
  { label: 'Coated', value: 'coated' },
  { label: 'Uncoated', value: 'uncoated' },
];

const tabletSizes = [
  { label: 'Select size', value: '-1' },
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

const shipperSizes = [
  { label: 'Select size', value: '-1' },
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

const flavours = [
  { label: 'Select flavour', value: '-1' },
  { label: 'Orange', value: 'orange' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Vanilla', value: 'vanilla' },
];

const fragrances = [
  { label: 'Select fragrance', value: '-1' },
  { label: 'Floral', value: 'floral' },
  { label: 'Citrus', value: 'citrus' },
];

export function ProductInfoForm({ control, disabled }: ProductInfoFormProps) {
  const watchedValues = useWatch({ control });

  return (
    <div className="space-y-2">
      {/* Basic Product Information */}
      <div className="space-y-2">
        <FormTextArea
          control={control}
          name="composition"
          label="Composition"
          placeholder="Enter product composition"
          disabled={disabled}
          rows={3}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            control={control}
            name="packShort"
            label="Pack Short"
            placeholder="Enter pack short description"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Quantity and Pricing */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Quantity and Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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

      {/* Tablet Specifications */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Tablet Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            control={control}
            name="tabletType"
            label="Tablet Type"
            options={tabletTypes}
            disabled={disabled}
          />

          <FormSelect
            control={control}
            name="tabletSize"
            label="Tablet Size"
            options={tabletSizes}
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="changePart"
            label="Change Part"
            placeholder="Enter change part details"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="capsuleSize"
            label="Capsule Size"
            placeholder="Enter capsule size"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Packaging Information */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Packaging Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <FormSelect
            control={control}
            name="shipperSize"
            label="Shipper Size"
            options={shipperSizes}
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
            options={flavours}
            disabled={disabled}
          />

          <FormSelect
            control={control}
            name="fragrance"
            label="Fragrance"
            options={fragrances}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Manufacturing Charges */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Manufacturing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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

          <FormInput
            control={control}
            name="domino"
            label="Domino"
            placeholder="Enter domino details"
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
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Drawing References</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <FormInput
            control={control}
            name="shipperDrawingRefCode"
            label="Shipper Drawing"
            placeholder="Shipper ref"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="ctnOuterDrawingRefNo"
            label="CTN Outer Drawing"
            placeholder="Outer carton ref"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="ctnInnerDrawingRefNo"
            label="CTN Inner Drawing"
            placeholder="Inner carton ref"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="foilDrawingRefNo"
            label="Foil Drawing"
            placeholder="Foil ref"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="leafletDrawingRefNo"
            label="Leaflet Drawing"
            placeholder="Leaflet ref"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="tubeDrawingRefNo"
            label="Tube Drawing"
            placeholder="Tube ref"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="labelDrawingRefNo"
            label="Label Drawing"
            placeholder="Label ref"
            disabled={disabled}
          />
        </div>
      </div>

      {/* PM Stock */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">PM Stock</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <FormInput
            control={control}
            name="pmOuterCtnStock"
            label="PM Outer CTN Stock"
            placeholder="Outer carton stock"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="pmInnerCtnStock"
            label="PM Inner CTN Stock"
            placeholder="Inner carton stock"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="pmFoilStock"
            label="PM Foil Stock"
            placeholder="Foil stock"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="pmLeafletStock"
            label="PM Leaflet Stock"
            placeholder="Leaflet stock"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="pmTubeStock"
            label="PM Tube Stock"
            placeholder="Tube stock"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="pmLabelStock"
            label="PM Label Stock"
            placeholder="Label stock"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormInput
            control={control}
            name="designUnder"
            label="Design Under"
            placeholder="Enter design details"
            disabled={disabled}
          />

          <FormInput
            control={control}
            name="drugApprovalUnder"
            label="Drug Approval Under"
            placeholder="Enter drug approval details"
            disabled={disabled}
          />

          <FormTextArea
            control={control}
            name="packingStyleDescription"
            label="Packing Style Description"
            placeholder="Enter packing style description"
            disabled={disabled}
            rows={3}
          />

          <FormTextArea
            control={control}
            name="comments"
            label="Comments"
            placeholder="Enter comments"
            disabled={disabled}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

