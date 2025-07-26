using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.Division;

namespace Xcianify.Core.Domain.Services
{
    public interface IDivisionService
    {
        Task<DivisionDto> GetByIdAsync(int id);
        Task<DivisionDto> GetByCodeAsync(string code);
        Task<IEnumerable<DivisionDto>> GetAllAsync();
        Task<IEnumerable<DivisionDto>> GetByDepartmentIdAsync(int departmentId);
        Task<DivisionDto> CreateAsync(CreateDivisionDto createDto, int userId);
        Task<DivisionDto> UpdateAsync(int id, UpdateDivisionDto updateDto, int userId);
        Task<bool> DeleteAsync(int id);
    }
}
