using Xcianify.Core.DTOs.Customer;

namespace Xcianify.Core.Domain.Services
{
    public interface ICustomerService
    {
        Task<(List<CustomerDto> items, int totalCount)> GetAllCustomersAsync(CustomerFilterDto filter);
        Task<CustomerDto?> GetCustomerByIdAsync(int id);
        Task<CustomerDto?> GetCustomerByCodeAsync(string customerCode);
        Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto createDto, int currentUserId);
        Task<CustomerDto> UpdateCustomerAsync(int id, UpdateCustomerDto updateDto, int currentUserId);
        Task<bool> DeleteCustomerAsync(int id);
    }
} 