import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { ConfigList, CreateConfigListData, UpdateConfigListData, ConfigListFilter, PaginatedResponse, ConfigListValue, CreateConfigListValueData, UpdateConfigListValueData, ConfigListValueFilter } from '@/types/config-list';

// API Functions for Config Lists
const getConfigLists = async (filter?: ConfigListFilter): Promise<PaginatedResponse<ConfigList>> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());
  if (filter?.sortBy) params.append('sortBy', filter.sortBy);
  if (filter?.sortOrder) params.append('sortOrder', filter.sortOrder);

  const { data } = await api.get(`/config-list?${params.toString()}`);
  return data;
};

const getConfigListById = async (id: number): Promise<ConfigList> => {
  const { data } = await api.get(`/config-list/${id}`);
  return data;
};

const createConfigList = async (configListData: CreateConfigListData): Promise<ConfigList> => {
  const { data } = await api.post('/config-list', configListData);
  return data;
};

const updateConfigList = async (id: number, configListData: UpdateConfigListData): Promise<ConfigList> => {
  const { data } = await api.put(`/config-list/${id}`, configListData);
  return data;
};

const deleteConfigList = async (id: number): Promise<void> => {
  await api.delete(`/config-list/${id}`);
};

// API Functions for Config List Values
const getConfigListValues = async (filter?: ConfigListValueFilter): Promise<PaginatedResponse<ConfigListValue>> => {
  const params = new URLSearchParams();
  if (filter?.listId) params.append('listId', filter.listId.toString());
  if (filter?.search) params.append('search', filter.search);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());
  if (filter?.sortBy) params.append('sortBy', filter.sortBy);
  if (filter?.sortOrder) params.append('sortOrder', filter.sortOrder);

  const { data } = await api.get(`/config-list/values?${params.toString()}`);
  return data;
};

const getConfigListValuesByListId = async (listId: number): Promise<ConfigListValue[]> => {
  const { data } = await api.get(`/config-list/${listId}/values`);
  return data;
};

const getConfigListValuesByListCode = async (listCode: string): Promise<ConfigListValue[]> => {
  const { data } = await api.get(`/config-list/${listCode.toLowerCase()}/code/values`);
  return data;
};

const getConfigListValueById = async (id: number): Promise<ConfigListValue> => {
  const { data } = await api.get(`/config-list/values/${id}`);
  return data;
};

const createConfigListValue = async (configListValueData: CreateConfigListValueData): Promise<ConfigListValue> => {
  const { data } = await api.post('/config-list/values', configListValueData);
  return data;
};

const updateConfigListValue = async (id: number, configListValueData: UpdateConfigListValueData): Promise<ConfigListValue> => {
  const { data } = await api.put(`/config-list/values/${id}`, configListValueData);
  return data;
};

const deleteConfigListValue = async (id: number): Promise<void> => {
  await api.delete(`/config-list/values/${id}`);
};

// React Query Hooks for Config Lists
export const useConfigLists = (filter?: ConfigListFilter) => {
  return useQuery<PaginatedResponse<ConfigList>, Error>({
    queryKey: ['config-lists', filter],
    queryFn: () => getConfigLists(filter),
  });
};

export const useConfigListById = (id: number) => {
  return useQuery<ConfigList, Error>({
    queryKey: ['config-list', id],
    queryFn: () => getConfigListById(id),
    enabled: !!id,
  });
};

export const useCreateConfigList = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfigList, Error, CreateConfigListData>({
    mutationFn: createConfigList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config-lists'] });
    },
  });
};

export const useUpdateConfigList = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfigList, Error, { id: number; data: UpdateConfigListData }>({
    mutationFn: ({ id, data }) => updateConfigList(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['config-lists'] });
      queryClient.invalidateQueries({ queryKey: ['config-list', id] });
    },
  });
};

export const useDeleteConfigList = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteConfigList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config-lists'] });
    },
  });
};

// React Query Hooks for Config List Values
export const useConfigListValues = (filter?: ConfigListValueFilter) => {
  return useQuery<PaginatedResponse<ConfigListValue>, Error>({
    queryKey: ['config-list-values', filter],
    queryFn: () => getConfigListValues(filter),
  });
};

export const useConfigListValuesByListId = (listId: number) => {
  return useQuery<ConfigListValue[], Error>({
    queryKey: ['config-list-values', listId],
    queryFn: () => getConfigListValuesByListId(listId),
    enabled: !!listId,
  });
};

export const useConfigListValuesByListCode = (listCode: string) => {
  return useQuery<ConfigListValue[], Error>({
    queryKey: ['config-list-values-by-code', listCode],
    queryFn: () => getConfigListValuesByListCode(listCode),
    enabled: !!listCode,
  });
};

export const useConfigListValueById = (id: number) => {
  return useQuery<ConfigListValue, Error>({
    queryKey: ['config-list-value', id],
    queryFn: () => getConfigListValueById(id),
    enabled: !!id,
  });
};

export const useCreateConfigListValue = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfigListValue, Error, CreateConfigListValueData>({
    mutationFn: createConfigListValue,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['config-list-values'] });
      queryClient.invalidateQueries({ queryKey: ['config-list-values', variables.listId] });
    },
  });
};

export const useUpdateConfigListValue = () => {
  const queryClient = useQueryClient();
  return useMutation<ConfigListValue, Error, { id: number; data: UpdateConfigListValueData }>({
    mutationFn: ({ id, data }) => updateConfigListValue(id, data),
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: ['config-list-values'] });
      queryClient.invalidateQueries({ queryKey: ['config-list-values', data.listId] });
      queryClient.invalidateQueries({ queryKey: ['config-list-value', id] });
    },
  });
};

export const useDeleteConfigListValue = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteConfigListValue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config-list-values'] });
    },
  });
}; 