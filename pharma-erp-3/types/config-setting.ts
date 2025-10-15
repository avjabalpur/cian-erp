export interface ConfigSetting {
  id: number;
  settingKey: string;
  settingName: string;
  description?: string;
  stringValue?: string;
  integerValue?: number;
  booleanValue?: boolean;
  decimalValue?: number;
  defaultValue?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

export type CreateConfigSettingData = Omit<ConfigSetting, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;

export type UpdateConfigSettingData = Partial<CreateConfigSettingData> & { id: number };

export interface ConfigSettingFilter {
  search?: string;
  page?: number;
  pageSize?: number;
  isActive?: boolean;
} 