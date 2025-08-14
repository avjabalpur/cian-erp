using Xcianify.Core.Model;
using Xcianify.Core.DTOs.Customer;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ICustomerRepository
    {
        Task<(List<Customer> items, int totalCount)> GetAllAsync(CustomerFilterDto filter);
        Task<Customer?> GetByIdAsync(int id);
        Task<Customer?> GetByCodeAsync(string customerCode);
        Task<Customer> CreateAsync(Customer customer);
        Task<Customer> UpdateAsync(Customer customer);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsByCodeAsync(string customerCode);
    }
} 