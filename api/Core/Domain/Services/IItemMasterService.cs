using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Exceptions;

namespace Xcianify.Core.Domain.Services
{
    public interface IItemMasterService
    {
        Task<(IEnumerable<ItemMasterDto> Items, int TotalCount)> GetAllItemsAsync(ItemMasterFilterDto filter);
        Task<ItemMasterDto> GetItemByIdAsync(int id);
        Task<ItemMasterDto> GetItemByCodeAsync(string itemCode);
        Task<ItemMasterDto> CreateItemAsync(CreateItemMasterDto createDto);
        Task<ItemMasterDto> UpdateItemAsync(int id, UpdateItemMasterDto updateDto);
        Task<bool> DeleteItemAsync(int id);
    }
}
