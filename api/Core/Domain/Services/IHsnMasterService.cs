using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.ItemMaster;

namespace Xcianify.Core.Domain.Services
{
    public interface IHsnMasterService
    {
        Task<HsnMasterDto> GetByIdAsync(int id);
        Task<PaginatedResult<HsnMasterDto>> GetAllAsync(HsnMasterFilterDto filter);
        Task<HsnMasterDto> CreateAsync(CreateHsnMasterDto dto, int userId);
        Task<HsnMasterDto> UpdateAsync(int id, UpdateHsnMasterDto dto, int userId);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<HsnMasterDto>> GetHsnTypesAsync();
    }
}
