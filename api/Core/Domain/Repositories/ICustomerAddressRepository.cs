using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerAddress;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ICustomerAddressRepository
    {
        Task<List<CustomerAddress>> GetByCustomerIdAsync(int customerId);
        Task<CustomerAddress?> GetByIdAsync(int id);
        Task<CustomerAddress> CreateAsync(CustomerAddress customerAddress);
        Task<CustomerAddress> UpdateAsync(CustomerAddress customerAddress);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
} 