using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IItemTypeRepository
    {
        // New pattern methods (following UserRepository)
        Task<(List<ItemType> Items, int TotalCount)> GetAllAsync(ItemTypeFilterDto filterDto);
        Task<ItemType> GetByIdAsync(int id);
        Task<ItemType> AddAsync(ItemType itemType);
        Task UpdateAsync(ItemType itemType);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(string code, int? excludeId = null);
        Task<IEnumerable<ItemType>> GetParentTypesAsync();
    }
}
