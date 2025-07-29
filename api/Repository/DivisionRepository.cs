using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class DivisionRepository : IDivisionRepository
    {
        private const string TableName = "divisions";
        private readonly DapperDbContext _dbContext;

        public DivisionRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<Division> GetByIdAsync(int id)
        {
            const string query = @"
                SELECT 
                    d.*,
                    dept.id as Department_Id,
                    dept.code as Department_Code,
                    dept.name as Department_Name
                FROM divisions d
                LEFT JOIN departments dept ON d.department_id = dept.id
                WHERE d.id = @Id";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<Division>(query, new { Id = id });

        }

        public async Task<Division> GetByCodeAsync(string code)
        {
            const string query = @"
                SELECT 
                    d.*,
                    dept.id as Department_Id,
                    dept.code as Department_Code,
                    dept.name as Department_Name
                FROM divisions d
                LEFT JOIN departments dept ON d.department_id = dept.id
                WHERE d.code = @Code";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<Division>( query, new { Code = code });
        }

        public async Task<IEnumerable<Division>> GetAllAsync()
        {
            const string query = @"
                SELECT 
                    d.*,
                    dept.id as Department_Id,
                    dept.code as Department_Code,
                    dept.name as Department_Name
                FROM divisions d
                LEFT JOIN departments dept ON d.department_id = dept.id
                ORDER BY d.name";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<Division, Department, Division>(
                query,
                (division, department) =>
                {
                    division.Department = department;
                    return division;
                },
                splitOn: "Department_Id"
            );
        }

        public async Task<IEnumerable<Division>> GetByDepartmentIdAsync(int departmentId)
        {
            const string query = @"
                SELECT 
                    d.*,
                    dept.id as Department_Id,
                    dept.code as Department_Code,
                    dept.name as Department_Name
                FROM divisions d
                LEFT JOIN departments dept ON d.department_id = dept.id
                WHERE d.department_id = @DepartmentId
                ORDER BY d.name";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<Division, Department, Division>(
                query,
                (division, department) =>
                {
                    division.Department = department;
                    return division;
                },
                new { DepartmentId = departmentId },
                splitOn: "Department_Id"
            );
        }

        public async Task<int> CreateAsync(Division division)
        {
            const string query = @"
                INSERT INTO divisions
                    (code, department_id, name, description, unit, conversion_factor, 
                     is_active, created_by, updated_by, created_at, updated_at)
                VALUES 
                    (@Code, @DepartmentId, @Name, @Description, @Unit, @ConversionFactor, 
                     @IsActive, @CreatedBy, @UpdatedBy, @CreatedAt, @UpdatedAt)
                RETURNING id;";

            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<int>(query, division);
        }

        public async Task<bool> UpdateAsync(Division division)
        {
            const string query = @"
                UPDATE divisions
                SET 
                    code = @Code,
                    department_id = @DepartmentId,
                    name = @Name,
                    description = @Description,
                    unit = @Unit,
                    conversion_factor = @ConversionFactor,
                    is_active = @IsActive,
                    updated_by = @UpdatedBy,
                    updated_at = @UpdatedAt
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            var affectedRows = await connection.ExecuteAsync(query, division);
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string query = @"DELETE FROM divisions WHERE id = @Id";
            
            using var connection = _dbContext.GetConnection();
            var affectedRows = await connection.ExecuteAsync(query, new { Id = id });
            return affectedRows > 0;
        }

        public async Task<bool> CodeExistsAsync(string code, int? excludeId = null)
        {
            var query = "SELECT COUNT(*) FROM divisions WHERE code = @Code";
            
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
