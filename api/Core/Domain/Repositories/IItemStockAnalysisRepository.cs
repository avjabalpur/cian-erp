using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IItemStockAnalysisRepository
    {
        Task<ItemStockAnalysis> GetByIdAsync(int id);
        Task<ItemStockAnalysis> GetByItemMasterIdAsync(int itemMasterId);
        Task<ItemStockAnalysis> CreateAsync(ItemStockAnalysis stockAnalysis);
        Task<bool> UpdateAsync(ItemStockAnalysis stockAnalysis);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsForItemMasterAsync(int itemMasterId, int? excludeId = null);
    }
}
