using AutoMapper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs.SalesOrder;
using Xcianify.Core.Model;
using Xcianify.Core.Exceptions;

namespace Xcianify.Services
{
    public class SalesOrderPerformaInvoiceItemService : ISalesOrderPerformaInvoiceItemService
    {
        private readonly ISalesOrderPerformaInvoiceItemRepository _itemRepository;
        private readonly IMapper _mapper;

        public SalesOrderPerformaInvoiceItemService(
            ISalesOrderPerformaInvoiceItemRepository itemRepository,
            IMapper mapper)
        {
            _itemRepository = itemRepository ?? throw new ArgumentNullException(nameof(itemRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<SalesOrderPerformaInvoiceItemDto>> GetAllItemsAsync()
        {
            var items = await _itemRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SalesOrderPerformaInvoiceItemDto>>(items);
        }

        public async Task<SalesOrderPerformaInvoiceItemDto> GetItemByIdAsync(int id)
        {
            var item = await _itemRepository.GetByIdAsync(id);
            if (item == null)
                throw new NotFoundException("Performa invoice item not found");

            return _mapper.Map<SalesOrderPerformaInvoiceItemDto>(item);
        }

        public async Task<SalesOrderPerformaInvoiceItemDto> CreateItemAsync(CreateSalesOrderPerformaInvoiceItemDto itemDto)
        {
            var item = _mapper.Map<SalesOrderPerformaInvoiceItem>(itemDto);
            item.CreatedAt = DateTime.UtcNow;
            item.UpdatedAt = DateTime.UtcNow;

            var createdItem = await _itemRepository.AddAsync(item);
            return _mapper.Map<SalesOrderPerformaInvoiceItemDto>(createdItem);
        }

        public async Task UpdateItemAsync(int id, CreateSalesOrderPerformaInvoiceItemDto itemDto)
        {
            var existingItem = await _itemRepository.GetByIdAsync(id);
            if (existingItem == null)
                throw new NotFoundException("Performa invoice item not found");

            _mapper.Map(itemDto, existingItem);
            existingItem.UpdatedAt = DateTime.UtcNow;

            await _itemRepository.UpdateAsync(existingItem);
        }

        public async Task DeleteItemAsync(int id)
        {
            var item = await _itemRepository.GetByIdAsync(id);
            if (item == null)
                throw new NotFoundException("Performa invoice item not found");

            await _itemRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<SalesOrderPerformaInvoiceItemDto>> GetItemsByPerformaInvoiceAsync(int performaInvoiceId)
        {
            var items = await _itemRepository.GetByPerformaInvoiceIdAsync(performaInvoiceId);
            return _mapper.Map<IEnumerable<SalesOrderPerformaInvoiceItemDto>>(items);
        }

        public async Task<IEnumerable<SalesOrderPerformaInvoiceItemDto>> GetItemsBySalesOrderAsync(int salesOrderId)
        {
            var items = await _itemRepository.GetBySalesOrderIdAsync(salesOrderId);
            return _mapper.Map<IEnumerable<SalesOrderPerformaInvoiceItemDto>>(items);
        }
    }
} 