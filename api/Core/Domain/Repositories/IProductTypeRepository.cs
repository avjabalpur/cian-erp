using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IProductTypeRepository
    {
        Task<ProductType> GetByIdAsync(int id);
        Task<IEnumerable<ProductType>> GetAllAsync();
        Task<IEnumerable<ProductType>> GetActiveAsync();
        Task<IEnumerable<ProductType>> GetParentTypesAsync();
        Task<ProductType> AddAsync(ProductType productType);
        Task<ProductType> UpdateAsync(ProductType productType);
        Task DeleteAsync(ProductType productType);
        Task<bool> CodeExistsAsync(string code, int? excludeId = null);
    }
} 