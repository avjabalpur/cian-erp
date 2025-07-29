using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IHsnMasterRepository
    {
        Task<(List<HsnMaster> Items, int TotalCount)> GetAllAsync(HsnMasterFilterDto filterDto);
        Task<HsnMaster> GetByIdAsync(int id);
        Task<HsnMaster> AddAsync(HsnMaster hsnMaster);
        Task UpdateAsync(HsnMaster hsnMaster);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(string code, int? excludeId = null);
        Task<IEnumerable<HsnMaster>> GetHsnTypesAsync();
    }
}
