using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs;
using Xcianify.Core.Exceptions;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly IPermissionRepository _permissionRepository;
        private readonly IMapper _mapper;

        public PermissionService(IPermissionRepository permissionRepository, IMapper mapper)
        {
            _permissionRepository = permissionRepository ?? throw new ArgumentNullException(nameof(permissionRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<PermissionDto>> GetAllPermissionsAsync()
        {
            var permissions = await _permissionRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<PermissionDto>>(permissions);
        }

        public async Task<PermissionDto> GetPermissionByIdAsync(int id)
        {
            var permission = await _permissionRepository.GetByIdAsync(id);
            if (permission == null)
            {
                throw new NotFoundException("Permission not found");
            }
            return _mapper.Map<PermissionDto>(permission);
        }

        public async Task<PermissionDto> CreatePermissionAsync(CreatePermissionDto permissionDto)
        {
            // Check if permission with the same name already exists
            if (await _permissionRepository.ExistsAsync(permissionDto.Name))
            {
                throw new ValidationException("A permission with this name already exists");
            }

            var permission = _mapper.Map<Permission>(permissionDto);
            var createdPermission = await _permissionRepository.CreateAsync(permission);
            return _mapper.Map<PermissionDto>(createdPermission);
        }

        public async Task UpdatePermissionAsync(UpdatePermissionDto permissionDto)
        {
            // Check if permission exists
            var existingPermission = await _permissionRepository.GetByIdAsync(permissionDto.Id);
            if (existingPermission == null)
            {
                throw new NotFoundException("Permission not found");
            }

            // Check if another permission with the same name exists (excluding current permission)
            var existingWithSameName = await _permissionRepository.GetAllAsync();
            foreach (var perm in existingWithSameName)
            {
                if (perm.Id != permissionDto.Id && 
                    string.Equals(perm.Name, permissionDto.Name, StringComparison.OrdinalIgnoreCase))
                {
                    throw new ValidationException("A permission with this name already exists");
                }
            }

            var permission = _mapper.Map<Permission>(permissionDto);
            await _permissionRepository.UpdateAsync(permission);
        }

        public async Task DeletePermissionAsync(int id)
        {
            // Check if permission exists
            var permission = await _permissionRepository.GetByIdAsync(id);
            if (permission == null)
            {
                throw new NotFoundException("Permission not found");
            }

            await _permissionRepository.DeleteAsync(id);
        }
    }
}
