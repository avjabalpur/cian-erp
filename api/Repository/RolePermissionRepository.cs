using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class RolePermissionRepository : IRolePermissionRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "role_permissions";
        private const string PermissionsTable = "permissions";

        public RolePermissionRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<RolePermission> GetByIdAsync(int id)
        {
            var query = $@"
                SELECT 
                    id as Id,
                    role_id as RoleId,
                    permission_id as PermissionId,
                    granted_at as GrantedAt,
                    granted_by as GrantedBy
                FROM {TableName}
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<RolePermission>(query, new { Id = id });
        }

        public async Task<IEnumerable<RolePermission>> GetByRoleIdAsync(int roleId)
        {
            var query = $@"
                SELECT 
                    id as Id,
                    role_id as RoleId,
                    permission_id as PermissionId,
                    granted_at as GrantedAt,
                    granted_by as GrantedBy
                FROM {TableName}
                WHERE role_id = @RoleId";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<RolePermission>(query, new { RoleId = roleId });
        }

        public async Task<IEnumerable<RolePermission>> GetByPermissionIdAsync(int permissionId)
        {
            var query = $@"
                SELECT 
                    id as Id,
                    role_id as RoleId,
                    permission_id as PermissionId,
                    granted_at as GrantedAt,
                    granted_by as GrantedBy
                FROM {TableName}
                WHERE permission_id = @PermissionId";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<RolePermission>(query, new { PermissionId = permissionId });
        }

        public async Task<RolePermission> GetRolePermissionAsync(int roleId, int permissionId)
        {
            var query = $@"
                SELECT 
                    id as Id,
                    role_id as RoleId,
                    permission_id as PermissionId,
                    granted_at as GrantedAt,
                    granted_by as GrantedBy
                FROM {TableName}
                WHERE role_id = @RoleId AND permission_id = @PermissionId";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<RolePermission>(query, new { RoleId = roleId, PermissionId = permissionId });
        }

        public async Task<RolePermission> AddRolePermissionAsync(RolePermission rolePermission)
        {
            var query = $@"
                INSERT INTO {TableName} (
                    role_id, permission_id, granted_at, granted_by
                ) VALUES (
                    @RoleId, @PermissionId, @GrantedAt, @GrantedBy
                )
                RETURNING *";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<RolePermission>(query, rolePermission);
        }

        public async Task RemoveRolePermissionAsync(int roleId, int permissionId)
        {
            var query = $"DELETE FROM {TableName} WHERE role_id = @RoleId AND permission_id = @PermissionId";
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { RoleId = roleId, PermissionId = permissionId });
        }

        public async Task RemoveAllRolePermissionsAsync(int roleId)
        {
            var query = $"DELETE FROM {TableName} WHERE role_id = @RoleId";
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { RoleId = roleId });
        }

        public async Task<bool> RoleHasPermissionAsync(int roleId, int permissionId)
        {
            var query = $"SELECT COUNT(1) FROM {TableName} WHERE role_id = @RoleId AND permission_id = @PermissionId";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<bool>(query, new { RoleId = roleId, PermissionId = permissionId });
        }

        public async Task<IEnumerable<Permission>> GetPermissionsByRoleIdAsync(int roleId)
        {
            var query = $@"
                SELECT 
                    p.id as Id,
                    p.name as Name,
                    p.description as Description,
                    p.module_name as ModuleName,
                    p.action_type as ActionType,
                    p.is_active as IsActive,
                    p.created_at as CreatedAt
                FROM {PermissionsTable} p
                INNER JOIN {TableName} rp ON p.id = rp.permission_id
                WHERE rp.role_id = @RoleId";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<Permission>(query, new { RoleId = roleId });
        }
    }
}
