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
    public class SalesOrderQuotationItemService : ISalesOrderQuotationItemService
    {
        private readonly ISalesOrderQuotationItemRepository _quotationItemRepository;
        private readonly IMapper _mapper;

        public SalesOrderQuotationItemService(
            ISalesOrderQuotationItemRepository quotationItemRepository,
            IMapper mapper)
        {
            _quotationItemRepository = quotationItemRepository ?? throw new ArgumentNullException(nameof(quotationItemRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<SalesOrderQuotationItemDto>> GetAllItemsAsync()
        {
            var quotationItems = await _quotationItemRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SalesOrderQuotationItemDto>>(quotationItems);
        }

        public async Task<SalesOrderQuotationItemDto> GetItemByIdAsync(int id)
        {
            var quotationItem = await _quotationItemRepository.GetByIdAsync(id);
            if (quotationItem == null)
                throw new NotFoundException("Quotation item not found");

            return _mapper.Map<SalesOrderQuotationItemDto>(quotationItem);
        }

        public async Task<SalesOrderQuotationItemDto> CreateItemAsync(CreateSalesOrderQuotationItemDto quotationItemDto)
        {
            var quotationItem = _mapper.Map<SalesOrderQuotationItem>(quotationItemDto);
            quotationItem.CreatedAt = DateTime.UtcNow;
            quotationItem.UpdatedAt = DateTime.UtcNow;
            quotationItem.IsDeleted = false;

            var createdQuotationItem = await _quotationItemRepository.AddAsync(quotationItem);
            return _mapper.Map<SalesOrderQuotationItemDto>(createdQuotationItem);
        }

        public async Task UpdateItemAsync(int id, CreateSalesOrderQuotationItemDto quotationItemDto)
        {
            var existingQuotationItem = await _quotationItemRepository.GetByIdAsync(id);
            if (existingQuotationItem == null)
                throw new NotFoundException("Quotation item not found");

            _mapper.Map(quotationItemDto, existingQuotationItem);
            existingQuotationItem.UpdatedAt = DateTime.UtcNow;

            await _quotationItemRepository.UpdateAsync(existingQuotationItem);
        }

        public async Task DeleteItemAsync(int id)
        {
            var quotationItem = await _quotationItemRepository.GetByIdAsync(id);
            if (quotationItem == null)
                throw new NotFoundException("Quotation item not found");

            await _quotationItemRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<SalesOrderQuotationItemDto>> GetItemsByQuotationAsync(int quotationId)
        {
            var quotationItems = await _quotationItemRepository.GetByQuotationIdAsync(quotationId);
            return _mapper.Map<IEnumerable<SalesOrderQuotationItemDto>>(quotationItems);
        }

        public async Task<IEnumerable<SalesOrderQuotationItemDto>> GetItemsBySalesOrderAsync(int salesOrderId)
        {
            var quotationItems = await _quotationItemRepository.GetBySalesOrderIdAsync(salesOrderId);
            return _mapper.Map<IEnumerable<SalesOrderQuotationItemDto>>(quotationItems);
        }
    }
} 