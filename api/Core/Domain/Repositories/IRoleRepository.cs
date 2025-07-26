using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IRoleRepository
    {
        Task<(List<Role> Items, int TotalCount)> GetAllAsync();
        Task<Role> GetByIdAsync(int id);
        Task<Role> AddAsync(Role quote);
        Task UpdateAsync(Role quote);
        Task DeleteAsync(int id);
    }
} 