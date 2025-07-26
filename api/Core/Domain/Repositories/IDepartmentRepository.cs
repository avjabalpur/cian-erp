using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.Department;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IDepartmentRepository
    {
        Task<Department> GetByIdAsync(int id);
        Task<Department> GetByCodeAsync(string code);
        Task<IEnumerable<Department>> GetAllAsync();
        Task<int> CreateAsync(Department department);
        Task<bool> UpdateAsync(Department department);
        Task<bool> DeleteAsync(int id);
        Task<bool> CodeExistsAsync(string code, int? excludeId = null);
    }
}
