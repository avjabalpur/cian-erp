using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.User;

namespace Xcianify.Core.Domain.Services
{
    public interface IUserRoleService
    {
        Task<IEnumerable<RoleDto>> GetUserRolesAsync(int userId);
        Task<IEnumerable<UserRoleDto>> GetUsersByRoleAsync(int roleId);
        Task<UserRoleDto> AssignRoleToUserAsync(UserRoleDto userRoleDto);
        Task RemoveRoleFromUserAsync(int userId, int roleId);
        Task<bool> UserHasRoleAsync(int userId, int roleId);
        Task UpdateUserRoleStatusAsync(int userId, int roleId, bool isActive);
    }
}
