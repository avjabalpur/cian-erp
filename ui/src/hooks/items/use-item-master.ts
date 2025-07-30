import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { ItemMaster, CreateItemMasterData, UpdateItemMasterData, ItemMasterFilter, PaginatedResponse } from '@/types/item-master';

// API Functions
const getItemMasters = async (filter?: ItemMasterFilter): Promise<PaginatedResponse<ItemMaster>> => {
  const params = new URLSearchParams();
  if (filter?.searchTerm) params.append('searchTerm', filter.searchTerm);
  if (filter?.itemCode) params.append('itemCode', filter.itemCode);
  if (filter?.itemName) params.append('itemName', filter.itemName);
  if (filter?.shortName) params.append('shortName', filter.shortName);
  if (filter?.revNo) params.append('revNo', filter.revNo);
  if (filter?.itemTypeId) params.append('itemTypeId', filter.itemTypeId.toString());
  if (filter?.subType) params.append('subType', filter.subType);
  if (filter?.gsInd) params.append('gsInd', filter.gsInd);
  if (filter?.goodsType) params.append('goodsType', filter.goodsType);
  if (filter?.pharmacopoeiaName) params.append('pharmacopoeiaName', filter.pharmacopoeiaName);
  if (filter?.unitOfMeasure) params.append('unitOfMeasure', filter.unitOfMeasure);
  if (filter?.issuingUnit) params.append('issuingUnit', filter.issuingUnit);
  if (filter?.drawingRef) params.append('drawingRef', filter.drawingRef);
  if (filter?.stdAssayStrength) params.append('stdAssayStrength', filter.stdAssayStrength);
  if (filter?.productType) params.append('productType', filter.productType);
  if (filter?.salesDivision) params.append('salesDivision', filter.salesDivision);
  if (filter?.productGroup) params.append('productGroup', filter.productGroup);
  if (filter?.vendorPartNo) params.append('vendorPartNo', filter.vendorPartNo);
  if (filter?.allergen) params.append('allergen', filter.allergen);
  if (filter?.activeIngredient) params.append('activeIngredient', filter.activeIngredient);
  if (filter?.packingFreightInsuranceServices) params.append('packingFreightInsuranceServices', filter.packingFreightInsuranceServices);
  if (filter?.boughtOut !== undefined) params.append('boughtOut', filter.boughtOut.toString());
  if (filter?.jobWork !== undefined) params.append('jobWork', filter.jobWork.toString());
  if (filter?.imported !== undefined) params.append('imported', filter.imported.toString());
  if (filter?.taxCreditApplicable !== undefined) params.append('taxCreditApplicable', filter.taxCreditApplicable.toString());
  if (filter?.manufactured !== undefined) params.append('manufactured', filter.manufactured.toString());
  if (filter?.sold !== undefined) params.append('sold', filter.sold.toString());
  if (filter?.keyProduct !== undefined) params.append('keyProduct', filter.keyProduct.toString());
  if (filter?.exported !== undefined) params.append('exported', filter.exported.toString());
  if (filter?.batchNotApplicable !== undefined) params.append('batchNotApplicable', filter.batchNotApplicable.toString());
  if (filter?.qcRequired !== undefined) params.append('qcRequired', filter.qcRequired.toString());
  if (filter?.mfgDateApplicable !== undefined) params.append('mfgDateApplicable', filter.mfgDateApplicable.toString());
  if (filter?.expiryDateApplicable !== undefined) params.append('expiryDateApplicable', filter.expiryDateApplicable.toString());
  if (filter?.trackSerialNos !== undefined) params.append('trackSerialNos', filter.trackSerialNos.toString());
  if (filter?.mfgLocNameRequired !== undefined) params.append('mfgLocNameRequired', filter.mfgLocNameRequired.toString());
  if (filter?.mfgMmYyyyApplicable !== undefined) params.append('mfgMmYyyyApplicable', filter.mfgMmYyyyApplicable.toString());
  if (filter?.expiryMmYyyyApplicable !== undefined) params.append('expiryMmYyyyApplicable', filter.expiryMmYyyyApplicable.toString());
  if (filter?.principalForStatutoryReporting !== undefined) params.append('principalForStatutoryReporting', filter.principalForStatutoryReporting.toString());
  if (filter?.minUomIssConvFactor) params.append('minUomIssConvFactor', filter.minUomIssConvFactor.toString());
  if (filter?.maxUomIssConvFactor) params.append('maxUomIssConvFactor', filter.maxUomIssConvFactor.toString());
  if (filter?.minUomUqcConvFactor) params.append('minUomUqcConvFactor', filter.minUomUqcConvFactor.toString());
  if (filter?.maxUomUqcConvFactor) params.append('maxUomUqcConvFactor', filter.maxUomUqcConvFactor.toString());
  if (filter?.minShelfLifeMonths) params.append('minShelfLifeMonths', filter.minShelfLifeMonths.toString());
  if (filter?.maxShelfLifeMonths) params.append('maxShelfLifeMonths', filter.maxShelfLifeMonths.toString());
  if (filter?.minShelfLifeDays) params.append('minShelfLifeDays', filter.minShelfLifeDays.toString());
  if (filter?.maxShelfLifeDays) params.append('maxShelfLifeDays', filter.maxShelfLifeDays.toString());
  if (filter?.minStdRate) params.append('minStdRate', filter.minStdRate.toString());
  if (filter?.maxStdRate) params.append('maxStdRate', filter.maxStdRate.toString());
  if (filter?.minLeadTimeDays) params.append('minLeadTimeDays', filter.minLeadTimeDays.toString());
  if (filter?.maxLeadTimeDays) params.append('maxLeadTimeDays', filter.maxLeadTimeDays.toString());
  if (filter?.minStdLossOnDry) params.append('minStdLossOnDry', filter.minStdLossOnDry.toString());
  if (filter?.maxStdLossOnDry) params.append('maxStdLossOnDry', filter.maxStdLossOnDry.toString());
  if (filter?.minSafetyStock) params.append('minSafetyStock', filter.minSafetyStock.toString());
  if (filter?.maxSafetyStock) params.append('maxSafetyStock', filter.maxSafetyStock.toString());
  if (filter?.minEconomicOrderQty) params.append('minEconomicOrderQty', filter.minEconomicOrderQty.toString());
  if (filter?.maxEconomicOrderQty) params.append('maxEconomicOrderQty', filter.maxEconomicOrderQty.toString());
  if (filter?.minDesiredPackSize) params.append('minDesiredPackSize', filter.minDesiredPackSize.toString());
  if (filter?.maxDesiredPackSize) params.append('maxDesiredPackSize', filter.maxDesiredPackSize.toString());
  if (filter?.minAllowedAllergenPercent) params.append('minAllowedAllergenPercent', filter.minAllowedAllergenPercent.toString());
  if (filter?.maxAllowedAllergenPercent) params.append('maxAllowedAllergenPercent', filter.maxAllowedAllergenPercent.toString());
  if (filter?.minStdMfgFeesPerUnit) params.append('minStdMfgFeesPerUnit', filter.minStdMfgFeesPerUnit.toString());
  if (filter?.maxStdMfgFeesPerUnit) params.append('maxStdMfgFeesPerUnit', filter.maxStdMfgFeesPerUnit.toString());
  if (filter?.minConversionFactor) params.append('minConversionFactor', filter.minConversionFactor.toString());
  if (filter?.maxConversionFactor) params.append('maxConversionFactor', filter.maxConversionFactor.toString());
  if (filter?.createdFrom) params.append('createdFrom', filter.createdFrom);
  if (filter?.createdTo) params.append('createdTo', filter.createdTo);
  if (filter?.updatedFrom) params.append('updatedFrom', filter.updatedFrom);
  if (filter?.updatedTo) params.append('updatedTo', filter.updatedTo);
  if (filter?.sortBy) params.append('sortBy', filter.sortBy);
  if (filter?.sortDescending !== undefined) params.append('sortDescending', filter.sortDescending.toString());
  if (filter?.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());
  if (filter?.currentBuyer) params.append('currentBuyer', filter.currentBuyer);
  if (filter?.mainProdCentre) params.append('mainProdCentre', filter.mainProdCentre);
  if (filter?.freightOn) params.append('freightOn', filter.freightOn);

  const { data } = await api.get(`/items?${params.toString()}`);
  return data;
};

