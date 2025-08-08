using Xcianify.Core.DTOs.ProductType;

namespace Xcianify.Core.Domain.Services
{
    public interface IProductTypeService
    {
        Task<ProductTypeDto> GetByIdAsync(int id);
        Task<IEnumerable<ProductTypeDto>> GetAllAsync();
        Task<IEnumerable<ProductTypeDto>> GetActiveAsync();
        Task<IEnumerable<ProductTypeDto>> GetParentTypesAsync();
        Task<ProductTypeDto> CreateAsync(CreateProductTypeDto createDto, int userId);
        Task<ProductTypeDto> UpdateAsync(int id, UpdateProductTypeDto updateDto, int userId);
        Task DeleteAsync(int id);
    }
} 