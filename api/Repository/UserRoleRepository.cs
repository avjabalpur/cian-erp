using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class UserRoleRepository : IUserRoleRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "user_roles";

        public UserRoleRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<List<Role>> GetByUserIdAsync(int userId)
        {
            const string query = @"
                SELECT r.* 
                FROM roles r
                JOIN user_roles ur ON r.id = ur.role_id
                WHERE ur.user_id = @UserId AND ur.is_active = TRUE;";

            using var connection = _dbContext.GetConnection();
            var roles = await connection.QueryAsync<Role>(query, new { UserId = userId });
            return roles.ToList();
        }

        public async Task<IEnumerable<UserRole>> GetByRoleIdAsync(int roleId)
        {
            var query = $@"
                SELECT 
                    id as id,
                    user_id as userId,
                    role_id as roleId,
                    assigned_at as assignedAt,
                    assigned_by as assignedBy,
                    is_active as isActive
                FROM {TableName}
                WHERE role_id = @RoleId AND is_active = true";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<UserRole>(query, new { RoleId = roleId });
        }

        public async Task<UserRole> GetUserRoleAsync(int userId, int roleId)
        {
            var query = $@"
                SELECT 
                    id as id,
                    user_id as userId,
                    role_id as roleId,
                    assigned_at as assignedAt,
                    assigned_by as assignedBy,
                    is_active as isActive
                FROM {TableName}
                WHERE user_id = @UserId AND role_id = @RoleId";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<UserRole>(query, new { UserId = userId, RoleId = roleId });
        }

        public async Task<UserRole> AddUserRoleAsync(UserRole userRole)
        {
            var query = $@"
                INSERT INTO {TableName} (
                    user_id, role_id, assigned_at, assigned_by, is_active
                ) VALUES (
                    @userId, @roleId,
                    @assignedAt, @assignedBy,
                    @isActive
                )
                RETURNING *";

            userRole.AssignedAt = DateTime.UtcNow;

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<UserRole>(query, userRole);
        }

        public async Task RemoveUserRoleAsync(int userId, int roleId)
        {
            var query = $"DELETE FROM {TableName} WHERE user_id = @UserId AND role_id = @RoleId";
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { UserId = userId, RoleId = roleId });
        }

        public async Task UpdateUserRoleStatusAsync(int userId, int roleId, bool isActive)
        {
            var query = $@"
                UPDATE {TableName} 
                SET is_active = @isActive
                WHERE user_id = @userId AND role_id = @roleId";

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { userId = userId, roleId = roleId, isActive = isActive });
        }
    }
}
