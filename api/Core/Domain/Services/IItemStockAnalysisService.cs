using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemMaster;

namespace Xcianify.Core.Domain.Services
{
    public interface IItemStockAnalysisService
    {
        Task<ItemStockAnalysisDto> GetByItemIdAsync(int itemId);
        Task<ItemStockAnalysisDto> CreateAsync(CreateItemStockAnalysisDto dto, int userId);
        Task<ItemStockAnalysisDto> UpdateAsync(int id, UpdateItemStockAnalysisDto dto, int userId);
        Task<bool> DeleteAsync(int id);
    }
}
