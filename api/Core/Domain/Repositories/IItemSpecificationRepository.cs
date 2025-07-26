using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IItemSpecificationRepository
    {
        Task<ItemSpecification> GetByItemCodeAsync(string itemCode);
        Task CreateAsync(ItemSpecification specification);
        Task UpdateAsync(ItemSpecification specification);
        Task DeleteAsync(string itemCode);
    }
}