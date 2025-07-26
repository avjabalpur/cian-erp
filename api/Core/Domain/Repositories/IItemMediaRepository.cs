using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IItemMediaRepository
    {
        Task<ItemMedia> GetByIdAsync(int id);
        Task<IEnumerable<ItemMedia>> GetByItemIdAsync(int itemId);
        Task<int> CreateAsync(ItemMedia entity);
        Task<bool> UpdateAsync(ItemMedia entity);
        Task<bool> DeleteAsync(int id);
    }
}
