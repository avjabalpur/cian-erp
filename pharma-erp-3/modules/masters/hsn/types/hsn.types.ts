export interface HsnMaster {
  id: number;
  code: string;
  name: string;
  description?: string;
  hsnType?: string;
  uqc?: string;
  igstRate?: number;
  cgstRate?: number;
  sgstRate?: number;
  cessRate?: number;
  isReverseCharges: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateHsnMasterData = Omit<HsnMaster, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateHsnMasterData = Partial<CreateHsnMasterData>;
