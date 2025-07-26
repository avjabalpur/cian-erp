using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xcianify.Core.DTOs.User;
using Xcianify.Core.Domain.Services;

namespace Xcianify.Presentation.Controllers
{
    [Route("api/users")]
    public class UserController : BaseApiController
    {
        private readonly IUserService _userService;
        private readonly IUserRoleService _userRoleService;

        public UserController(
            IUserService userService,
            IUserRoleService userRoleService)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _userRoleService = userRoleService ?? throw new ArgumentNullException(nameof(userRoleService));
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserFilterDto filterDto)
        {
            var (items, _) = await _userService.GetAllUsersAsync(filterDto);
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            var createdUser = await _userService.CreateUserAsync(createUserDto);
            return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto)
        {
            if (id != updateUserDto.Id)
            {
                return BadRequest("ID mismatch");
            }
            await _userService.UpdateUserAsync(updateUserDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }


        [HttpGet("{userId}/roles")]
        public async Task<IActionResult> GetUserRoles(int userId)
        {
            var roles = await _userRoleService.GetUserRolesAsync(userId);
            return Ok(roles);
        }

        [HttpPost("{userId}/assign-role")]
        public async Task<IActionResult> AssignRole(int userId, [FromBody] UserRoleAssignmentDto assignmentDto)
        {
            var result = new List<UserRoleDto>();
            var userRoleDto = new UserRoleDto
            {
                UserId = userId,
                RoleId = assignmentDto.RoleId,
                AssignedBy = userId,
                IsActive = assignmentDto.IsActive
            };
            result.Add(await _userRoleService.AssignRoleToUserAsync(userRoleDto));
            return Ok(result);
        }

        [HttpDelete("{userId}/roles/{roleId}")]
        public async Task<IActionResult> RemoveRole(int userId, int roleId)
        {
            await _userRoleService.RemoveRoleFromUserAsync(userId, roleId);
            return NoContent();
        }
    }
}
