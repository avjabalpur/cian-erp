using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.Division;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IDivisionRepository
    {
        Task<Division> GetByIdAsync(int id);
        Task<Division> GetByCodeAsync(string code);
        Task<IEnumerable<Division>> GetAllAsync();
        Task<IEnumerable<Division>> GetByDepartmentIdAsync(int departmentId);
        Task<int> CreateAsync(Division division);
        Task<bool> UpdateAsync(Division division);
        Task<bool> DeleteAsync(int id);
        Task<bool> CodeExistsAsync(string code, int? excludeId = null);
    }
}
