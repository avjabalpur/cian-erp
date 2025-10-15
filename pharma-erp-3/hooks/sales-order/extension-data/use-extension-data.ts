import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';
import { PropertyPair } from '@/types/property';

// Types for extension data
export interface ExtensionDataPayload {
  entityType: string;
  entityTypeId: number;
  propertyKey: string;
  propertyLabel: string;
  propertyDescription?: string;
  propertyValue?: string;
}

export interface ExtensionDataResponse {
  id: number;
  entityType: string;
  entityTypeId: number;
  propertyKey: string;
  propertyLabel: string;
  propertyDescription?: string;
  propertyValue?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

// API Functions
const getExtensionDataByEntity = async (entityType: string, entityTypeId: number): Promise<ExtensionDataResponse[]> => {
  const { data } = await api.get(`/extension-data?entityType=${entityType}&entityTypeId=${entityTypeId}`);
  return data;
};

const createExtensionData = async (payload: ExtensionDataPayload): Promise<ExtensionDataResponse> => {
  const { data } = await api.post('/extension-data', payload);
  return data;
};

const updateExtensionData = async (id: number, payload: Partial<ExtensionDataPayload>): Promise<ExtensionDataResponse> => {
  const { data } = await api.put(`/extension-data/${id}`, payload);
  return data;
};

const deleteExtensionData = async (id: number): Promise<void> => {
  await api.delete(`/extension-data/${id}`);
};

// React Query Hooks
export const useExtensionDataByEntity = (entityType: string, entityTypeId: number) => {
  return useQuery<ExtensionDataResponse[], Error>({
    queryKey: ['extension-data', entityType, entityTypeId],
    queryFn: () => getExtensionDataByEntity(entityType, entityTypeId),
    enabled: !!entityType && !!entityTypeId,
  });
};

export const useCreateExtensionData = () => {
  const queryClient = useQueryClient();
  return useMutation<ExtensionDataResponse, Error, ExtensionDataPayload>({
    mutationFn: createExtensionData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['extension-data', data.entityType, data.entityTypeId] 
      });
    },
  });
};

export const useUpdateExtensionData = () => {
  const queryClient = useQueryClient();
  return useMutation<ExtensionDataResponse, Error, { id: number; data: Partial<ExtensionDataPayload> }>({
    mutationFn: ({ id, data }) => updateExtensionData(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['extension-data', data.entityType, data.entityTypeId] 
      });
    },
  });
};

export const useDeleteExtensionData = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: number; entityType: string; entityTypeId: number }>({
    mutationFn: ({ id }) => deleteExtensionData(id),
    onSuccess: (_, { entityType, entityTypeId }) => {
      queryClient.invalidateQueries({ 
        queryKey: ['extension-data', entityType, entityTypeId] 
      });
    },
  });
};
