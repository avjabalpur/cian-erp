using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Exceptions;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class ItemSalesDetailService : IItemSalesDetailService
    {
        private readonly IItemSalesDetailRepository _salesDetailRepository;
        private readonly IItemMasterRepository _itemMasterRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<ItemSalesDetailService> _logger;

        public ItemSalesDetailService(
            IItemSalesDetailRepository salesDetailRepository,
            IItemMasterRepository itemMasterRepository,
            IMapper mapper,
            ILogger<ItemSalesDetailService> logger)
        {
            _salesDetailRepository = salesDetailRepository ?? throw new ArgumentNullException(nameof(salesDetailRepository));
            _itemMasterRepository = itemMasterRepository ?? throw new ArgumentNullException(nameof(itemMasterRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<ItemSalesDetailDto> GetByItemIdAsync(int itemMasterId)
        {
            try
            {
                var salesDetail = await _salesDetailRepository.GetByItemMasterIdAsync(itemMasterId);
                if (salesDetail == null)
                    throw new NotFoundException("Sales detail not found for the specified item");

                return _mapper.Map<ItemSalesDetailDto>(salesDetail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting sales detail for item master ID: {itemMasterId}");
                throw;
            }
        }

        public async Task<ItemSalesDetailDto> CreateAsync(CreateItemSalesDetailDto dto, int userId)
        {
            try
            {
                // Verify item master exists
                var itemMaster = await _itemMasterRepository.GetByIdAsync(dto.ItemId);
                if (itemMaster == null)
                    throw new ValidationException("Item master not found");

                // Check if sales detail already exists for this item
                if (await _salesDetailRepository.ExistsForItemMasterAsync(dto.ItemId))
                    throw new ValidationException("Sales detail already exists for this item");

                var salesDetail = _mapper.Map<ItemSalesDetail>(dto);
                salesDetail.CreatedBy = userId;
                salesDetail.UpdatedBy = userId;
                salesDetail.CreatedAt = DateTime.UtcNow;
                salesDetail.UpdatedAt = DateTime.UtcNow;

                var createdDetail = await _salesDetailRepository.CreateAsync(salesDetail);
                return _mapper.Map<ItemSalesDetailDto>(createdDetail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating sales detail");
                throw;
            }
        }

        public async Task<ItemSalesDetailDto> UpdateAsync(int id, UpdateItemSalesDetailDto dto, int userId)
        {
            try
            {
                // Get existing sales detail
                var existingDetail = await _salesDetailRepository.GetByIdAsync(id);
                if (existingDetail == null)
                    throw new NotFoundException("Sales detail not found");

                // Update fields from DTO
                _mapper.Map(dto, existingDetail);
                existingDetail.UpdatedBy = userId;
                existingDetail.UpdatedAt = DateTime.UtcNow;

                var success = await _salesDetailRepository.UpdateAsync(existingDetail);
                if (!success)
                    throw new ApplicationException("Failed to update sales detail");

                return _mapper.Map<ItemSalesDetailDto>(existingDetail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating sales detail ID: {id}");
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                // Verify sales detail exists
                var existingDetail = await _salesDetailRepository.GetByIdAsync(id);
                if (existingDetail == null)
                    throw new NotFoundException("Sales detail not found");

                return await _salesDetailRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting sales detail ID: {id}");
                throw;
            }
        }
    }
}
