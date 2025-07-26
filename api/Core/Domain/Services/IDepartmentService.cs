using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.Department;

namespace Xcianify.Core.Domain.Services
{
    public interface IDepartmentService
    {
        Task<DepartmentDto> GetByIdAsync(int id);
        Task<DepartmentDto> GetByCodeAsync(string code);
        Task<IEnumerable<DepartmentDto>> GetAllAsync();
        Task<DepartmentDto> CreateAsync(CreateDepartmentDto createDto, int userId);
        Task<DepartmentDto> UpdateAsync(int id, UpdateDepartmentDto updateDto, int userId);
        Task<bool> DeleteAsync(int id);
    }
}
