using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerAddress;

namespace Xcianify.Services
{
    public class CustomerAddressService : ICustomerAddressService
    {
        private readonly ICustomerAddressRepository _customerAddressRepository;
        private readonly IMapper _mapper;

        public CustomerAddressService(ICustomerAddressRepository customerAddressRepository, IMapper mapper)
        {
            _customerAddressRepository = customerAddressRepository;
            _mapper = mapper;
        }

        public async Task<List<CustomerAddressDto>> GetByCustomerIdAsync(int customerId)
        {
            var addresses = await _customerAddressRepository.GetByCustomerIdAsync(customerId);
            return _mapper.Map<List<CustomerAddressDto>>(addresses);
        }

        public async Task<CustomerAddressDto?> GetByIdAsync(int id)
        {
            var address = await _customerAddressRepository.GetByIdAsync(id);
            return address != null ? _mapper.Map<CustomerAddressDto>(address) : null;
        }

        public async Task<CustomerAddressDto> CreateAsync(CreateCustomerAddressDto createDto, int currentUserId)
        {
            var address = _mapper.Map<CustomerAddress>(createDto);
            address.CreatedBy = currentUserId;
            address.CreatedAt = DateTime.UtcNow;

            var createdAddress = await _customerAddressRepository.CreateAsync(address);
            return _mapper.Map<CustomerAddressDto>(createdAddress);
        }

        public async Task<CustomerAddressDto> UpdateAsync(int id, UpdateCustomerAddressDto updateDto, int currentUserId)
        {
            var existingAddress = await _customerAddressRepository.GetByIdAsync(id);
            if (existingAddress == null)
                throw new ArgumentException($"Customer address with ID {id} not found.");

            _mapper.Map(updateDto, existingAddress);
            existingAddress.UpdatedBy = currentUserId;
            existingAddress.UpdatedAt = DateTime.UtcNow;

            var updatedAddress = await _customerAddressRepository.UpdateAsync(existingAddress);
            return _mapper.Map<CustomerAddressDto>(updatedAddress);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _customerAddressRepository.DeleteAsync(id);
        }
    }
} 