using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IItemBoughtOutDetailsRepository
    {
        Task<ItemBoughtOutDetails> GetByItemCodeAsync(string itemCode);
        Task<ItemBoughtOutDetails> GetByIdAsync(int id);
        Task<IEnumerable<ItemBoughtOutDetails>> GetAllAsync();
        Task<ItemBoughtOutDetails> CreateAsync(ItemBoughtOutDetails details);
        Task<bool> UpdateAsync(ItemBoughtOutDetails details);
        Task<bool> DeleteAsync(int id);
    }
}