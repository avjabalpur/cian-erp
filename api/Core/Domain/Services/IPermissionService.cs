using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs;

namespace Xcianify.Core.Domain.Services
{
    public interface IPermissionService
    {
        Task<IEnumerable<PermissionDto>> GetAllPermissionsAsync();
        Task<PermissionDto> GetPermissionByIdAsync(int id);
        Task<PermissionDto> CreatePermissionAsync(CreatePermissionDto permissionDto);
        Task UpdatePermissionAsync(UpdatePermissionDto permissionDto);
        Task DeletePermissionAsync(int id);
    }
}
