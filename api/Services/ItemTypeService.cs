using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Exceptions;
using Xcianify.Core.DTOs;

namespace Xcianify.Services
{
    public class ItemTypeService : IItemTypeService
    {
        private readonly IItemTypeRepository _itemTypeRepository;
        private bool _disposed = false;

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
            return itemType;
        }

        public async Task<PaginatedResult<ItemTypeDto>> GetAllAsync(ItemTypeFilterDto filter)
        {
            ValidateFilter(filter);
            return await _itemTypeRepository.GetAllAsync(filter);
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

            return await _itemTypeRepository.CreateAsync(dto, userId);
        }

        public async Task<ItemTypeDto> UpdateAsync(int id, UpdateItemTypeDto dto, int userId)
        {
            // Check if item type exists
            var existingItemType = await _itemTypeRepository.GetByIdAsync(id);
            if (existingItemType == null)
            {
                throw new NotFoundException("Item type not found");
            }

            ValidateUpdateDto(dto);

            // Check if new code is already taken by another record
            if (dto.Code != null && dto.Code != existingItemType.Code)
            {
                if (await _itemTypeRepository.ExistsAsync(dto.Code, id))
                {
                    throw new ValidationException("Item type code already exists");
                }
            }

            // If parent type is being updated, verify it exists and doesn't create a circular reference
            if (dto.ParentTypeId.HasValue && dto.ParentTypeId != existingItemType.ParentTypeId)
            {
                // Check if the new parent exists
                var parentType = await _itemTypeRepository.GetByIdAsync(dto.ParentTypeId.Value);
                if (parentType == null)
                {
                    throw new ValidationException("Parent item type not found");
                }

            }

            return await _itemTypeRepository.UpdateAsync(id, dto, userId);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            // Check if item type exists
            var existingItemType = await _itemTypeRepository.GetByIdAsync(id);
            if (existingItemType == null)
            {
                throw new NotFoundException("Item type not found");
            }

            // Check if there are any child item types
            var filter = new ItemTypeFilterDto 
            { 
                PageNumber = 1, 
                PageSize = 1,
                SearchTerm = "",
                IsActive = null
            };
            
            var childItems = await _itemTypeRepository.GetAllAsync(filter);
            if (childItems.TotalCount > 0)
            {
                throw new ValidationException("Cannot delete item type that has child types. Please delete or reassign the child types first.");
            }

            // Add any additional business rules for deletion here
            // For example, check if the item type is being used by any items

            return await _itemTypeRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<ItemTypeDto>> GetParentTypesAsync()
        {
            return await _itemTypeRepository.GetParentTypesAsync();
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
                throw new ValidationException("Item type data is required");
            }

            if (string.IsNullOrWhiteSpace(dto.Code))
            {
                throw new ValidationException("Item type code is required");
            }

            if (dto.Code.Length > 10)
            {
                throw new ValidationException("Item type code cannot exceed 10 characters");
            }

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ValidationException("Item type name is required");
            }

            if (dto.Name.Length > 100)
            {
                throw new ValidationException("Item type name cannot exceed 100 characters");
            }
        }

        private void ValidateUpdateDto(UpdateItemTypeDto dto)
        {
            if (dto == null)
            {
                throw new ValidationException("Item type data is required");
            }

            if (dto.Code != null && string.IsNullOrWhiteSpace(dto.Code))
            {
                throw new ValidationException("Item type code cannot be empty");
            }

            if (dto.Code != null && dto.Code.Length > 10)
            {
                throw new ValidationException("Item type code cannot exceed 10 characters");
            }

            if (dto.Name != null && string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ValidationException("Item type name cannot be empty");
            }

            if (dto.Name != null && dto.Name.Length > 100)
            {
                throw new ValidationException("Item type name cannot exceed 100 characters");
            }
        }
    }
}
