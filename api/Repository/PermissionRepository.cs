using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class PermissionRepository : IPermissionRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "permissions";

        public PermissionRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<Permission> GetByIdAsync(int id)
        {
            var query = $@"
                SELECT 
                    id as Id,
                    name as Name,
                    description as Description,
                    module_name as ModuleName,
                    action_type as ActionType,
                    is_active as IsActive,
                    created_at as CreatedAt
                FROM {TableName}
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<Permission>(query, new { Id = id });
        }

        public async Task<IEnumerable<Permission>> GetAllAsync()
        {
            var query = $@"
                SELECT 
                    id as Id,
                    name as Name,
                    description as Description,
                    module_name as ModuleName,
                    action_type as ActionType,
                    is_active as IsActive,
                    created_at as CreatedAt
                FROM {TableName}
                ORDER BY name";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<Permission>(query);
        }

        public async Task<Permission> CreateAsync(Permission permission)
        {
            var query = $@"
                INSERT INTO {TableName} (
                    name, description, module_name, action_type, is_active, created_at
                ) VALUES (
                    @Name, @Description, @ModuleName, @ActionType, @IsActive, @CreatedAt
                )
                RETURNING *";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<Permission>(query, permission);
        }

        public async Task UpdateAsync(Permission permission)
        {
            var query = $@"
                UPDATE {TableName} 
                SET 
                    name = @Name,
                    description = @Description,
                    module_name = @ModuleName,
                    action_type = @ActionType,
                    is_active = @IsActive
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, permission);
        }

        public async Task DeleteAsync(int id)
        {
            var query = $"DELETE FROM {TableName} WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(string name)
        {
            var query = $"SELECT COUNT(1) FROM {TableName} WHERE name = @Name";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<bool>(query, new { Name = name });
        }
    }
}
