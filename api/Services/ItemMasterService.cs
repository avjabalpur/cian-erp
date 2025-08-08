using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Exceptions;
using System.Transactions;
using Xcianify.Core.Model;
using System.Linq;

namespace Xcianify.Services
{
    public class ItemMasterService : IItemMasterService
    {
        private readonly IItemMasterRepository _itemMasterRepository;
        private readonly IItemSpecificationRepository _itemSpecificationRepository;
        private readonly IItemSalesDetailService _itemSalesDetailService;
        private readonly IItemExportDetailsService _itemExportDetailsService;
        private readonly IItemStockAnalysisService _itemStockAnalysisService;
        private readonly IItemBoughtOutDetailsService _itemBoughtOutDetailsService;
        private readonly IItemOtherDetailsService _itemOtherDetailsService;
        private readonly IItemMediaService _itemMediaService;
        private readonly IMapper _mapper;

        public ItemMasterService(
            IItemMasterRepository itemMasterRepository,
            IItemSpecificationRepository itemSpecificationRepository,
            IItemSalesDetailService itemSalesDetailService,
            IItemExportDetailsService itemExportDetailsService,
            IItemStockAnalysisService itemStockAnalysisService,
            IItemBoughtOutDetailsService itemBoughtOutDetailsService,
            IItemOtherDetailsService itemOtherDetailsService,
            IItemMediaService itemMediaService,
            IMapper mapper)
        {
            _itemMasterRepository = itemMasterRepository ?? throw new ArgumentNullException(nameof(itemMasterRepository));
            _itemSpecificationRepository = itemSpecificationRepository ?? throw new ArgumentNullException(nameof(itemSpecificationRepository));
            _itemSalesDetailService = itemSalesDetailService ?? throw new ArgumentNullException(nameof(itemSalesDetailService));
            _itemExportDetailsService = itemExportDetailsService ?? throw new ArgumentNullException(nameof(itemExportDetailsService));
            _itemStockAnalysisService = itemStockAnalysisService ?? throw new ArgumentNullException(nameof(itemStockAnalysisService));
            _itemBoughtOutDetailsService = itemBoughtOutDetailsService ?? throw new ArgumentNullException(nameof(itemBoughtOutDetailsService));
            _itemOtherDetailsService = itemOtherDetailsService ?? throw new ArgumentNullException(nameof(itemOtherDetailsService));
            _itemMediaService = itemMediaService ?? throw new ArgumentNullException(nameof(itemMediaService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<(IEnumerable<ItemMasterDto> Items, int TotalCount)> GetAllItemsAsync(ItemMasterFilterDto filter)
        {
            var (items, totalCount) = await _itemMasterRepository.GetAllAsync(filter);
            var itemDtos = _mapper.Map<IEnumerable<ItemMasterDto>>(items).ToList();
            
            // Get specification data for each item
            foreach (var itemDto in itemDtos)
            {
                var specification = await _itemSpecificationRepository.GetByItemIdAsync(itemDto.Id);
                if (specification != null)
                {
                    itemDto.Specification = _mapper.Map<ItemSpecificationDto>(specification);
                }
            }
            
            return (itemDtos, totalCount);
        }

        public async Task<ItemMasterDto> GetItemByIdAsync(int id)
        {
            var item = await _itemMasterRepository.GetByIdAsync(id);
            if (item == null)
                return null;

            var itemDto = _mapper.Map<ItemMasterDto>(item);
            
            // Get all related data
            var specification = await _itemSpecificationRepository.GetByItemIdAsync(id);
            if (specification != null)
            {
                itemDto.Specification = _mapper.Map<ItemSpecificationDto>(specification);
            }

            var salesDetail = await _itemSalesDetailService.GetByItemIdAsync(id);
            if (salesDetail != null)
            {
                itemDto.SalesDetail = salesDetail;
            }

            var exportDetails = await _itemExportDetailsService.GetByItemIdAsync(id);
            if (exportDetails != null && exportDetails.Any())
            {
                itemDto.ExportDetails = exportDetails.First();
            }

            var stockAnalysis = await _itemStockAnalysisService.GetByItemIdAsync(id);
            if (stockAnalysis != null)
            {
                itemDto.StockAnalysis = stockAnalysis;
            }

            var boughtOutDetails = await _itemBoughtOutDetailsService.GetByItemIdAsync(id);
            if (boughtOutDetails != null)
            {
                itemDto.BoughtOutDetails = boughtOutDetails;
            }

            var otherDetails = await _itemOtherDetailsService.GetByItemIdAsync(id);
            if (otherDetails != null && otherDetails.Any())
            {
                itemDto.OtherDetails = otherDetails.First();
            }

            var media = await _itemMediaService.GetByItemIdAsync(id);
            if (media != null && media.Any())
            {
                itemDto.Media = media.ToList();
            }
            
            return itemDto;
        }

        public async Task<ItemMasterDto> GetItemByCodeAsync(string itemCode)
        {
            var item = await _itemMasterRepository.GetByItemCodeAsync(itemCode);
            if (item == null)
                return null;

            var itemDto = _mapper.Map<ItemMasterDto>(item);
            
            // Get specification data
            var specification = await _itemSpecificationRepository.GetByItemIdAsync(item.Id);
            if (specification != null)
            {
                itemDto.Specification = _mapper.Map<ItemSpecificationDto>(specification);
            }
            
            return itemDto;
        }

        public async Task<ItemMasterDto> CreateItemAsync(CreateItemMasterDto createDto, int userId)
        {
            // Check if item code already exists
            if (await _itemMasterRepository.ItemCodeExistsAsync(createDto.ItemCode))
            {
                throw new ValidationException("An item with this code already exists.");
            }

            using var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
            
            try
            {
                // Create the item master
                var item = _mapper.Map<ItemMaster>(createDto);
                item.CreatedAt = DateTime.UtcNow;
                item.UpdatedAt = DateTime.UtcNow;
                item.CreatedBy = userId; // TODO: Get from current user context
                item.UpdatedBy = userId; 

                var createdItem = await _itemMasterRepository.AddAsync(item);

                // Create specification if provided
                if (createDto.Specification != null)
                {
                    var specification = _mapper.Map<ItemSpecification>(createDto.Specification);
                    specification.ItemId = createdItem.Id;
                    specification.CreatedBy = userId; // TODO: Get from current user context
                    specification.UpdatedBy = userId;
                    specification.CreatedAt = DateTime.UtcNow;
                    specification.UpdatedAt = DateTime.UtcNow;
                    
                    await _itemSpecificationRepository.CreateAsync(specification);
                }

                // Create sales detail if provided
                if (createDto.SalesDetail != null)
                {
                    createDto.SalesDetail.ItemId = createdItem.Id;
                    await _itemSalesDetailService.CreateAsync(createDto.SalesDetail, userId);
                }

                // Create export details if provided
                if (createDto.ExportDetails != null)
                {
                    createDto.ExportDetails.ItemId = createdItem.Id;
                    await _itemExportDetailsService.CreateAsync(createDto.ExportDetails, userId);
                }

                // Create stock analysis if provided
                if (createDto.StockAnalysis != null)
                {
                    createDto.StockAnalysis.ItemId = createdItem.Id;
                    await _itemStockAnalysisService.CreateAsync(createDto.StockAnalysis, userId);
                }

                // Create bought out details if provided
                if (createDto.BoughtOutDetails != null)
                {
                    createDto.BoughtOutDetails.ItemId = createdItem.Id;
                    await _itemBoughtOutDetailsService.CreateAsync(createDto.BoughtOutDetails, userId);
                }

                // Create other details if provided
                if (createDto.OtherDetails != null)
                {
                    createDto.OtherDetails.ItemId = createdItem.Id;
                    await _itemOtherDetailsService.CreateAsync(createDto.OtherDetails, userId);
                }

                // Create media if provided
                if (createDto.Media != null)
                {
                    createDto.Media.ItemId = createdItem.Id;
                    await _itemMediaService.CreateAsync(createDto.Media, userId);
                }
               
                // Get the created item without related data to avoid exceptions
                var result = _mapper.Map<ItemMasterDto>(createdItem);
                
                scope.Complete();
                return result;
                
            }
            catch (Exception)
            {
                // Transaction will be rolled back when scope is disposed
                throw;
            }
        }

        public async Task<ItemMasterDto> UpdateItemAsync(int id, UpdateItemMasterDto updateDto, int userId)
        {
            var existingItem = await _itemMasterRepository.GetByIdAsync(id);
            if (existingItem == null)
            {
                throw new NotFoundException("Item not found");
            }

            // Check if item code already exists (excluding current item)
            //if (await _itemMasterRepository.ItemCodeExistsAsync(updateDto.ItemCode) && existingItem.ItemCode != updateDto.ItemCode)
            //{
            //    throw new ValidationException("An item with this code already exists.");
            //}

            using var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
            
            try
            {
                // Update the item master
                var item = _mapper.Map<ItemMaster>(updateDto);
                item.Id = id;
                item.UpdatedAt = DateTime.UtcNow;
                item.UpdatedBy = userId; // TODO: Get from current user context

                await _itemMasterRepository.UpdateAsync(item);

                // Update specification if provided
                if (updateDto.Specification != null)
                {
                    var existingSpecification = await _itemSpecificationRepository.GetByItemIdAsync(id);
                    
                    if (existingSpecification == null)
                    {
                        // Create new specification if it doesn't exist
                        var specification = _mapper.Map<ItemSpecification>(updateDto.Specification);
                        specification.ItemId = id;
                        specification.CreatedBy = userId; // TODO: Get from current user context
                        specification.UpdatedBy = userId;
                        specification.CreatedAt = DateTime.UtcNow;
                        specification.UpdatedAt = DateTime.UtcNow;
                        
                        await _itemSpecificationRepository.CreateAsync(specification);
                    }
                    else
                    {
                        // Update existing specification
                        var specification = _mapper.Map<ItemSpecification>(updateDto.Specification);
                        specification.Id = existingSpecification.Id;
                        specification.ItemId = id;
                        specification.UpdatedBy = userId; // TODO: Get from current user context
                        specification.UpdatedAt = DateTime.UtcNow;
                        
                        await _itemSpecificationRepository.UpdateAsync(specification);
                    }
                }

                // Get the updated item before completing the transaction
                var result = await GetItemByIdAsync(id);
                
                scope.Complete();
                return result;
            }
            catch (Exception)
            {
                // Transaction will be rolled back when scope is disposed
                throw;
            }
        }

        public async Task DeleteItemAsync(int id)
        {
            var item = await _itemMasterRepository.GetByIdAsync(id);
            if (item == null)
            {
                throw new NotFoundException("Item not found");
            }

            await _itemMasterRepository.DeleteAsync(id);
        }
    }
}
