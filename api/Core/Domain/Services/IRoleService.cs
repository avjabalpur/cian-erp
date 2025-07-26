using Xcianify.Core.DTOs;

namespace Xcianify.Core.Domain.Services
{
    public interface IRoleService
    {
        Task<PaginatedResult<RoleDto>> GetAllAsync();
        Task<RoleDto> GetByIdAsync(int id);
        Task<RoleDto> CreateAsync(RoleDto dto);
        Task UpdateAsync(int id, RoleDto dto);
        Task DeleteAsync(int id);
    }
} 