using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerType;

namespace Xcianify.Services
{
    public class CustomerTypeService : ICustomerTypeService
    {
        private readonly ICustomerTypeRepository _customerTypeRepository;
        private readonly IMapper _mapper;

        public CustomerTypeService(ICustomerTypeRepository customerTypeRepository, IMapper mapper)
        {
            _customerTypeRepository = customerTypeRepository;
            _mapper = mapper;
        }

        public async Task<(List<CustomerTypeDto> items, int totalCount)> GetAllCustomerTypesAsync(CustomerTypeFilterDto filter)
        {
            var (customerTypes, totalCount) = await _customerTypeRepository.GetAllAsync(filter);
            var customerTypeDtos = _mapper.Map<List<CustomerTypeDto>>(customerTypes);
            return (customerTypeDtos, totalCount);
        }

        public async Task<CustomerTypeDto?> GetCustomerTypeByIdAsync(int id)
        {
            var customerType = await _customerTypeRepository.GetByIdAsync(id);
            return customerType != null ? _mapper.Map<CustomerTypeDto>(customerType) : null;
        }

        public async Task<CustomerTypeDto?> GetCustomerTypeByCodeAsync(string code)
        {
            var customerType = await _customerTypeRepository.GetByCodeAsync(code);
            return customerType != null ? _mapper.Map<CustomerTypeDto>(customerType) : null;
        }

        public async Task<CustomerTypeDto> CreateCustomerTypeAsync(CreateCustomerTypeDto createDto, int currentUserId)
        {
            var customerType = _mapper.Map<CustomerType>(createDto);
            customerType.CreatedBy = currentUserId;
            customerType.CreatedAt = DateTime.UtcNow;

            var createdCustomerType = await _customerTypeRepository.CreateAsync(customerType);
            return _mapper.Map<CustomerTypeDto>(createdCustomerType);
        }

        public async Task<CustomerTypeDto> UpdateCustomerTypeAsync(int id, UpdateCustomerTypeDto updateDto, int currentUserId)
        {
            var existingCustomerType = await _customerTypeRepository.GetByIdAsync(id);
            if (existingCustomerType == null)
                throw new ArgumentException($"Customer type with ID {id} not found.");

            _mapper.Map(updateDto, existingCustomerType);
            existingCustomerType.UpdatedBy = currentUserId;
            existingCustomerType.UpdatedAt = DateTime.UtcNow;

            var updatedCustomerType = await _customerTypeRepository.UpdateAsync(existingCustomerType);
            return _mapper.Map<CustomerTypeDto>(updatedCustomerType);
        }

        public async Task<bool> DeleteCustomerTypeAsync(int id)
        {
            return await _customerTypeRepository.DeleteAsync(id);
        }
    }
} 