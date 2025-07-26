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
    public class SalesOrderPerformaInvoiceService : ISalesOrderPerformaInvoiceService
    {
        private readonly ISalesOrderPerformaInvoiceRepository _performaInvoiceRepository;
        private readonly IMapper _mapper;

        public SalesOrderPerformaInvoiceService(
            ISalesOrderPerformaInvoiceRepository performaInvoiceRepository,
            IMapper mapper)
        {
            _performaInvoiceRepository = performaInvoiceRepository ?? throw new ArgumentNullException(nameof(performaInvoiceRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<SalesOrderPerformaInvoiceDto>> GetAllPerformaInvoicesAsync()
        {
            var performaInvoices = await _performaInvoiceRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SalesOrderPerformaInvoiceDto>>(performaInvoices);
        }

        public async Task<SalesOrderPerformaInvoiceDto> GetPerformaInvoiceByIdAsync(int id)
        {
            var performaInvoice = await _performaInvoiceRepository.GetByIdAsync(id);
            if (performaInvoice == null)
                throw new NotFoundException("Performa invoice not found");

            return _mapper.Map<SalesOrderPerformaInvoiceDto>(performaInvoice);
        }

        public async Task<SalesOrderPerformaInvoiceDto> GetPerformaInvoiceByNumberAsync(string invoiceNumber)
        {
            var performaInvoice = await _performaInvoiceRepository.GetByInvoiceNumberAsync(invoiceNumber);
            if (performaInvoice == null)
                throw new NotFoundException("Performa invoice not found");

            return _mapper.Map<SalesOrderPerformaInvoiceDto>(performaInvoice);
        }

        public async Task<SalesOrderPerformaInvoiceDto> CreatePerformaInvoiceAsync(CreateSalesOrderPerformaInvoiceDto performaInvoiceDto)
        {
            // Check if invoice number already exists
            if (await _performaInvoiceRepository.InvoiceNumberExistsAsync(performaInvoiceDto.PerformaInvoiceNumber))
                throw new ValidationException("Performa invoice number already exists");

            var performaInvoice = _mapper.Map<SalesOrderPerformaInvoice>(performaInvoiceDto);
            performaInvoice.CreatedAt = DateTime.UtcNow;
            performaInvoice.UpdatedAt = DateTime.UtcNow;
            performaInvoice.IsDeleted = false;

            var createdPerformaInvoice = await _performaInvoiceRepository.AddAsync(performaInvoice);
            return _mapper.Map<SalesOrderPerformaInvoiceDto>(createdPerformaInvoice);
        }

        public async Task UpdatePerformaInvoiceAsync(int id, CreateSalesOrderPerformaInvoiceDto performaInvoiceDto)
        {
            var existingPerformaInvoice = await _performaInvoiceRepository.GetByIdAsync(id);
            if (existingPerformaInvoice == null)
                throw new NotFoundException("Performa invoice not found");

            // Check if invoice number is being changed and already exists
            if (!string.Equals(existingPerformaInvoice.PerformaInvoiceNumber, performaInvoiceDto.PerformaInvoiceNumber, StringComparison.OrdinalIgnoreCase))
            {
                if (await _performaInvoiceRepository.InvoiceNumberExistsAsync(performaInvoiceDto.PerformaInvoiceNumber, id))
                    throw new ValidationException("Performa invoice number already in use by another invoice");
            }

            _mapper.Map(performaInvoiceDto, existingPerformaInvoice);
            existingPerformaInvoice.UpdatedAt = DateTime.UtcNow;

            await _performaInvoiceRepository.UpdateAsync(existingPerformaInvoice);
        }

        public async Task DeletePerformaInvoiceAsync(int id)
        {
            var performaInvoice = await _performaInvoiceRepository.GetByIdAsync(id);
            if (performaInvoice == null)
                throw new NotFoundException("Performa invoice not found");

            await _performaInvoiceRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<SalesOrderPerformaInvoiceDto>> GetPerformaInvoicesBySalesOrderAsync(int salesOrderId)
        {
            var performaInvoices = await _performaInvoiceRepository.GetBySalesOrderIdAsync(salesOrderId);
            return _mapper.Map<IEnumerable<SalesOrderPerformaInvoiceDto>>(performaInvoices);
        }
    }
} 