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
          name="composition"
          label="P Composition"
          placeholder="Enter composition"
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
          name="drugApprovalUnder"
          label="Drug Approval Under"
          options={drugApprovalOptions}
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="packingStyleDescription"
          label="Packing Style Description"
          placeholder="Enter packing style"
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="tabletSize"
          label="P Tablet Size"
          options={tabletSizeOptions}
          disabled={disabled}
        />
        
        <FormSelect
          control={control}
          name="changePart"
          label="P Change Part"
          options={changePartOptions}
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
          name="cylinderCharge"
          label="Cylinder Charge"
          placeholder="Enter cylinder charge"
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
        
        <FormInput
          control={control}
          name="plateCharges"
          label="Plate Charges"
          placeholder="Enter plate charges"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="stereo"
          label="Stereo"
          placeholder="Enter stereo"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="fragrance"
          label="Fragrance"
          placeholder="Enter fragrance"
          disabled={disabled}
        />
        
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
          name="capsuleSize"
          label="Capsule Size"
          placeholder="Enter capsule size"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="ctnInnerDrawingRefNo"
          label="CTN Inner Drawing Ref No"
          placeholder="Enter inner drawing ref"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="foilDrawingRefNo"
          label="Foil Drawing Ref No"
          placeholder="Enter foil drawing ref"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="leafletDrawingRefNo"
          label="Leaflet Drawing Ref No"
          placeholder="Enter leaflet drawing ref"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="tubeDrawingRefNo"
          label="Tube Drawing Ref No"
          placeholder="Enter tube drawing ref"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="labelDrawingRefNo"
          label="Label Drawing Ref No"
          placeholder="Enter label drawing ref"
          disabled={disabled}
        />
        
        <FormInput
          control={control}
          name="pmInnerCtnStock"
          label="PM Inner CTN Stock"
          placeholder="Enter inner CTN stock"
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
  );
} 