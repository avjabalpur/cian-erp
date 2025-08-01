using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.Dosage;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IDosageRepository
    {
        Task<Dosage> GetByIdAsync(int id);
        Task<IEnumerable<Dosage>> GetAllAsync();
        Task<Dosage> CreateAsync(Dosage dosage);
        Task<Dosage> UpdateAsync(Dosage dosage);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsByNameAsync(string name, int? excludeId = null);
    }
} 