using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IItemMasterRepository
    {
        // New pattern methods (following UserRepository)
        Task<(List<ItemMaster> Items, int TotalCount)> GetAllAsync(ItemMasterFilterDto filterDto);
        Task<ItemMaster> GetByIdAsync(int id);
        Task<ItemMaster> GetByItemCodeAsync(string itemCode);
        Task<ItemMaster> AddAsync(ItemMaster item);
        Task UpdateAsync(ItemMaster item);
        Task DeleteAsync(int id);
        Task<bool> ItemCodeExistsAsync(string itemCode);

    }
}
