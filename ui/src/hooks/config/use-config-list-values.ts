import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { ConfigListValue, CreateConfigListValueData, UpdateConfigListValueData, ConfigListValueFilter, PaginatedResponse } from '@/types/config-list';

// API Functions
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
  const { data } = await api.get(`/config-list/${listId}/values/all`);
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

// React Query Hooks
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