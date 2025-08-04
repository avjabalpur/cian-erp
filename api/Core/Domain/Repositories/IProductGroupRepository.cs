using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IProductGroupRepository
    {
        Task<IEnumerable<ProductGroup>> GetAllAsync();
        Task<ProductGroup> GetByIdAsync(int id);
        Task<ProductGroup> GetByCodeAsync(string code);
        Task<ProductGroup> CreateAsync(ProductGroup productGroup);
        Task<ProductGroup> UpdateAsync(ProductGroup productGroup);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsByCodeAsync(string code, int? excludeId = null);
    }
} 