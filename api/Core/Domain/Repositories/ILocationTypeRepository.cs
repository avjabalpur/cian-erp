using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ILocationTypeRepository
    {
        Task<LocationType> GetByIdAsync(int id);
        Task<IEnumerable<LocationType>> GetAllAsync();
        Task<LocationType> CreateAsync(LocationType locationType);
        Task UpdateAsync(LocationType locationType);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(string code);
    }
}
