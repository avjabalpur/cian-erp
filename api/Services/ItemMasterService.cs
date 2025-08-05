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
                item.CreatedAt = DateTime.UtcNow;
                item.CreatedBy = 1; // TODO: Get from current user context
                item.UpdatedBy = 1; 

                var createdItem = await _itemMasterRepository.AddAsync(item);

                // Create specification if provided
                if (createDto.Specification != null)
                {
                    var specification = _mapper.Map<ItemSpecification>(createDto.Specification);
                    specification.Id = createdItem.Id;
                    specification.ItemId = 1;
                   // specification.CreatedBy = 1; // TODO: Get from current user context
                   // specification.UpdatedBy = 1;
                   // specification.CreatedAt = DateTime.UtcNow;
                  //  specification.UpdatedAt = DateTime.UtcNow;
                    
                    await _itemSpecificationRepository.CreateAsync(specification);
                }

                scope.Complete();
                return await GetItemByIdAsync(createdItem.Id);
            }
            catch (Exception)
            {
                // Transaction will be rolled back when scope is disposed
                throw;
            }
        }

        public async Task<ItemMasterDto> UpdateItemAsync(int id, UpdateItemMasterDto updateDto)
        {
            var existingItem = await _itemMasterRepository.GetByIdAsync(id);
            if (existingItem == null)
            {
                throw new NotFoundException("Item not found");
            }

            // Check if item code already exists (excluding current item)
            if (await _itemMasterRepository.ItemCodeExistsAsync(updateDto.ItemCode))
            {
                throw new ValidationException("An item with this code already exists.");
            }

            using var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
            
            try
            {
                // Update the item master
                var item = _mapper.Map<ItemMaster>(updateDto);
                item.Id = id;
                item.UpdatedAt = DateTime.UtcNow;
                item.UpdatedBy = 1; // TODO: Get from current user context

                await _itemMasterRepository.UpdateAsync(item);

                // Update specification if provided
                if (updateDto.Specification != null)
                {
                    var specification = _mapper.Map<ItemSpecification>(updateDto.Specification);
                    specification.Id = item.Id;
                    specification.UpdatedBy = 1; // TODO: Get from current user context
                    specification.UpdatedAt = DateTime.UtcNow;
                    
                    await _itemSpecificationRepository.UpdateAsync(specification);
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
