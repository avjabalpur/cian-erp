import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { ConfigSetting, CreateConfigSettingData, UpdateConfigSettingData, ConfigSettingFilter } from '../types/config-setting';

// --- API Functions ---

const getConfigSettings = async (params?: { 
  pageNumber?: number; 
  pageSize?: number; 
  searchTerm?: string; 
  isActive?: boolean; 
  columnFilters?: any[];
  sorting?: any[];
  globalFilter?: string;
}): Promise<{ items: ConfigSetting[]; totalCount: number; pageCount: number }> => {
  const { data } = await api.get('/config-settings', { params });
  return data;
};

const getConfigSettingById = async (id: number): Promise<ConfigSetting | null> => {
  if (!id) return null;
  const { data } = await api.get(`/config-settings/${id}`);
  return data;
};

const getConfigSettingByKey = async (settingKey: string): Promise<ConfigSetting | null> => {
  if (!settingKey) return null;
  const { data } = await api.get(`/config-settings/key/${settingKey}`);
  return data;
};

const createConfigSetting = async (configSettingData: CreateConfigSettingData): Promise<ConfigSetting> => {
  const { data } = await api.post('/config-settings', configSettingData);
  return data;
};

const updateConfigSetting = async ({ id, data: configSettingData }: { id: number; data: UpdateConfigSettingData }): Promise<ConfigSetting> => {
  const { data } = await api.put(`/config-settings/${id}`, configSettingData);
  return data;
};

const deleteConfigSetting = async (id: number): Promise<void> => {
  await api.delete(`/config-settings/${id}`);
};

// --- Custom Hooks ---

export const useConfigSettings = ({ 
  pageNumber = 1, 
  pageSize = 10, 
  searchTerm, 
  isActive, 
  columnFilters, 
  sorting, 
  globalFilter 
}: any = {}) => {
  return useQuery<{ items: ConfigSetting[]; totalCount: number; pageCount: number }, Error>({
    queryKey: ['configSettings', { pageNumber, pageSize, searchTerm, isActive, columnFilters, sorting, globalFilter }],
    queryFn: () => getConfigSettings({ pageNumber, pageSize, searchTerm, isActive, columnFilters, sorting, globalFilter }),
  });
};

export const useConfigSettingById = (id: number) => {
  return useQuery<ConfigSetting | null, Error>({
    queryKey: ['configSetting', id],
    queryFn: () => getConfigSettingById(id),
    enabled: !!id,
  });
};

export const useConfigSettingByKey = (settingKey: string) => {
  return useQuery<ConfigSetting | null, Error>({
    queryKey: ['configSetting-by-key', settingKey],
    queryFn: () => getConfigSettingByKey(settingKey),
    enabled: !!settingKey,
  });
};

export const useCreateConfigSetting = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfigSetting, Error, CreateConfigSettingData>({
    mutationFn: createConfigSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configSettings'] });
    },
  });
};

export const useUpdateConfigSetting = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfigSetting, Error, { id: number; data: UpdateConfigSettingData }>({ 
    mutationFn: updateConfigSetting,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['configSettings'] });
      queryClient.invalidateQueries({ queryKey: ['configSetting', variables.id] });
    },
  });
};

export const useDeleteConfigSetting = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteConfigSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configSettings'] });
    },
  });
}; 