using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerType;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ICustomerTypeRepository
    {
        Task<(List<CustomerType> items, int totalCount)> GetAllAsync(CustomerTypeFilterDto filter);
        Task<CustomerType?> GetByIdAsync(int id);
        Task<CustomerType?> GetByCodeAsync(string code);
        Task<CustomerType> CreateAsync(CustomerType customerType);
        Task<CustomerType> UpdateAsync(CustomerType customerType);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsByCodeAsync(string code);
    }
} 