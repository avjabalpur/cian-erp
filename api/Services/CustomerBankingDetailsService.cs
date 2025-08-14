using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerBankingDetails;

namespace Xcianify.Services
{
    public class CustomerBankingDetailsService : ICustomerBankingDetailsService
    {
        private readonly ICustomerBankingDetailsRepository _customerBankingDetailsRepository;
        private readonly IMapper _mapper;

        public CustomerBankingDetailsService(ICustomerBankingDetailsRepository customerBankingDetailsRepository, IMapper mapper)
        {
            _customerBankingDetailsRepository = customerBankingDetailsRepository;
            _mapper = mapper;
        }

        public async Task<List<CustomerBankingDetailsDto>> GetByCustomerIdAsync(int customerId)
        {
            var bankingDetails = await _customerBankingDetailsRepository.GetByCustomerIdAsync(customerId);
            return _mapper.Map<List<CustomerBankingDetailsDto>>(bankingDetails);
        }

        public async Task<CustomerBankingDetailsDto?> GetByIdAsync(int id)
        {
            var bankingDetails = await _customerBankingDetailsRepository.GetByIdAsync(id);
            return bankingDetails != null ? _mapper.Map<CustomerBankingDetailsDto>(bankingDetails) : null;
        }

        public async Task<CustomerBankingDetailsDto> CreateAsync(CreateCustomerBankingDetailsDto createDto, int currentUserId)
        {
            var bankingDetails = _mapper.Map<CustomerBankingDetails>(createDto);
            bankingDetails.CreatedAt = DateTime.UtcNow;
            bankingDetails.UpdatedAt = DateTime.UtcNow;

            var createdBankingDetails = await _customerBankingDetailsRepository.CreateAsync(bankingDetails);
            return _mapper.Map<CustomerBankingDetailsDto>(createdBankingDetails);
        }

        public async Task<CustomerBankingDetailsDto> UpdateAsync(int id, UpdateCustomerBankingDetailsDto updateDto, int currentUserId)
        {
            var existingBankingDetails = await _customerBankingDetailsRepository.GetByIdAsync(id);
            if (existingBankingDetails == null)
                throw new ArgumentException($"Customer banking details with ID {id} not found.");

            _mapper.Map(updateDto, existingBankingDetails);
            existingBankingDetails.UpdatedAt = DateTime.UtcNow;

            var updatedBankingDetails = await _customerBankingDetailsRepository.UpdateAsync(existingBankingDetails);
            return _mapper.Map<CustomerBankingDetailsDto>(updatedBankingDetails);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _customerBankingDetailsRepository.DeleteAsync(id);
        }
    }
}
