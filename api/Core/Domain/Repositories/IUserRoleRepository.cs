using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IUserRoleRepository
    {
        Task<List<Role>> GetByUserIdAsync(int userId);
        Task<IEnumerable<UserRole>> GetByRoleIdAsync(int roleId);
        Task<UserRole> GetUserRoleAsync(int userId, int roleId);
        Task<UserRole> AddUserRoleAsync(UserRole userRole);
        Task RemoveUserRoleAsync(int userId, int roleId);
        Task UpdateUserRoleStatusAsync(int userId, int roleId, bool isActive);
    }
}
