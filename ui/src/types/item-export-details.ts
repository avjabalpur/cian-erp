export interface ItemExportDetails {
  id: number;
  itemCode: string;
  countryOfOrigin?: string;
  harmonizedSystemCode?: string;
  exportLicenseRequired?: boolean;
  eccn?: string; 
}

export type CreateItemExportDetailsData = Omit<ItemExportDetails, 'id'>;

export type UpdateItemExportDetailsData = Partial<CreateItemExportDetailsData>;
