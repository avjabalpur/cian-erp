using System.Threading.Tasks;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.ItemMaster;

namespace Xcianify.Core.Domain.Services
{
    public interface IUnitOfMeasureService
    {
        Task<UnitOfMeasureDto> GetByIdAsync(int id);
        Task<PaginatedResult<UnitOfMeasureDto>> GetAllAsync(UnitOfMeasureFilterDto filter);
        Task<UnitOfMeasureDto> CreateAsync(CreateUnitOfMeasureDto dto, int userId);
        Task<UnitOfMeasureDto> UpdateAsync(int id, UpdateUnitOfMeasureDto dto, int userId);
        Task<bool> DeleteAsync(int id);
    }
}
