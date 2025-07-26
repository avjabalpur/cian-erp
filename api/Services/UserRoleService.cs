using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.User;
using Xcianify.Core.Exceptions;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class UserRoleService : IUserRoleService
    {
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IMapper _mapper;

        public UserRoleService(
            IUserRoleRepository userRoleRepository,
            IUserRepository userRepository,
            IRoleRepository roleRepository,
            IMapper mapper)
        {
            _userRoleRepository = userRoleRepository;
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<RoleDto>> GetUserRolesAsync(int userId)
        {
            // Check if user exists
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found");

            var userRoles = await _userRoleRepository.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<RoleDto>>(userRoles);
        }

        public async Task<IEnumerable<UserRoleDto>> GetUsersByRoleAsync(int roleId)
        {
            // Check if role exists
            var role = await _roleRepository.GetByIdAsync(roleId);
            if (role == null)
                throw new NotFoundException("Role not found");

            var userRoles = await _userRoleRepository.GetByRoleIdAsync(roleId);
            return _mapper.Map<IEnumerable<UserRoleDto>>(userRoles);
        }

        public async Task<UserRoleDto> AssignRoleToUserAsync(UserRoleDto userRoleDto)
        {
            // Check if user exists
            var user = await _userRepository.GetByIdAsync(userRoleDto.UserId);
            if (user == null)
                throw new NotFoundException("User not found");

            // Check if role exists
            var role = await _roleRepository.GetByIdAsync(userRoleDto.RoleId);
            if (role == null)
                throw new NotFoundException("Role not found");

            // Check if user already has this role
            var existingUserRole = await _userRoleRepository.GetUserRoleAsync(
                userRoleDto.UserId, 
                userRoleDto.RoleId);

            if (existingUserRole != null)
            {
                // If role exists but is inactive, activate it
                if (!existingUserRole.IsActive)
                {
                    await _userRoleRepository.UpdateUserRoleStatusAsync(
                        userRoleDto.UserId, 
                        userRoleDto.RoleId, 
                        true);
                    
                    existingUserRole.IsActive = true;
                    return _mapper.Map<UserRoleDto>(existingUserRole);
                }
                
                // If role is already active, return it
                return _mapper.Map<UserRoleDto>(existingUserRole);
            }

            // Create new user role
            var userRole = _mapper.Map<UserRole>(userRoleDto);
            userRole.IsActive = true;
            userRole.AssignedAt = DateTime.UtcNow;

            var createdUserRole = await _userRoleRepository.AddUserRoleAsync(userRole);
            return _mapper.Map<UserRoleDto>(createdUserRole);
        }

        public async Task RemoveRoleFromUserAsync(int userId, int roleId)
        {
            // Check if user exists
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found");

            // Check if role exists
            var role = await _roleRepository.GetByIdAsync(roleId);
            if (role == null)
                throw new NotFoundException("Role not found");

            // Check if user has this role
            var userRole = await _userRoleRepository.GetUserRoleAsync(userId, roleId);
            if (userRole == null)
                throw new NotFoundException("User does not have the specified role");

            await _userRoleRepository.RemoveUserRoleAsync(userId, roleId);
        }

        public async Task<bool> UserHasRoleAsync(int userId, int roleId)
        {
            var userRole = await _userRoleRepository.GetUserRoleAsync(userId, roleId);
            return userRole != null && userRole.IsActive;
        }

        public async Task UpdateUserRoleStatusAsync(int userId, int roleId, bool isActive)
        {
            // Check if user exists
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found");

            // Check if role exists
            var role = await _roleRepository.GetByIdAsync(roleId);
            if (role == null)
                throw new NotFoundException("Role not found");

            // Check if user has this role
            var userRole = await _userRoleRepository.GetUserRoleAsync(userId, roleId);
            if (userRole == null)
                throw new NotFoundException("User does not have the specified role");

            await _userRoleRepository.UpdateUserRoleStatusAsync(userId, roleId, isActive);
        }
    }
}
