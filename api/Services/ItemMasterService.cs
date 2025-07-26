using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Exceptions;
using System.Transactions;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class ItemMasterService : IItemMasterService
    {
        private readonly IItemMasterRepository _itemMasterRepository;
        private readonly IItemSpecificationRepository _itemSpecificationRepository;
        private readonly IMapper _mapper;

        public ItemMasterService(
            IItemMasterRepository itemMasterRepository,
            IItemSpecificationRepository itemSpecificationRepository,
            IMapper mapper)
        {
            _itemMasterRepository = itemMasterRepository ?? throw new ArgumentNullException(nameof(itemMasterRepository));
            _itemSpecificationRepository = itemSpecificationRepository ?? throw new ArgumentNullException(nameof(itemSpecificationRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<(IEnumerable<ItemMasterDto> Items, int TotalCount)> GetAllItemsAsync(ItemMasterFilterDto filter)
        {
            var (items, totalCount) = await _itemMasterRepository.GetAllAsync(filter);
            return (_mapper.Map<IEnumerable<ItemMasterDto>>(items), totalCount);
        }

        public async Task<ItemMasterDto> GetItemByIdAsync(int id)
        {
            var item = await _itemMasterRepository.GetByIdAsync(id);
            return _mapper.Map<ItemMasterDto>(item);
        }

        public async Task<ItemMasterDto> GetItemByCodeAsync(string itemCode)
        {
            var item = await _itemMasterRepository.GetByItemCodeAsync(itemCode);
           
            return _mapper.Map<ItemMasterDto>(item);
        }

        public async Task<ItemMasterDto> CreateItemAsync(CreateItemMasterDto createDto)
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
                item.CreatedOn = DateTime.UtcNow;
                item.CreatedBy = 1; // TODO: Get from current user context
                item.UpdatedBy = 1; 

                var itemId = await _itemMasterRepository.CreateAsync(item);

                // Create specification if provided
                if (createDto.Specification != null)
                {
                    var specification = _mapper.Map<ItemSpecification>(createDto.Specification);
                    specification.ItemCode = createDto.ItemCode;
                    specification.CreatedBy = 1; // TODO: Get from current user context
                    specification.UpdatedBy = 1;
                    specification.CreatedAt = DateTime.UtcNow;
                    specification.UpdatedAt = DateTime.UtcNow;
                    
                    await _itemSpecificationRepository.CreateAsync(specification);
                }

                scope.Complete();
                return await GetItemByIdAsync(itemId);
            }
            catch (Exception)
            {
                // Transaction will be rolled back when scope is disposed
                throw;
            }
        }

        public async Task<ItemMasterDto> UpdateItemAsync(int id, UpdateItemMasterDto updateDto)
        {
            // Check if item exists
            var existingItem = await _itemMasterRepository.GetByIdAsync(id);
            if (existingItem == null)
                throw new NotFoundException("Item not found");

            // Check if the new item code is already taken by another item
            if (updateDto.ItemCode != existingItem.ItemCode && 
                await _itemMasterRepository.ItemCodeExistsAsync(updateDto.ItemCode))
            {
                throw new ValidationException("An item with this code already exists.");
            }

            using var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
            
            try
            {
                // Map the DTO to the existing item
                _mapper.Map(updateDto, existingItem);
                existingItem.UpdatedBy = 1; // TODO: Get from current user context
                existingItem.UpdatedAt = DateTime.UtcNow;

                // Update the item master
                var success = await _itemMasterRepository.UpdateAsync(existingItem);
                if (!success)
                    throw new ApplicationException("Failed to update item");

                // Handle specification update
                if (updateDto.Specification != null)
                {
                    var existingSpec = await _itemSpecificationRepository.GetByItemCodeAsync(existingItem.ItemCode);
                    
                    if (existingSpec != null)
                    {
                        // Update existing specification
                        _mapper.Map(updateDto.Specification, existingSpec);
                        existingSpec.UpdatedBy = 1; // TODO: Get from current user context
                        existingSpec.UpdatedAt = DateTime.UtcNow;
                        await _itemSpecificationRepository.UpdateAsync(existingSpec);
                    }
                    else
                    {
                        // Create new specification
                        var newSpec = _mapper.Map<ItemSpecification>(updateDto.Specification);
                        newSpec.ItemCode = existingItem.ItemCode;
                        newSpec.CreatedBy = 1; // TODO: Get from current user context
                        newSpec.UpdatedBy = 1;
                        newSpec.CreatedAt = DateTime.UtcNow;
                        newSpec.UpdatedAt = DateTime.UtcNow;
                        await _itemSpecificationRepository.CreateAsync(newSpec);
                    }
                }

                scope.Complete();
                return await GetItemByIdAsync(id);
            }
            catch (Exception)
            {
                // Transaction will be rolled back when scope is disposed
                throw;
            }
        }

        public async Task<bool> DeleteItemAsync(int id)
        {
            // Check if item exists
            var existingItem = await _itemMasterRepository.GetByIdAsync(id);
            if (existingItem == null)
                throw new NotFoundException("Item not found");

            using var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
            
            try
            {
                // Delete the specification first (due to foreign key constraint)
                var specification = await _itemSpecificationRepository.GetByItemCodeAsync(existingItem.ItemCode);
                if (specification != null)
                {
                    await _itemSpecificationRepository.DeleteAsync(existingItem.ItemCode);
                }

                // Then delete the item
                var result = await _itemMasterRepository.DeleteAsync(id);
                
                scope.Complete();
                return result;
            }
            catch (Exception)
            {
                // Transaction will be rolled back when scope is disposed
                throw;
            }
        }
    }
}
