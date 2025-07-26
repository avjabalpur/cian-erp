using AutoMapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs;
using Xcianify.Core.Model;

namespace Xcianify.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IMapper _mapper;

        public RoleService(IRoleRepository roleRepository, IMapper mapper)
        {
            _roleRepository = roleRepository;
            _mapper = mapper;
        }

        public async Task<PaginatedResult<RoleDto>> GetAllAsync()
        {
            var response = await _roleRepository.GetAllAsync();
            var items = _mapper.Map<List<RoleDto>>(response.Items);
            return new PaginatedResult<RoleDto>
            {
                Items = items,
                TotalCount = response.TotalCount,
                PageNumber = 1,
                PageSize = 20
            };
        }

        public async Task<RoleDto> GetByIdAsync(int id)
        {
            var response = await _roleRepository.GetByIdAsync(id);
            if (response == null) return null;

            var role = _mapper.Map<RoleDto>(response);
            return role;
        }

        public async Task<RoleDto> CreateAsync(RoleDto dto)
        {
            var role = _mapper.Map<Role>(dto);
            role.CreatedAt = DateTime.UtcNow;
            role.UpdatedAt = DateTime.UtcNow;
            var result = await _roleRepository.AddAsync(role);
            return _mapper.Map<RoleDto>(result);
        }

        public async Task UpdateAsync(int id, RoleDto dto)
        {
            dto.UpdatedAt = DateTime.UtcNow;
            var role = _mapper.Map<Role>(dto);
            await _roleRepository.UpdateAsync(role);
        }

        public async Task DeleteAsync(int id)
        {
            await _roleRepository.DeleteAsync(id);
        }
    }
} 