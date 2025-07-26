using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IPermissionRepository
    {
        Task<Permission> GetByIdAsync(int id);
        Task<IEnumerable<Permission>> GetAllAsync();
        Task<Permission> CreateAsync(Permission permission);
        Task UpdateAsync(Permission permission);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(string name);
    }
}
