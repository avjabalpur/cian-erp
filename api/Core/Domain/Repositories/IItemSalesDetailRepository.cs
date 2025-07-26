using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IItemSalesDetailRepository
    {
        Task<ItemSalesDetail> GetByIdAsync(int id);
        Task<ItemSalesDetail> GetByItemMasterIdAsync(int itemMasterId);
        Task<ItemSalesDetail> CreateAsync(ItemSalesDetail salesDetail);
        Task<bool> UpdateAsync(ItemSalesDetail salesDetail);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsForItemMasterAsync(int itemMasterId, int? excludeId = null);
    }
}
