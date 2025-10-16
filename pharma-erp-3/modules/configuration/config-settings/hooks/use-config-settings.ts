import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  ConfigSetting,
  CreateConfigSettingData,
  UpdateConfigSettingData,
  ConfigSettingFilter,
} from '../types';
import { PaginatedResponse } from '@/types/common';

// --- API Functions ---
const getConfigSettings = async (filter?: ConfigSettingFilter): Promise<PaginatedResponse<ConfigSetting>> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/config-settings?${params.toString()}`);
  return data;
};

const getConfigSettingById = async (id: number): Promise<ConfigSetting> => {
  const { data } = await api.get(`/config-settings/${id}`);
  return data;
};

const getConfigSettingByKey = async (settingKey: string): Promise<ConfigSetting> => {
  const { data } = await api.get(`/config-settings/key/${settingKey}`);
  return data;
};

const createConfigSetting = async (configSettingData: CreateConfigSettingData): Promise<ConfigSetting> => {
  const { data } = await api.post('/config-settings', configSettingData);
  return data;
};

const updateConfigSetting = async (id: number, configSettingData: UpdateConfigSettingData): Promise<ConfigSetting> => {
  const { data } = await api.put(`/config-settings/${id}`, configSettingData);
  return data;
};

const deleteConfigSetting = async (id: number): Promise<void> => {
  await api.delete(`/config-settings/${id}`);
};

// --- React Query Hooks ---
export const useConfigSettings = (filter?: ConfigSettingFilter) => {
  return useQuery<PaginatedResponse<ConfigSetting>, Error>({
    queryKey: ['config-settings', filter],
    queryFn: () => getConfigSettings(filter),
  });
};

export const useConfigSettingById = (id: number) => {
  return useQuery<ConfigSetting, Error>({
    queryKey: ['config-setting', id],
    queryFn: () => getConfigSettingById(id),
    enabled: !!id,
  });
};

export const useConfigSettingByKey = (settingKey: string) => {
  return useQuery<ConfigSetting, Error>({
    queryKey: ['config-setting-by-key', settingKey],
    queryFn: () => getConfigSettingByKey(settingKey),
    enabled: !!settingKey,
  });
};

export const useCreateConfigSetting = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfigSetting, Error, CreateConfigSettingData>({
    mutationFn: createConfigSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config-settings'] });
    },
  });
};

export const useUpdateConfigSetting = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfigSetting, Error, { id: number; data: UpdateConfigSettingData }>({
    mutationFn: ({ id, data }) => updateConfigSetting(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['config-settings'] });
      queryClient.invalidateQueries({ queryKey: ['config-setting', id] });
    },
  });
};

export const useDeleteConfigSetting = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteConfigSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config-settings'] });
    },
  });
};

