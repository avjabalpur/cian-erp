using System;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;
using Xcianify.Core.Mappers;
using Xcianify.Core.DTOs.ItemBoughtOut;

namespace Xcianify.Services
{
    public class ItemBoughtOutDetailsService : IItemBoughtOutDetailsService
    {
        private readonly IItemBoughtOutDetailsRepository _itemBoughtOutDetailsRepository;
        private readonly IItemMasterRepository _itemMasterRepository;
        private readonly ItemBoughtOutDetailsMapper _mapper;

        public ItemBoughtOutDetailsService(
            IItemBoughtOutDetailsRepository itemBoughtOutDetailsRepository,
            IItemMasterRepository itemMasterRepository,
            ItemBoughtOutDetailsMapper mapper)
        {
            _itemBoughtOutDetailsRepository = itemBoughtOutDetailsRepository ?? throw new ArgumentNullException(nameof(itemBoughtOutDetailsRepository));
            _itemMasterRepository = itemMasterRepository ?? throw new ArgumentNullException(nameof(itemMasterRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<ItemBoughtOutDetailsDto> GetByItemIdAsync(int itemId)
        {
            var item = await _itemMasterRepository.GetByIdAsync(itemId);
            if (item == null)
                return null;

            var boughtOutDetails = await _itemBoughtOutDetailsRepository.GetByItemIdAsync(itemId);
            return _mapper.MapToDto(boughtOutDetails);
        }

        public async Task<ItemBoughtOutDetailsDto> GetByIdAsync(int id)
        {
            var boughtOutDetails = await _itemBoughtOutDetailsRepository.GetByIdAsync(id);
            return _mapper.MapToDto(boughtOutDetails);
        }

        public async Task<ItemBoughtOutDetailsDto> CreateAsync(CreateItemBoughtOutDetailsDto createDto, int userId)
        {
            var item = await _itemMasterRepository.GetByIdAsync(createDto.ItemId);
            if (item == null)
                throw new ArgumentException("Item not found");

            var boughtOutDetails = _mapper.MapToEntity(createDto);
            boughtOutDetails.ItemId = createDto.ItemId;
            boughtOutDetails.CreatedBy = userId;
            boughtOutDetails.UpdatedBy = userId;
            boughtOutDetails.CreatedAt = DateTime.UtcNow;
            boughtOutDetails.UpdatedAt = DateTime.UtcNow;

            var result = await _itemBoughtOutDetailsRepository.CreateAsync(boughtOutDetails);
            return _mapper.MapToDto(result);
        }

        public async Task<ItemBoughtOutDetailsDto> UpdateAsync(int id, UpdateItemBoughtOutDetailsDto updateDto, int userId)
        {
            var existingDetails = await _itemBoughtOutDetailsRepository.GetByIdAsync(id);
            if (existingDetails == null)
                throw new ArgumentException("Bought out details not found");

            var boughtOutDetails = _mapper.MapToEntity(updateDto);
            boughtOutDetails.Id = id;
            boughtOutDetails.ItemId = existingDetails.ItemId;
            boughtOutDetails.CreatedBy = existingDetails.CreatedBy; // Preserve original creator
            boughtOutDetails.CreatedAt = existingDetails.CreatedAt; // Preserve original creation date
            boughtOutDetails.UpdatedBy = userId;
            boughtOutDetails.UpdatedAt = DateTime.UtcNow;

            var success = await _itemBoughtOutDetailsRepository.UpdateAsync(boughtOutDetails);
            if (!success)
                throw new InvalidOperationException("Failed to update bought out details");

            return _mapper.MapToDto(boughtOutDetails);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _itemBoughtOutDetailsRepository.DeleteAsync(id);
        }
    }
} 