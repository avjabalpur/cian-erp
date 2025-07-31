using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class LocationTypeRepository : ILocationTypeRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "location_type";

        public LocationTypeRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<LocationType> GetByIdAsync(int id)
        {
            var query = $@"
                SELECT id, code, name, is_active as isActive, created_at as createdAt, updated_at as updatedAt, created_by as createdBy, updated_by as updatedBy FROM {TableName}
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<LocationType>(query, new { Id = id });
        }

        public async Task<IEnumerable<LocationType>> GetAllAsync()
        {
            var query = $@"
                SELECT id, code, name, is_active as isActive, created_at as createdAt, updated_at as updatedAt, created_by as createdBy, updated_by as updatedBy FROM {TableName}
                ORDER BY name";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<LocationType>(query);
        }

        public async Task<LocationType> CreateAsync(LocationType locationType)
        {
            var query = $@"
                INSERT INTO {TableName} (
                    code, name, is_active, created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @Code, @Name, @IsActive, @CreatedAt, @UpdatedAt, @CreatedBy, @UpdatedBy
                )
                RETURNING *";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<LocationType>(query, locationType);
        }

        public async Task UpdateAsync(LocationType locationType)
        {
            var query = $@"
                UPDATE {TableName}
                SET 
                    code = @Code,
                    name = @Name,
                    is_active = @IsActive,
                    updated_at = @UpdatedAt,
                    updated_by = @UpdatedBy
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, locationType);
        }

        public async Task DeleteAsync(int id)
        {
            var query = $"DELETE FROM {TableName} WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(string code)
        {
            var query = $"SELECT COUNT(1) FROM {TableName} WHERE code = @Code";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<bool>(query, new { Code = code });
        }
    }
}
