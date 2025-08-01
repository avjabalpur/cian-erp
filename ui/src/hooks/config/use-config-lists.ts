import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { ConfigList, CreateConfigListData, UpdateConfigListData, ConfigListFilter, PaginatedResponse } from '@/types/config-list';

// API Functions
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

// React Query Hooks
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