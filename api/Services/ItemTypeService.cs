using AutoMapper;
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
        private readonly IMapper _mapper;

        public ItemTypeService(
            IItemTypeRepository itemTypeRepository,
            IMapper mapper)
        {
            _itemTypeRepository = itemTypeRepository ?? throw new ArgumentNullException(nameof(itemTypeRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<ItemTypeDto> GetByIdAsync(int id)
        {
            var itemType = await _itemTypeRepository.GetByIdAsync(id);
            if (itemType == null)
            {
                throw new NotFoundException("Item type not found");
            }
            return _mapper.Map<ItemTypeDto>(itemType);
        }

        public async Task<PaginatedResult<ItemTypeDto>> GetAllAsync(ItemTypeFilterDto filter)
        {
            var (items, totalCount) = await _itemTypeRepository.GetAllAsync(filter);
            var dtos = _mapper.Map<IEnumerable<ItemTypeDto>>(items).ToList();
            
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

            var itemType = _mapper.Map<ItemType>(dto);
            itemType.CreatedAt = DateTime.UtcNow;
            itemType.UpdatedAt = DateTime.UtcNow;
            itemType.CreatedBy = userId;
            itemType.UpdatedBy = userId;

            var created = await _itemTypeRepository.AddAsync(itemType);
            return _mapper.Map<ItemTypeDto>(created);
        }

        public async Task<ItemTypeDto> UpdateAsync(int id, UpdateItemTypeDto dto, int userId)
        {
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

            _mapper.Map(dto, itemType);
            itemType.UpdatedBy = userId;
            itemType.UpdatedAt = DateTime.UtcNow;

            await _itemTypeRepository.UpdateAsync(itemType);
            return _mapper.Map<ItemTypeDto>(itemType);
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
            return _mapper.Map<IEnumerable<ItemTypeDto>>(parentTypes);
        }

    }
}
