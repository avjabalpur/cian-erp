using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IItemExportDetailsRepository
    {
        Task<ItemExportDetails> GetByIdAsync(int id);
        Task<IEnumerable<ItemExportDetails>> GetByItemIdAsync(int itemId);
        Task<int> CreateAsync(ItemExportDetails entity);
        Task<bool> UpdateAsync(ItemExportDetails entity);
        Task<bool> DeleteAsync(int id);
    }
}
