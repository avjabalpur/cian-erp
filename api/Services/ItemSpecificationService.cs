using System;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;
using Xcianify.Core.Mappers;

namespace Xcianify.Services
{
    public class ItemSpecificationService : IItemSpecificationService
    {
        private readonly IItemSpecificationRepository _itemSpecificationRepository;
        private readonly IItemMasterRepository _itemMasterRepository;
        private readonly ItemSpecificationMapper _mapper;

        public ItemSpecificationService(
            IItemSpecificationRepository itemSpecificationRepository,
            IItemMasterRepository itemMasterRepository,
            ItemSpecificationMapper mapper)
        {
            _itemSpecificationRepository = itemSpecificationRepository ?? throw new ArgumentNullException(nameof(itemSpecificationRepository));
            _itemMasterRepository = itemMasterRepository ?? throw new ArgumentNullException(nameof(itemMasterRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<ItemSpecificationDto> GetByItemIdAsync(int itemId)
        {
            var item = await _itemMasterRepository.GetByIdAsync(itemId);
            if (item == null)
                return null;

            var specification = await _itemSpecificationRepository.GetByItemIdAsync(itemId);
            return _mapper.MapToDto(specification);
        }

        public async Task<ItemSpecificationDto> CreateAsync(CreateItemSpecificationDto createDto, int userId)
        {
            var item = await _itemMasterRepository.GetByIdAsync(createDto.ItemId);
            if (item == null)
                throw new ArgumentException("Item not found");

            var specification = _mapper.MapToEntity(createDto);
            specification.ItemId = createDto.ItemId;
            specification.CreatedBy = userId;
            specification.UpdatedBy = userId;
            specification.CreatedAt = DateTime.UtcNow;
            specification.UpdatedAt = DateTime.UtcNow;

            await _itemSpecificationRepository.CreateAsync(specification);
            return _mapper.MapToDto(specification);
        }

        public async Task<ItemSpecificationDto> UpdateAsync(int itemId, UpdateItemSpecificationDto updateDto, int userId)
        {
            var item = await _itemMasterRepository.GetByIdAsync(itemId);
            if (item == null)
                throw new ArgumentException("Item not found");

            var existingSpecification = await _itemSpecificationRepository.GetByItemIdAsync(itemId);
            if (existingSpecification == null)
                throw new ArgumentException("Specification not found");

            var specification = _mapper.MapToEntity(updateDto);
            specification.Id = existingSpecification.Id;
            specification.ItemId = itemId;
            specification.CreatedBy = existingSpecification.CreatedBy;
            specification.CreatedAt = existingSpecification.CreatedAt;
            specification.UpdatedBy = userId;
            specification.UpdatedAt = DateTime.UtcNow;

            await _itemSpecificationRepository.UpdateAsync(specification);
            return _mapper.MapToDto(specification);
        }

        public async Task<bool> DeleteAsync(int itemId)
        {
            var item = await _itemMasterRepository.GetByIdAsync(itemId);
            if (item == null)
                return false;

            var specification = await _itemSpecificationRepository.GetByItemIdAsync(itemId);
            if (specification == null)
                return false;

            await _itemSpecificationRepository.DeleteAsync(itemId);
            return true;
        }
    }
} 