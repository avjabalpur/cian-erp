using Xcianify.Core.DTOs.CustomerAddress;

namespace Xcianify.Core.Domain.Services
{
    public interface ICustomerAddressService
    {
        Task<List<CustomerAddressDto>> GetByCustomerIdAsync(int customerId);
        Task<CustomerAddressDto?> GetByIdAsync(int id);
        Task<CustomerAddressDto> CreateAsync(CreateCustomerAddressDto createDto, int currentUserId);
        Task<CustomerAddressDto> UpdateAsync(int id, UpdateCustomerAddressDto updateDto, int currentUserId);
        Task<bool> DeleteAsync(int id);
    }
} 