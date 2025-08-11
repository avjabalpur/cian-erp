using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerBusinessTerms;

namespace Xcianify.Services
{
    public class CustomerBusinessTermsService : ICustomerBusinessTermsService
    {
        private readonly ICustomerBusinessTermsRepository _customerBusinessTermsRepository;
        private readonly IMapper _mapper;

        public CustomerBusinessTermsService(ICustomerBusinessTermsRepository customerBusinessTermsRepository, IMapper mapper)
        {
            _customerBusinessTermsRepository = customerBusinessTermsRepository;
            _mapper = mapper;
        }

        public async Task<List<CustomerBusinessTermsDto>> GetByCustomerIdAsync(int customerId)
        {
            var businessTerms = await _customerBusinessTermsRepository.GetByCustomerIdAsync(customerId);
            return _mapper.Map<List<CustomerBusinessTermsDto>>(businessTerms);
        }

        public async Task<CustomerBusinessTermsDto?> GetByIdAsync(int id)
        {
            var businessTerms = await _customerBusinessTermsRepository.GetByIdAsync(id);
            return businessTerms != null ? _mapper.Map<CustomerBusinessTermsDto>(businessTerms) : null;
        }

        public async Task<CustomerBusinessTermsDto> CreateAsync(CreateCustomerBusinessTermsDto createDto, int currentUserId)
        {
            var businessTerms = _mapper.Map<CustomerBusinessTerms>(createDto);
            businessTerms.CreatedAt = DateTime.UtcNow;
            businessTerms.UpdatedAt = DateTime.UtcNow;

            var createdBusinessTerms = await _customerBusinessTermsRepository.CreateAsync(businessTerms);
            return _mapper.Map<CustomerBusinessTermsDto>(createdBusinessTerms);
        }

        public async Task<CustomerBusinessTermsDto> UpdateAsync(int id, UpdateCustomerBusinessTermsDto updateDto, int currentUserId)
        {
            var existingBusinessTerms = await _customerBusinessTermsRepository.GetByIdAsync(id);
            if (existingBusinessTerms == null)
                throw new ArgumentException($"Customer business terms with ID {id} not found.");

            _mapper.Map(updateDto, existingBusinessTerms);
            existingBusinessTerms.UpdatedAt = DateTime.UtcNow;

            var updatedBusinessTerms = await _customerBusinessTermsRepository.UpdateAsync(existingBusinessTerms);
            return _mapper.Map<CustomerBusinessTermsDto>(updatedBusinessTerms);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _customerBusinessTermsRepository.DeleteAsync(id);
        }
    }
}
