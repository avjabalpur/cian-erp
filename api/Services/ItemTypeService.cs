using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Exceptions;
using Xcianify.Core.DTOs;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class ItemTypeService : IItemTypeService
    {
        private readonly IItemTypeRepository _itemTypeRepository;

        public ItemTypeService(IItemTypeRepository itemTypeRepository)
        {
            _itemTypeRepository = itemTypeRepository ?? throw new ArgumentNullException(nameof(itemTypeRepository));
        }

        public async Task<ItemTypeDto> GetByIdAsync(int id)
        {
            var itemType = await _itemTypeRepository.GetByIdAsync(id);
            if (itemType == null)
            {
                throw new NotFoundException("Item type not found");
            }
            return MapToDto(itemType);
        }

        public async Task<PaginatedResult<ItemTypeDto>> GetAllAsync(ItemTypeFilterDto filter)
        {
            ValidateFilter(filter);
            var (items, totalCount) = await _itemTypeRepository.GetAllAsync(filter);
            var dtos = items.Select(MapToDto).ToList();
            
            return new PaginatedResult<ItemTypeDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<ItemTypeDto> CreateAsync(CreateItemTypeDto dto, int userId)
        {
            ValidateCreateDto(dto);
            
            // Check if item type code already exists
            if (await _itemTypeRepository.ExistsAsync(dto.Code))
            {
                throw new ValidationException("Item type code already exists");
            }

            // If parent type is specified, verify it exists
            if (dto.ParentTypeId.HasValue)
            {
                var parentType = await _itemTypeRepository.GetByIdAsync(dto.ParentTypeId.Value);
                if (parentType == null)
                {
                    throw new ValidationException("Parent item type not found");
                }
            }

            var itemType = new ItemType
            {
                Code = dto.Code,
                Name = dto.Name,
                Description = dto.Description,
                ParentTypeId = dto.ParentTypeId,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedBy = userId,
                UpdatedBy = userId
            };

            var created = await _itemTypeRepository.AddAsync(itemType);
            return MapToDto(created);
        }

        public async Task<ItemTypeDto> UpdateAsync(int id, UpdateItemTypeDto dto, int userId)
        {
            ValidateUpdateDto(dto);
            
            var itemType = await _itemTypeRepository.GetByIdAsync(id);
            if (itemType == null)
            {
                throw new NotFoundException("Item type not found");
            }

            // Check if item type code already exists (excluding current record)
            if (await _itemTypeRepository.ExistsAsync(dto.Code, id))
            {
                throw new ValidationException("Item type code already exists");
            }

            // If parent type is specified, verify it exists
            if (dto.ParentTypeId.HasValue)
            {
                var parentType = await _itemTypeRepository.GetByIdAsync(dto.ParentTypeId.Value);
                if (parentType == null)
                {
                    throw new ValidationException("Parent item type not found");
                }
            }

            itemType.Code = dto.Code;
            itemType.Name = dto.Name;
            itemType.Description = dto.Description;
            itemType.ParentTypeId = dto.ParentTypeId;
            if (dto.IsActive.HasValue)
            {
                itemType.IsActive = dto.IsActive.Value;
            }
            itemType.UpdatedBy = userId;

            await _itemTypeRepository.UpdateAsync(itemType);
            return MapToDto(itemType);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var itemType = await _itemTypeRepository.GetByIdAsync(id);
            if (itemType == null)
            {
                throw new NotFoundException("Item type not found");
            }

            await _itemTypeRepository.DeleteAsync(id);
            return true;
        }

        public async Task<IEnumerable<ItemTypeDto>> GetParentTypesAsync()
        {
            var parentTypes = await _itemTypeRepository.GetParentTypesAsync();
            return parentTypes.Select(MapToDto);
        }

        private void ValidateFilter(ItemTypeFilterDto filter)
        {
            if (filter == null)
            {
                throw new ValidationException("Filter cannot be null");
            }

            if (filter.PageNumber < 1)
            {
                throw new ValidationException("Page number must be greater than 0");
            }

            if (filter.PageSize < 1 || filter.PageSize > 100)
            {
                throw new ValidationException("Page size must be between 1 and 100");
            }
        }

        private void ValidateCreateDto(CreateItemTypeDto dto)
        {
            if (dto == null)
            {
                throw new ValidationException("Item type data cannot be null");
            }

            if (string.IsNullOrWhiteSpace(dto.Code))
            {
                throw new ValidationException("Item type code is required");
            }

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ValidationException("Item type name is required");
            }
        }

        private void ValidateUpdateDto(UpdateItemTypeDto dto)
        {
            if (dto == null)
            {
                throw new ValidationException("Item type data cannot be null");
            }

            if (string.IsNullOrWhiteSpace(dto.Code))
            {
                throw new ValidationException("Item type code is required");
            }

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ValidationException("Item type name is required");
            }
        }

        private ItemTypeDto MapToDto(ItemType itemType)
        {
            if (itemType == null) return null;
            
            return new ItemTypeDto
            {
                Id = itemType.Id,
                Code = itemType.Code,
                Name = itemType.Name,
                Description = itemType.Description,
                ParentTypeId = itemType.ParentTypeId,
                IsActive = itemType.IsActive,
                CreatedAt = itemType.CreatedAt,
                UpdatedAt = itemType.UpdatedAt,
                CreatedBy = itemType.CreatedBy,
                UpdatedBy = itemType.UpdatedBy
            };
        }
    }
}
