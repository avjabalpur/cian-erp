using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private const string TableName = "departments";
        private readonly DapperDbContext _dbContext;

        public DepartmentRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<Department> GetByIdAsync(int id)
        {
            const string query = @"
                SELECT 
                    id as Id,
                    code as Code,
                    name as Name,
                    description as Description,
                    uom_for_mis as UomForMis,
                    is_active as IsActive,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy
                FROM ""departments""
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<Department>(query, new { Id = id });
        }

        public async Task<Department> GetByCodeAsync(string code)
        {
            const string query = @"
                SELECT 
                    id as Id,
                    code as Code,
                    name as Name,
                    description as Description,
                    uom_for_mis as UomForMis,
                    is_active as IsActive,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy
                FROM ""departments""
                WHERE code = @Code";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<Department>(query, new { Code = code });
        }

        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            const string query = @"
                SELECT 
                    id as Id,
                    code as Code,
                    name as Name,
                    description as Description,
                    uom_for_mis as UomForMis,
                    is_active as IsActive,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt
                FROM ""departments""
                ORDER BY name";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<Department>(query);
        }

        public async Task<int> CreateAsync(Department department)
        {
            const string query = @"
                INSERT INTO ""departments""
                    (code, name, description, uom_for_mis, is_active, created_by, updated_by, created_at, updated_at)
                VALUES 
                    (@Code, @Name, @Description, @UomForMis, @IsActive, @CreatedBy, @UpdatedBy, @CreatedAt, @UpdatedAt)
                RETURNING id;";

            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<int>(query, department);
        }

        public async Task<bool> UpdateAsync(Department department)
        {
            const string query = @"
                UPDATE ""departments""
                SET 
                    code = @Code,
                    name = @Name,
                    description = @Description,
                    uom_for_mis = @UomForMis,
                    is_active = @IsActive,
                    updated_by = @UpdatedBy,
                    updated_at = @UpdatedAt
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            var affectedRows = await connection.ExecuteAsync(query, department);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string query = @"DELETE FROM ""departments"" WHERE id = @Id";
            
            using var connection = _dbContext.GetConnection();
            var affectedRows = await connection.ExecuteAsync(query, new { Id = id });
            return affectedRows > 0;
        }

        public async Task<bool> CodeExistsAsync(string code, int? excludeId = null)
        {
            var query = "SELECT COUNT(*) FROM \"departments\" WHERE code = @Code";
            
            if (excludeId.HasValue)
            {
                query += " AND id != @ExcludeId";
            }
            
            using var connection = _dbContext.GetConnection();
            var count = await connection.ExecuteScalarAsync<int>(
                query, 
                new { Code = code, ExcludeId = excludeId });
                
            return count > 0;
        }
    }
}
