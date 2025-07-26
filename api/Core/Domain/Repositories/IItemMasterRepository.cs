using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IItemMasterRepository
    {
        Task<(List<ItemMaster> Items, int TotalCount)> GetAllAsync(ItemMasterFilterDto filter);
        Task<ItemMaster> GetByIdAsync(int id);
        Task<ItemMaster> GetByItemCodeAsync(string itemCode);
        Task<int> CreateAsync(ItemMaster item);
        Task<bool> UpdateAsync(ItemMaster item);
        Task<bool> DeleteAsync(int id);
        Task<bool> ItemCodeExistsAsync(string itemCode, int? excludeId = null);
    }
}
