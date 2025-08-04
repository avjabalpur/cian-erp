using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.ProductGroup;

namespace Xcianify.Core.Domain.Services
{
    public interface IProductGroupService
    {
        Task<IEnumerable<ProductGroupDto>> GetAllAsync();
        Task<ProductGroupDto> GetByIdAsync(int id);
        Task<ProductGroupDto> GetByCodeAsync(string code);
        Task<ProductGroupDto> CreateAsync(CreateProductGroupDto createDto, int userId);
        Task<ProductGroupDto> UpdateAsync(int id, UpdateProductGroupDto updateDto, int userId);
        Task DeleteAsync(int id);
    }
} 