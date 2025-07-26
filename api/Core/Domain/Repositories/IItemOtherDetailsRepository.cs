using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IItemOtherDetailsRepository
    {
        Task<ItemOtherDetails> GetByIdAsync(int id);
        Task<IEnumerable<ItemOtherDetails>> GetByItemIdAsync(int itemId);
        Task<int> CreateAsync(ItemOtherDetails entity);
        Task<bool> UpdateAsync(ItemOtherDetails entity);
        Task<bool> DeleteAsync(int id);
    }
}