const getItemMasterById = async (id: number): Promise<ItemMaster> => {
  const { data } = await api.get(`/items/${id}`);
  return data;
};

const getItemMasterByCode = async (itemCode: string): Promise<ItemMaster> => {
  const { data } = await api.get(`/items/code/${itemCode}`);
  return data;
};

const createItemMaster = async (itemMasterData: CreateItemMasterData): Promise<ItemMaster> => {
  const { data } = await api.post('/items', itemMasterData);
  return data;
};

const updateItemMaster = async (id: number, itemMasterData: UpdateItemMasterData): Promise<ItemMaster> => {
  const { data } = await api.put(`/items/${id}`, itemMasterData);
  return data;
};

const deleteItemMaster = async (id: number): Promise<void> => {
  await api.delete(`/items/${id}`);
};

// React Query Hooks
export const useItemMasters = (filter?: ItemMasterFilter) => {
  return useQuery<PaginatedResponse<ItemMaster>, Error>({
    queryKey: ['item-masters', filter],
    queryFn: () => getItemMasters(filter),
  });
};

export const useItemMasterById = (id: number) => {
  return useQuery<ItemMaster, Error>({
    queryKey: ['item-master', id],
    queryFn: () => getItemMasterById(id),
    enabled: !!id,
  });
};

export const useItemMasterByCode = (itemCode: string) => {
  return useQuery<ItemMaster, Error>({
    queryKey: ['item-master', 'code', itemCode],
    queryFn: () => getItemMasterByCode(itemCode),
    enabled: !!itemCode,
  });
};

export const useCreateItemMaster = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemMaster, Error, CreateItemMasterData>({
    mutationFn: createItemMaster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-masters'] });
    },
  });
};

export const useUpdateItemMaster = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemMaster, Error, { id: number; data: UpdateItemMasterData }>({
    mutationFn: ({ id, data }) => updateItemMaster(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-masters'] });
      queryClient.invalidateQueries({ queryKey: ['item-master', id] });
    },
  });
};

export const useDeleteItemMaster = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItemMaster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-masters'] });
    },
  });
}; 