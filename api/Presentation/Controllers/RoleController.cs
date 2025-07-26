using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/roles")]
    public class RoleController : BaseApiController
    {
        private readonly IRoleService _roleService;
        private readonly IRolePermissionService _rolePermissionService;

        public RoleController(IRoleService roleService, IRolePermissionService rolePermissionService)
        {
            _roleService = roleService;
            _rolePermissionService = rolePermissionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _roleService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _roleService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RoleDto dto)
        {
            var result = await _roleService.CreateAsync(dto);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RoleDto dto)
        {
            await _roleService.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRole(int id)
        {
            await _roleService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("{id}/permissions")]
        public async Task<IActionResult> GetRolePermissions(int id)
        {
            var permissions = await _rolePermissionService.GetPermissionsByRoleIdAsync(id);
            return Ok(permissions);

        }

        [HttpPost("{id}/permissions")]

        public async Task<IActionResult> AssignPermissionsToRole(int id,[FromBody] AssignPermissionToRoleDto assignmentDto)
        {
            assignmentDto.GrantedBy = id;
            var result = await _rolePermissionService.AssignPermissionsToRoleAsync(assignmentDto);
            return Ok(result);

        }

        [HttpDelete("{id}/permissions/{permissionId}")]
        public async Task<IActionResult> RemovePermissionFromRole(int id, int permissionId)
        {
            await _rolePermissionService.RemovePermissionFromRoleAsync(id, permissionId);
            return NoContent();

        }

        [HttpGet("{id}/permissions/{permissionId}/check")]
        public async Task<IActionResult> CheckRolePermission(int id, int permissionId)
        {
            var hasPermission = await _rolePermissionService.RoleHasPermissionAsync(id, permissionId);
            return Ok(hasPermission);

        }
    }
} 