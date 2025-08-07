"use client";

import { Control } from "react-hook-form";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { SalesOrderUpdateFormValues } from "@/validations/sales-order";
import { 
  pShelfLifeOptions, 
  pDominoOptions, 
  tabletTypeOptions, 
  tabletSizeOptions, 
  changePartOptions, 
  shipperSizeOptions, 
  drugApprovalOptions 
} from "@/lib/utils/sales-order-utils";

interface ProductInfoFormProps {
  control: Control<SalesOrderUpdateFormValues>;
  disabled?: boolean;
}

export function ProductInfoForm({ control, disabled }: ProductInfoFormProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
        <FormInput
          control={control}
          name="costing"
          label="P Costing"
          placeholder="Enter costing"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="colour"
          label="P Colour"
          placeholder="Enter colour"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="packShort"
          label="P Pack Short"
          placeholder="Enter pack short"
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="tabletType"
          label="P Tablet Type"
          options={tabletTypeOptions}
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="shipperSize"
          label="P Shipper Size"
          options={shipperSizeOptions}
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="flavour"
          label="P Flavour"
          placeholder="Enter flavour"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="inventoryCharges"
          label="P Inventory Charges"
          placeholder="Enter inventory charges"
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="domino"
          label="Domino / Stereo"
          options={pDominoOptions}
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="shipperDrawingRefCode"
          label="P Shipper Drawing Ref Code"
          placeholder="Enter drawing ref code"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="ctnOuterDrawingRefNo"
          label="CTN Outer Drawing Ref No"
          placeholder="Enter outer drawing ref"
          disabled={disabled}
        />

        <FormSelect
          control={control}
          name="shelfLife"
          label="P Shelf Life"
          options={[
            { label: "Select Shelf Life", value: "-1" },
            { label: "12 Months", value: "12" },
            { label: "24 Months", value: "24" },
            { label: "36 Months", value: "36" }
          ]}
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="packingStyleDescription"
          label="Packing Style Description"
          placeholder="Enter packing style"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="tabletSize"
          label="P Tablet Size"
          placeholder="Enter tablet size"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="changePart"
          label="P Change Part"
          placeholder="Enter change part"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="qtyPerShipper"
          label="P Qty Per Shipper"
          placeholder="Enter quantity per shipper"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="noOfShipper"
          label="P No Of Shipper"
          placeholder="Enter number of shippers"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="cylinderPlateCharges"
          label="Cylinder / Plate Charges"
          placeholder="Enter cylinder/plate charges"
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="drugApprovalUnder"
          label="Drug Approval Under"
          options={[
            { label: "Select Drug Approval", value: "-1" },
            { label: "Approval 1", value: "APPROVAL1" },
            { label: "Approval 2", value: "APPROVAL2" }
          ]}
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="pmOuterCtnStock"
          label="PM Outer CTN Stock"
          placeholder="Enter outer CTN stock"
          disabled={disabled}
        />
    </div>
  );
} 