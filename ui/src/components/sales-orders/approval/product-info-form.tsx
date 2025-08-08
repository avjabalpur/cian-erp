"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Control, useWatch } from "react-hook-form";
import { FormInput } from "@/components/shared/forms/form-input";
import { FormSelect } from "@/components/shared/forms/form-select";
import { FormTextarea } from "@/components/shared/forms/form-textarea";
import { SalesOrderUpdateFormValues } from "@/validations/sales-order";
import { SalesOrderOptionsMaster } from "@/lib/constants/sales-order-options";

interface ProductInfoFormProps {
  control: Control<SalesOrderUpdateFormValues>;
  disabled?: boolean;
  permissions?: any;
  currentStatus?: string;
}

export function ProductInfoForm({ control, disabled, permissions, currentStatus }: ProductInfoFormProps) {
  // Watch form values for conditional logic
  const dosageName = useWatch({ control, name: "dosageName" });

  // Check if field should be readonly based on permissions and status
  const isFieldReadonly = (fieldName: string) => {
    if (disabled) return true;
    
    // Check if status is ADDED-TO-PROGEN
    if (currentStatus === "ADDED-TO-PROGEN") return true;
    
    // Check permissions
    if (!permissions?.admin) {
      // BD users can only edit certain fields
      if (permissions?.bd) {
        const bdBlockedFields = [
          'pShipperSize', 'pQtyPerShipper', 'pNoOfShipper', 'pDomino', 
          'pShipperDrawingRefCode', 'ctnOuterDrawingRefNo', 'ctnInnerDrawingRefNo', 
          'foilDrawingRefNo', 'leafletDrawingRefNo', 'tubeDrawingRefNo', 
          'labelDrawingRefNo', 'pmOuterCtnStock', 'pmInnerCtnStock', 
          'pmFoilStock', 'pmLeafletStock', 'pmTubeStock', 'pmLabelStock'
        ];
        if (bdBlockedFields.includes(fieldName)) return true;
      }
      
      // Costing admin can only edit certain fields
      if (permissions?.costing_admin) {
        const costingFields = [
          'pColour', 'pShelfLife', 'pTabletSize', 'pCapsuleSize', 'pCosting'
        ];
        if (!costingFields.includes(fieldName)) return true;
      }
      
      // Progen data entry can only edit certain fields
      if (permissions?.progen_data_entry) {
        const progenFields = [
          'pShipperSize', 'pQtyPerShipper', 'pNoOfShipper', 'pDomino'
        ];
        if (!progenFields.includes(fieldName)) return true;
      }
      
      // Design admin can only edit certain fields
      if (permissions?.design_admin) {
        const designFields = [
          'division', 'designUnder', 'pShipperDrawingRefCode', 
          'ctnOuterDrawingRefNo', 'ctnInnerDrawingRefNo', 'foilDrawingRefNo',
          'leafletDrawingRefNo', 'tubeDrawingRefNo', 'labelDrawingRefNo'
        ];
        if (!designFields.includes(fieldName)) return true;
      }
      
      // PM admin can only edit certain fields
      if (permissions?.pm_admin) {
        const pmFields = [
          'pmOuterCtnStock', 'pmInnerCtnStock', 'pmFoilStock', 
          'pmLeafletStock', 'pmTubeStock', 'pmLabelStock'
        ];
        if (!pmFields.includes(fieldName)) return true;
      }
    }
    
    return false;
  };

  // Check if field should be visible based on dosage
  const isFieldVisible = (fieldName: string) => {
    if (!dosageName) return true;
    
    const dosageVisibilityMap: Record<string, Record<string, boolean>> = {
      pColour: {
        TABLET: true, CAPSULE: true, LIQUID: true, OINTMENT: true, 
        POWDER: true, SOFTGEL: true
      },
      pShelfLife: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pPackShort: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      packingStyleDescription: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pTabletType: { TABLET: true, SOFTGEL: true },
      pTabletSize: { TABLET: true, SOFTGEL: true },
      pCapsuleSize: { CAPSULE: true, SOFTGEL: true },
      pChangePart: { TABLET: true, CAPSULE: true, SOFTGEL: true },
      pShipperSize: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pQtyPerShipper: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pNoOfShipper: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pFlavour: { TABLET: true, LIQUID: true, POWDER: true },
      pFragrance: { TABLET: true, LIQUID: true, POWDER: true },
      pQuantity: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pFocQty: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pMrp: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pBillingRate: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pCosting: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pInventoryCharges: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pCylinderCharge: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pDomino: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pShipperDrawingRefCode: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      ctnOuterDrawingRefNo: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      ctnInnerDrawingRefNo: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      foilDrawingRefNo: { TABLET: true, CAPSULE: true, SOFTGEL: true },
      leafletDrawingRefNo: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      tubeDrawingRefNo: { GEL: true, OINTMENT: true, CREAM: true },
      labelDrawingRefNo: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pmOuterCtnStock: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pmInnerCtnStock: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pmFoilStock: { TABLET: true, CAPSULE: true, SOFTGEL: true },
      pmLeafletStock: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      pmTubeStock: { GEL: true, OINTMENT: true, CREAM: true },
      pmLabelStock: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      },
      drugApprovalUnder: {
        TABLET: true, GEL: true, CAPSULE: true, LIQUID: true, 
        OINTMENT: true, POWDER: true, CREAM: true, SOFTGEL: true
      }
    };
    
    const fieldVisibility = dosageVisibilityMap[fieldName];
    return fieldVisibility ? fieldVisibility[dosageName] || false : true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>
          Product specifications and details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quantity and Pricing */}
        {isFieldVisible('pQuantity') && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormInput
              control={control}
              name="pQuantity"
              label="P Quantity"
              placeholder="Enter quantity"
              disabled={isFieldReadonly('pQuantity')}
              type="number"
            />
            
            <FormInput
              control={control}
              name="pFocQty"
              label="P FOC Qty"
              placeholder="Enter FOC quantity"
              disabled={isFieldReadonly('pFocQty')}
              type="number"
            />
            
            <FormInput
              control={control}
              name="pBillingRate"
              label="P Billing Rate"
              placeholder="Enter billing rate"
              disabled={isFieldReadonly('pBillingRate')}
              type="number"
            />
            
            <FormInput
              control={control}
              name="pMrp"
              label="P MRP"
              placeholder="Enter MRP"
              disabled={isFieldReadonly('pMrp')}
              type="number"
            />
          </div>
        )}

        {/* Costing */}
        {isFieldVisible('pCosting') && (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <FormInput
              control={control}
              name="pCosting"
              label="P Costing"
              placeholder="Enter costing"
              disabled={isFieldReadonly('pCosting')}
              type="number"
            />
          </div>
        )}

        {/* Product Specifications */}
        {isFieldVisible('pColour') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="pColour"
              label="P Colour"
              placeholder="Enter colour"
              disabled={isFieldReadonly('pColour')}
            />
            
            <FormSelect
              control={control}
              name="pShelfLife"
              label="P Shelf Life"
              options={SalesOrderOptionsMaster.shelfLife}
              disabled={isFieldReadonly('pShelfLife')}
            />
          </div>
        )}

        {/* Packing Information */}
        {isFieldVisible('pPackShort') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="pPackShort"
              label="P Pack Short"
              placeholder="Enter pack short"
              disabled={isFieldReadonly('pPackShort')}
            />
            
            <FormInput
              control={control}
              name="packingStyleDescription"
              label="Packing Style Description"
              placeholder="Enter packing style"
              disabled={isFieldReadonly('packingStyleDescription')}
            />
          </div>
        )}

        {/* Tablet/Capsule Specifications */}
        {isFieldVisible('pTabletType') && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormSelect
              control={control}
              name="pTabletType"
              label="P Tablet Type"
              options={SalesOrderOptionsMaster.tabletTypes}
              disabled={isFieldReadonly('pTabletType')}
            />
            
            <FormSelect
              control={control}
              name="pTabletSize"
              label="P Tablet Size"
              options={SalesOrderOptionsMaster.tabletSizes}
              disabled={isFieldReadonly('pTabletSize')}
            />
            
            <FormSelect
              control={control}
              name="pCapsuleSize"
              label="P Capsule Size"
              options={SalesOrderOptionsMaster.capsuleSizes}
              disabled={isFieldReadonly('pCapsuleSize')}
            />
            
            <FormInput
              control={control}
              name="pChangePart"
              label="P Change Part"
              placeholder="Enter change part"
              disabled={isFieldReadonly('pChangePart')}
            />
          </div>
        )}

        {/* Shipper Information */}
        {isFieldVisible('pShipperSize') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect
              control={control}
              name="pShipperSize"
              label="P Shipper Size"
              options={SalesOrderOptionsMaster.shipperSizes}
              disabled={isFieldReadonly('pShipperSize')}
            />
            
            <FormInput
              control={control}
              name="pQtyPerShipper"
              label="P Qty Per Shipper"
              placeholder="Enter quantity per shipper"
              disabled={isFieldReadonly('pQtyPerShipper')}
              type="number"
            />
            
            <FormInput
              control={control}
              name="pNoOfShipper"
              label="P No Of Shipper"
              placeholder="Enter number of shippers"
              disabled={isFieldReadonly('pNoOfShipper')}
              type="number"
            />
          </div>
        )}

        {/* Flavour and Fragrance */}
        {isFieldVisible('pFlavour') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              control={control}
              name="pFlavour"
              label="P Flavour"
              options={SalesOrderOptionsMaster.flavours}
              disabled={isFieldReadonly('pFlavour')}
            />
            
            <FormSelect
              control={control}
              name="pFragrance"
              label="P Fragrance"
              options={SalesOrderOptionsMaster.fragrances}
              disabled={isFieldReadonly('pFragrance')}
            />
          </div>
        )}

        {/* Charges */}
        {isFieldVisible('pInventoryCharges') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name="pInventoryCharges"
              label="P Inventory Charges"
              placeholder="Enter inventory charges"
              disabled={isFieldReadonly('pInventoryCharges')}
              type="number"
            />
            
            <FormInput
              control={control}
              name="pCylinderCharge"
              label="Cylinder Charge"
              placeholder="Enter cylinder charge"
              disabled={isFieldReadonly('pCylinderCharge')}
              type="number"
            />
            
            <FormInput
              control={control}
              name="pPlateCharges"
              label="Plate Charges"
              placeholder="Enter plate charges"
              disabled={isFieldReadonly('pPlateCharges')}
              type="number"
            />
          </div>
        )}

        {/* Domino/Stereo */}
        {isFieldVisible('pDomino') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              control={control}
              name="pDomino"
              label="Domino / Stereo"
              options={SalesOrderOptionsMaster.domino}
              disabled={isFieldReadonly('pDomino')}
            />
            
            <FormInput
              control={control}
              name="pStereo"
              label="Stereo"
              placeholder="Enter stereo"
              disabled={isFieldReadonly('pStereo')}
            />
          </div>
        )}

        {/* Drawing References */}
        {isFieldVisible('pShipperDrawingRefCode') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="pShipperDrawingRefCode"
              label="P Shipper Drawing Ref Code"
              placeholder="Enter drawing ref code"
              disabled={isFieldReadonly('pShipperDrawingRefCode')}
            />
            
            <FormSelect
              control={control}
              name="drugApprovalUnder"
              label="Drug Approval Under"
              options={SalesOrderOptionsMaster.manufacturerName}
              disabled={isFieldReadonly('drugApprovalUnder')}
            />
          </div>
        )}

        {/* CTN Drawing References */}
        {isFieldVisible('ctnOuterDrawingRefNo') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="ctnOuterDrawingRefNo"
              label="CTN Outer Drawing Ref No"
              placeholder="Enter outer drawing ref"
              disabled={isFieldReadonly('ctnOuterDrawingRefNo')}
            />
            
            <FormInput
              control={control}
              name="pmOuterCtnStock"
              label="PM Outer CTN Stock"
              placeholder="Enter outer CTN stock"
              disabled={isFieldReadonly('pmOuterCtnStock')}
              type="number"
            />
          </div>
        )}

        {isFieldVisible('ctnInnerDrawingRefNo') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="ctnInnerDrawingRefNo"
              label="CTN Inner Drawing Ref No"
              placeholder="Enter inner drawing ref"
              disabled={isFieldReadonly('ctnInnerDrawingRefNo')}
            />
            
            <FormInput
              control={control}
              name="pmInnerCtnStock"
              label="PM Inner CTN Stock"
              placeholder="Enter inner CTN stock"
              disabled={isFieldReadonly('pmInnerCtnStock')}
              type="number"
            />
          </div>
        )}

        {/* Foil Drawing Reference */}
        {isFieldVisible('foilDrawingRefNo') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="foilDrawingRefNo"
              label="Foil Drawing Ref No"
              placeholder="Enter foil drawing ref"
              disabled={isFieldReadonly('foilDrawingRefNo')}
            />
            
            <FormInput
              control={control}
              name="pmFoilStock"
              label="PM Foil Stock"
              placeholder="Enter foil stock"
              disabled={isFieldReadonly('pmFoilStock')}
              type="number"
            />
          </div>
        )}

        {/* Leaflet Drawing Reference */}
        {isFieldVisible('leafletDrawingRefNo') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="leafletDrawingRefNo"
              label="Leaflet Drawing Ref No"
              placeholder="Enter leaflet drawing ref"
              disabled={isFieldReadonly('leafletDrawingRefNo')}
            />
            
            <FormInput
              control={control}
              name="pmLeafletStock"
              label="PM Leaflet Stock"
              placeholder="Enter leaflet stock"
              disabled={isFieldReadonly('pmLeafletStock')}
              type="number"
            />
          </div>
        )}

        {/* Tube Drawing Reference */}
        {isFieldVisible('tubeDrawingRefNo') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="tubeDrawingRefNo"
              label="Tube Drawing Ref No"
              placeholder="Enter tube drawing ref"
              disabled={isFieldReadonly('tubeDrawingRefNo')}
            />
            
            <FormInput
              control={control}
              name="pmTubeStock"
              label="PM Tube Stock"
              placeholder="Enter tube stock"
              disabled={isFieldReadonly('pmTubeStock')}
              type="number"
            />
          </div>
        )}

        {/* Label Drawing Reference */}
        {isFieldVisible('labelDrawingRefNo') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={control}
              name="labelDrawingRefNo"
              label="Label Drawing Ref No"
              placeholder="Enter label drawing ref"
              disabled={isFieldReadonly('labelDrawingRefNo')}
            />
            
            <FormInput
              control={control}
              name="pmLabelStock"
              label="PM Label Stock"
              placeholder="Enter label stock"
              disabled={isFieldReadonly('pmLabelStock')}
              type="number"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
} 