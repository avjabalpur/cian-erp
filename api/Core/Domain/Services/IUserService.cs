using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.User;

namespace Xcianify.Core.Domain.Services
{
    public interface IUserService
    {
        Task<(IEnumerable<UserDto> Items, int TotalCount)> GetAllUsersAsync(UserFilterDto filterDto);
        Task<UserDto> GetUserByIdAsync(int id);
        Task<UserDto> GetUserByUsernameAsync(string username);
        Task<UserDto> GetUserByEmailAsync(string email);
        Task<UserDto> CreateUserAsync(CreateUserDto userDto);
        Task UpdateUserAsync(UpdateUserDto userDto);
        Task DeleteUserAsync(int id);
        Task<bool> CheckPasswordAsync(int userId, string password);
        Task UpdatePasswordAsync(int userId, string currentPassword, string newPassword);
        Task ResetPasswordAsync(int userId, string newPassword);
        Task LockUserAccountAsync(int userId, int minutes);
        Task UnlockUserAccountAsync(int userId);
        Task UpdateLastLoginAsync(int userId);
    }
}
