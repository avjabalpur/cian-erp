using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemMaster;

namespace Xcianify.Core.Domain.Services
{
    public interface IItemSalesDetailService
    {
        Task<ItemSalesDetailDto> GetByItemIdAsync(int itemMasterId);
        Task<ItemSalesDetailDto> CreateAsync(CreateItemSalesDetailDto dto, int userId);
        Task<ItemSalesDetailDto> UpdateAsync(int id, UpdateItemSalesDetailDto dto, int userId);
        Task<bool> DeleteAsync(int id);
    }
}
