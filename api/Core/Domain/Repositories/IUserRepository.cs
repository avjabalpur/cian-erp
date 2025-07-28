using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.User;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IUserRepository
    {
        Task<(List<User> Items, int TotalCount)> GetAllAsync(UserFilterDto filterDto);
        Task<User> GetByIdAsync(int id);
        Task<User> GetByUsernameAsync(string username);
        Task<User> GetByEmailAsync(string email);
        Task<User> AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(int id);
        Task UpdateLoginInfoAsync(User user);
        Task UpdatePasswordAsync(int userId, string passwordHash);
    }
}
