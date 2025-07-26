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
    public class ItemStockAnalysisService : IItemStockAnalysisService
    {
        private readonly IItemStockAnalysisRepository _stockAnalysisRepository;
        private readonly IItemMasterRepository _itemMasterRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<ItemStockAnalysisService> _logger;

        public ItemStockAnalysisService(
            IItemStockAnalysisRepository stockAnalysisRepository,
            IItemMasterRepository itemMasterRepository,
            IMapper mapper,
            ILogger<ItemStockAnalysisService> logger)
        {
            _stockAnalysisRepository = stockAnalysisRepository ?? throw new ArgumentNullException(nameof(stockAnalysisRepository));
            _itemMasterRepository = itemMasterRepository ?? throw new ArgumentNullException(nameof(itemMasterRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<ItemStockAnalysisDto> GetByItemIdAsync(int itemId)
        {
            try
            {
                var stockAnalysis = await _stockAnalysisRepository.GetByItemMasterIdAsync(itemId);
                if (stockAnalysis == null)
                    throw new NotFoundException("Stock analysis not found for the specified item");

                return _mapper.Map<ItemStockAnalysisDto>(stockAnalysis);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting stock analysis for item ID: {itemId}");
                throw;
            }
        }

        public async Task<ItemStockAnalysisDto> CreateAsync(CreateItemStockAnalysisDto dto, int userId)
        {
            try
            {
                // Verify item master exists
                var itemMaster = await _itemMasterRepository.GetByIdAsync(dto.ItemId);
                if (itemMaster == null)
                    throw new ValidationException("Item master not found");

                // Check if stock analysis already exists for this item
                if (await _stockAnalysisRepository.ExistsForItemMasterAsync(dto.ItemId))
                    throw new ValidationException("Stock analysis already exists for this item");

                var stockAnalysis = _mapper.Map<ItemStockAnalysis>(dto);
                stockAnalysis.CreatedBy = userId;
                stockAnalysis.UpdatedBy = userId;
                stockAnalysis.CreatedAt = DateTime.UtcNow;
                stockAnalysis.UpdatedAt = DateTime.UtcNow;

                var createdAnalysis = await _stockAnalysisRepository.CreateAsync(stockAnalysis);
                return _mapper.Map<ItemStockAnalysisDto>(createdAnalysis);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating stock analysis");
                throw;
            }
        }

        public async Task<ItemStockAnalysisDto> UpdateAsync(int id, UpdateItemStockAnalysisDto dto, int userId)
        {
            try
            {
                // Get existing stock analysis
                var existingAnalysis = await _stockAnalysisRepository.GetByIdAsync(id);
                if (existingAnalysis == null)
                    throw new NotFoundException("Stock analysis not found");

                // Update fields from DTO
                _mapper.Map(dto, existingAnalysis);
                existingAnalysis.UpdatedBy = userId;
                existingAnalysis.UpdatedAt = DateTime.UtcNow;

                var success = await _stockAnalysisRepository.UpdateAsync(existingAnalysis);
                if (!success)
                    throw new ApplicationException("Failed to update stock analysis");

                return _mapper.Map<ItemStockAnalysisDto>(existingAnalysis);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating stock analysis ID: {id}");
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                // Verify stock analysis exists
                var existingAnalysis = await _stockAnalysisRepository.GetByIdAsync(id);
                if (existingAnalysis == null)
                    throw new NotFoundException("Stock analysis not found");

                return await _stockAnalysisRepository.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting stock analysis ID: {id}");
                throw;
            }
        }
    }
}
