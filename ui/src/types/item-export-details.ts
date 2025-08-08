export interface ItemExportDetails {
  id: number;
  itemCode: string;
  countryOfOrigin?: string;
  harmonizedSystemCode?: string;
  exportLicenseRequired?: boolean;
  eccn?: string; 
  itemId: number;
  itemDescriptionForExports: string;
  exportProductGroupCode: string;
  exportProductGroupName: string;
  depbRateListSrlNo: string;
  depbRate?: string;
  depbValueCap?: string;
  depbRemarks: string;
  dutyDrawbackSrlNo: string;
  dutyDrawbackRate?: string;
  dutyDrawbackRateType: string;
  dutyDrawbackValueCap?: string;
  dutyDrawbackRemarks: string;
}

export type CreateItemExportDetailsData = Omit<ItemExportDetails, 'id'>;

export type UpdateItemExportDetailsData = Partial<CreateItemExportDetailsData>;
