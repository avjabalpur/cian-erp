using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IConfigListValueRepository
    {
        Task<ConfigListValue?> GetByIdAsync(int id);
        Task<List<ConfigListValue>> GetByListIdAsync(int listId);
        Task<ConfigListValue> AddAsync(ConfigListValue configListValue);
        Task<ConfigListValue> UpdateAsync(ConfigListValue configListValue);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsByCodeAsync(int listId, string valueCode, int? excludeId = null);
    }
} 