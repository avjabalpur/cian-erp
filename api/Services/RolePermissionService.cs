using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs;
using Xcianify.Core.Exceptions;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class RolePermissionService : IRolePermissionService
    {
        private readonly IRolePermissionRepository _rolePermissionRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IPermissionRepository _permissionRepository;
        private readonly IMapper _mapper;

        public RolePermissionService(
            IRolePermissionRepository rolePermissionRepository,
            IRoleRepository roleRepository,
            IPermissionRepository permissionRepository,
            IMapper mapper)
        {
            _rolePermissionRepository = rolePermissionRepository ?? throw new ArgumentNullException(nameof(rolePermissionRepository));
            _roleRepository = roleRepository ?? throw new ArgumentNullException(nameof(roleRepository));
            _permissionRepository = permissionRepository ?? throw new ArgumentNullException(nameof(permissionRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<RolePermissionDto>> GetRolePermissionsAsync(int roleId)
        {
            // Check if role exists
            var role = await _roleRepository.GetByIdAsync(roleId);
            if (role == null)
            {
                throw new NotFoundException("Role not found");
            }

            var rolePermissions = await _rolePermissionRepository.GetByRoleIdAsync(roleId);
            return _mapper.Map<IEnumerable<RolePermissionDto>>(rolePermissions);
        }

        public async Task<IEnumerable<PermissionDto>> GetPermissionsByRoleIdAsync(int roleId)
        {
            // Check if role exists
            var role = await _roleRepository.GetByIdAsync(roleId);
            if (role == null)
            {
                throw new NotFoundException("Role not found");
            }

            var permissions = await _rolePermissionRepository.GetPermissionsByRoleIdAsync(roleId);
            return _mapper.Map<IEnumerable<PermissionDto>>(permissions);
        }

        public async Task<IEnumerable<RolePermissionDto>> AssignPermissionsToRoleAsync(AssignPermissionToRoleDto assignmentDto)
        {
            var results = new List<RolePermissionDto>();
            var grantedAt = DateTime.UtcNow;

            var rolePermission = new RolePermission
            {
                RoleId = assignmentDto.RoleId,
                PermissionId = assignmentDto.PermissionId,
                GrantedAt = grantedAt,
                GrantedBy = assignmentDto.GrantedBy
            };

            var created = await _rolePermissionRepository.AddRolePermissionAsync(rolePermission);
            results.Add(_mapper.Map<RolePermissionDto>(created));

            return results;
        }

        public async Task RemovePermissionFromRoleAsync(int roleId, int permissionId)
        {
            // Check if role exists
            var role = await _roleRepository.GetByIdAsync(roleId);
            if (role == null)
            {
                throw new NotFoundException("Role not found");
            }

            // Check if permission exists
            var permission = await _permissionRepository.GetByIdAsync(permissionId);
            if (permission == null)
            {
                throw new NotFoundException("Permission not found");
            }

            // Check if the role has this permission
            var hasPermission = await _rolePermissionRepository.RoleHasPermissionAsync(roleId, permissionId);
            if (!hasPermission)
            {
                throw new ValidationException("The role does not have this permission");
            }

            await _rolePermissionRepository.RemoveRolePermissionAsync(roleId, permissionId);
        }

        public async Task<bool> RoleHasPermissionAsync(int roleId, int permissionId)
        {
            // Check if role exists
            var role = await _roleRepository.GetByIdAsync(roleId);
            if (role == null)
            {
                throw new NotFoundException("Role not found");
            }

            // Check if permission exists
            var permission = await _permissionRepository.GetByIdAsync(permissionId);
            if (permission == null)
            {
                throw new NotFoundException("Permission not found");
            }

            return await _rolePermissionRepository.RoleHasPermissionAsync(roleId, permissionId);
        }
    }
}
