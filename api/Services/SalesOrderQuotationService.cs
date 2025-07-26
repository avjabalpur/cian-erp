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
    public class SalesOrderQuotationService : ISalesOrderQuotationService
    {
        private readonly ISalesOrderQuotationRepository _quotationRepository;
        private readonly IMapper _mapper;

        public SalesOrderQuotationService(
            ISalesOrderQuotationRepository quotationRepository,
            IMapper mapper)
        {
            _quotationRepository = quotationRepository ?? throw new ArgumentNullException(nameof(quotationRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<SalesOrderQuotationDto>> GetAllQuotationsAsync()
        {
            var quotations = await _quotationRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SalesOrderQuotationDto>>(quotations);
        }

        public async Task<SalesOrderQuotationDto> GetQuotationByIdAsync(int id)
        {
            var quotation = await _quotationRepository.GetByIdAsync(id);
            if (quotation == null)
                throw new NotFoundException("Quotation not found");

            return _mapper.Map<SalesOrderQuotationDto>(quotation);
        }

        public async Task<SalesOrderQuotationDto> GetQuotationByNumberAsync(string quotationNumber)
        {
            var quotation = await _quotationRepository.GetByQuotationNumberAsync(quotationNumber);
            if (quotation == null)
                throw new NotFoundException("Quotation not found");

            return _mapper.Map<SalesOrderQuotationDto>(quotation);
        }

        public async Task<SalesOrderQuotationDto> CreateQuotationAsync(CreateSalesOrderQuotationDto quotationDto)
        {
            // Check if quotation number already exists
            if (await _quotationRepository.QuotationNumberExistsAsync(quotationDto.QuotationNumber))
                throw new ValidationException("Quotation number already exists");

            var quotation = _mapper.Map<SalesOrderQuotation>(quotationDto);
            quotation.CreatedAt = DateTime.UtcNow;
            quotation.UpdatedAt = DateTime.UtcNow;
            quotation.IsDeleted = false;

            var createdQuotation = await _quotationRepository.AddAsync(quotation);
            return _mapper.Map<SalesOrderQuotationDto>(createdQuotation);
        }

        public async Task UpdateQuotationAsync(int id, CreateSalesOrderQuotationDto quotationDto)
        {
            var existingQuotation = await _quotationRepository.GetByIdAsync(id);
            if (existingQuotation == null)
                throw new NotFoundException("Quotation not found");

            // Check if quotation number is being changed and already exists
            if (!string.Equals(existingQuotation.QuotationNumber, quotationDto.QuotationNumber, StringComparison.OrdinalIgnoreCase))
            {
                if (await _quotationRepository.QuotationNumberExistsAsync(quotationDto.QuotationNumber, id))
                    throw new ValidationException("Quotation number already in use by another quotation");
            }

            _mapper.Map(quotationDto, existingQuotation);
            existingQuotation.UpdatedAt = DateTime.UtcNow;

            await _quotationRepository.UpdateAsync(existingQuotation);
        }

        public async Task DeleteQuotationAsync(int id)
        {
            var quotation = await _quotationRepository.GetByIdAsync(id);
            if (quotation == null)
                throw new NotFoundException("Quotation not found");

            await _quotationRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<SalesOrderQuotationDto>> GetQuotationsByCustomerAsync(int customerId)
        {
            var quotations = await _quotationRepository.GetByCustomerIdAsync(customerId);
            return _mapper.Map<IEnumerable<SalesOrderQuotationDto>>(quotations);
        }

        public async Task<IEnumerable<SalesOrderQuotationDto>> GetQuotationsByOrganizationAsync(int organizationId)
        {
            var quotations = await _quotationRepository.GetByOrganizationIdAsync(organizationId);
            return _mapper.Map<IEnumerable<SalesOrderQuotationDto>>(quotations);
        }

        public async Task<IEnumerable<SalesOrderQuotationDto>> GetQuotationsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var quotations = await _quotationRepository.GetByDateRangeAsync(startDate, endDate);
            return _mapper.Map<IEnumerable<SalesOrderQuotationDto>>(quotations);
        }
    }
} 