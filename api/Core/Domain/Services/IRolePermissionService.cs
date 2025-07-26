using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs;

namespace Xcianify.Core.Domain.Services
{
    public interface IRolePermissionService
    {
        Task<IEnumerable<RolePermissionDto>> GetRolePermissionsAsync(int roleId);
        Task<IEnumerable<PermissionDto>> GetPermissionsByRoleIdAsync(int roleId);
        Task<IEnumerable<RolePermissionDto>> AssignPermissionsToRoleAsync(AssignPermissionToRoleDto assignmentDto);
        Task RemovePermissionFromRoleAsync(int roleId, int permissionId);
        Task<bool> RoleHasPermissionAsync(int roleId, int permissionId);
    }
}
