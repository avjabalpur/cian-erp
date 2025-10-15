export interface Dosage {
  id: number;
  name: string;
  registerDate?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateDosageData = Omit<Dosage, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDosageData = Partial<CreateDosageData>;
