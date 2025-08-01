using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IItemSpecificationRepository
    {
        Task<ItemSpecification> GetByItemIdAsync(int itemId);
        Task CreateAsync(ItemSpecification specification);
        Task UpdateAsync(ItemSpecification specification);
        Task DeleteAsync(int itemId);
    }
}