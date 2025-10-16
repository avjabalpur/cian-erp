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

export interface CreateConfigSettingData {
  settingKey: string;
  settingName: string;
  description?: string;
  stringValue?: string;
  integerValue?: number;
  booleanValue?: boolean;
  decimalValue?: number;
  defaultValue?: string;
  isActive: boolean;
}

export type UpdateConfigSettingData = Partial<CreateConfigSettingData>;

export interface ConfigSettingFilter {
  search?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

