using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ItemTypeRepository : IItemTypeRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "item_type";

        public ItemTypeRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<(List<ItemType> Items, int TotalCount)> GetAllAsync(ItemTypeFilterDto filterDto)
        {
            var whereConditions = new List<string>();
            var parameters = new DynamicParameters();

            // Add search filter
            if (!string.IsNullOrWhiteSpace(filterDto.Search))
            {
                whereConditions.Add("(LOWER(code) LIKE @search OR LOWER(name) LIKE @search OR LOWER(description) LIKE @search)");
                parameters.Add("@search", $"%{filterDto.Search.ToLower()}%");
            }

            // Add isActive filter
            if (filterDto.IsActive.HasValue)
            {
                whereConditions.Add("is_active = @IsActive");
                parameters.Add("@IsActive", filterDto.IsActive.Value);
            }

            var whereClause = whereConditions.Count > 0 ? $"WHERE {string.Join(" AND ", whereConditions)}" : "";

            // Calculate offset for pagination
            var offset = (filterDto.PageNumber - 1) * filterDto.PageSize;

            var query = $@"
                SELECT 
                    id as Id,
                    code as Code,
                    name as Name,
                    description as Description,
                    parent_type_id as ParentTypeId,
                    is_active as IsActive,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy
                FROM {TableName}
                {whereClause}
                ORDER BY created_at DESC
                LIMIT @PageSize OFFSET @Offset;
                
                SELECT COUNT(*) FROM {TableName} {whereClause};";

            parameters.Add("@PageSize", filterDto.PageSize);
            parameters.Add("@Offset", offset);

            using var connection = _dbContext.GetConnection();
            using var multi = await connection.QueryMultipleAsync(query, parameters);
            var items = (await multi.ReadAsync<ItemType>()).AsList();
            var totalCount = await multi.ReadFirstAsync<int>();

            return (items, totalCount);
        }

        public async Task<ItemType> GetByIdAsync(int id)
        {
            var query = $@"
                SELECT 
                    id as Id,
                    code as Code,
                    name as Name,
                    description as Description,
                    parent_type_id as ParentTypeId,
                    is_active as IsActive,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy
                FROM {TableName}
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ItemType>(query, new { Id = id });
        }

        public async Task<ItemType> AddAsync(ItemType itemType)
        {
            var query = $@"
                INSERT INTO {TableName} (
                    code, name, description, parent_type_id, is_active, 
                    created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @Code, @Name, @Description, @ParentTypeId, @IsActive,
                    @CreatedAt, @UpdatedAt, @CreatedBy, @UpdatedBy
                )
                RETURNING *";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<ItemType>(query, itemType);
        }

        public async Task UpdateAsync(ItemType itemType)
        {
            var query = $@"
                UPDATE {TableName} 
                SET code = @Code,
                    name = @Name,
                    description = @Description,
                    parent_type_id = @ParentTypeId,
                    is_active = @IsActive,
                    updated_at = @UpdatedAt,
                    updated_by = @UpdatedBy
                WHERE id = @Id";

            itemType.UpdatedAt = DateTime.UtcNow;

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, itemType);
        }

        public async Task DeleteAsync(int id)
        {
            var query = $"DELETE FROM {TableName} WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(string code, int? excludeId = null)
        {
            var sql = $"SELECT COUNT(*) FROM {TableName} WHERE code = @Code";
            var parameters = new DynamicParameters();
            parameters.Add("Code", code);

            if (excludeId.HasValue)
            {
                sql += " AND id != @ExcludeId";
                parameters.Add("ExcludeId", excludeId.Value);
            }

            using var connection = _dbContext.GetConnection();
            var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
            return count > 0;
        }

        public async Task<IEnumerable<ItemType>> GetParentTypesAsync()
        {
            var query = $@"
                SELECT 
                    id as Id,
                    code as Code,
                    name as Name,
                    description as Description,
                    parent_type_id as ParentTypeId,
                    is_active as IsActive,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy
                FROM {TableName} 
                WHERE is_active = true
                ORDER BY name";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<ItemType>(query);
        }

    }
}
