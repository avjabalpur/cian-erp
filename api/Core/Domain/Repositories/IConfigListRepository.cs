using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IConfigListRepository
    {
        Task<(List<ConfigList> Items, int TotalCount)> GetAllAsync(
            string? searchTerm = null,
            bool? isActive = null,
            int pageNumber = 1,
            int pageSize = 20,
            string? sortBy = null,
            string? sortOrder = null);

        Task<ConfigList?> GetByIdAsync(int id);
        Task<ConfigList?> GetByCodeAsync(string listCode);
        Task<ConfigList> AddAsync(ConfigList configList);
        Task<ConfigList> UpdateAsync(ConfigList configList);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsByCodeAsync(string listCode, int? excludeId = null);
    }
} 