export interface HsnMaster {
  id: number;
  hsnCode: string;
  description: string;
  gstRate: number;
  isActive: boolean;
}

export type CreateHsnMasterData = Omit<HsnMaster, 'id' | 'isActive'>;

export type UpdateHsnMasterData = Partial<CreateHsnMasterData>;
