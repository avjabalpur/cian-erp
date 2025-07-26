using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.DTOs;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/permissions")]
    public class PermissionController : BaseApiController
    {
        private readonly IPermissionService _permissionService;

        public PermissionController(IPermissionService permissionService)
        {
            _permissionService = permissionService ?? throw new ArgumentNullException(nameof(permissionService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPermissions()
        {
            var permissions = await _permissionService.GetAllPermissionsAsync();
            return Ok(permissions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPermission(int id)
        {
            var permission = await _permissionService.GetPermissionByIdAsync(id);
            return Ok(permission);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePermission([FromBody] CreatePermissionDto permissionDto)
        {

            var createdPermission = await _permissionService.CreatePermissionAsync(permissionDto);
            return CreatedAtAction(nameof(GetPermission), new { id = createdPermission.Id }, createdPermission);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePermission(int id, [FromBody] UpdatePermissionDto permissionDto)
        {

            await _permissionService.UpdatePermissionAsync(permissionDto);
            return NoContent();

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePermission(int id)
        {
            await _permissionService.DeletePermissionAsync(id);
            return NoContent();

        }
    }
}
