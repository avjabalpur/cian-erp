using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.ItemMaster;

namespace Xcianify.Core.Domain.Services
{
    public interface IItemTypeService
    {
        Task<ItemTypeDto> GetByIdAsync(int id);
        Task<PaginatedResult<ItemTypeDto>> GetAllAsync(ItemTypeFilterDto filter);
        Task<ItemTypeDto> CreateAsync(CreateItemTypeDto dto, int userId);
        Task<ItemTypeDto> UpdateAsync(int id, UpdateItemTypeDto dto, int userId);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<ItemTypeDto>> GetParentTypesAsync();
    }
}
