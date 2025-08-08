using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerTaxCompliance;

namespace Xcianify.Services
{
    public class CustomerTaxComplianceService : ICustomerTaxComplianceService
    {
        private readonly ICustomerTaxComplianceRepository _customerTaxComplianceRepository;
        private readonly IMapper _mapper;

        public CustomerTaxComplianceService(ICustomerTaxComplianceRepository customerTaxComplianceRepository, IMapper mapper)
        {
            _customerTaxComplianceRepository = customerTaxComplianceRepository;
            _mapper = mapper;
        }

        public async Task<List<CustomerTaxComplianceDto>> GetByCustomerIdAsync(int customerId)
        {
            var taxCompliance = await _customerTaxComplianceRepository.GetByCustomerIdAsync(customerId);
            return _mapper.Map<List<CustomerTaxComplianceDto>>(taxCompliance);
        }

        public async Task<CustomerTaxComplianceDto?> GetByIdAsync(int id)
        {
            var taxCompliance = await _customerTaxComplianceRepository.GetByIdAsync(id);
            return taxCompliance != null ? _mapper.Map<CustomerTaxComplianceDto>(taxCompliance) : null;
        }

        public async Task<CustomerTaxComplianceDto> CreateAsync(CreateCustomerTaxComplianceDto createDto, int currentUserId)
        {
            var taxCompliance = _mapper.Map<CustomerTaxCompliance>(createDto);
            taxCompliance.CreatedAt = DateTime.UtcNow;
            taxCompliance.UpdatedAt = DateTime.UtcNow;

            var createdTaxCompliance = await _customerTaxComplianceRepository.CreateAsync(taxCompliance);
            return _mapper.Map<CustomerTaxComplianceDto>(createdTaxCompliance);
        }

        public async Task<CustomerTaxComplianceDto> UpdateAsync(int id, UpdateCustomerTaxComplianceDto updateDto, int currentUserId)
        {
            var existingTaxCompliance = await _customerTaxComplianceRepository.GetByIdAsync(id);
            if (existingTaxCompliance == null)
                throw new ArgumentException($"Customer tax compliance with ID {id} not found.");

            _mapper.Map(updateDto, existingTaxCompliance);
            existingTaxCompliance.UpdatedAt = DateTime.UtcNow;

            var updatedTaxCompliance = await _customerTaxComplianceRepository.UpdateAsync(existingTaxCompliance);
            return _mapper.Map<CustomerTaxComplianceDto>(updatedTaxCompliance);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _customerTaxComplianceRepository.DeleteAsync(id);
        }
    }
}
