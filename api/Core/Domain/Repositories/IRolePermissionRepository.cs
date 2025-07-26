using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IRolePermissionRepository
    {
        Task<RolePermission> GetByIdAsync(int id);
        Task<IEnumerable<RolePermission>> GetByRoleIdAsync(int roleId);
        Task<IEnumerable<RolePermission>> GetByPermissionIdAsync(int permissionId);
        Task<RolePermission> GetRolePermissionAsync(int roleId, int permissionId);
        Task<RolePermission> AddRolePermissionAsync(RolePermission rolePermission);
        Task RemoveRolePermissionAsync(int roleId, int permissionId);
        Task RemoveAllRolePermissionsAsync(int roleId);
        Task<bool> RoleHasPermissionAsync(int roleId, int permissionId);
        Task<IEnumerable<Permission>> GetPermissionsByRoleIdAsync(int roleId);
    }
}
