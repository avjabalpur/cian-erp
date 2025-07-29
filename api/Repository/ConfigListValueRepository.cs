using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ConfigListValueRepository : IConfigListValueRepository
    {
        private readonly DapperDbContext _dbContext;

        public ConfigListValueRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<(List<ConfigListValue> Items, int TotalCount)> GetAllAsync(
            int? listId = null,
            string? searchTerm = null,
            bool? isActive = null,
            int pageNumber = 1,
            int pageSize = 20,
            string? sortBy = null,
            string? sortOrder = null)
        {
            using var connection = _dbContext.GetConnection();

            var offset = (pageNumber - 1) * pageSize;
            var whereConditions = new List<string>();
            var parameters = new DynamicParameters();

            if (listId.HasValue)
            {
                whereConditions.Add("clv.list_id = @ListId");
                parameters.Add("@ListId", listId.Value);
            }

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                whereConditions.Add("(clv.value_code LIKE @SearchTerm OR clv.value_name LIKE @SearchTerm)");
                parameters.Add("@SearchTerm", $"%{searchTerm}%");
            }

            if (isActive.HasValue)
            {
                whereConditions.Add("clv.is_active = @IsActive");
                parameters.Add("@IsActive", isActive.Value);
            }

            var whereClause = whereConditions.Count > 0 ? $"WHERE {string.Join(" AND ", whereConditions)}" : "";

            // Default sorting
            sortBy ??= "clv.display_order";
            sortOrder ??= "asc";
            var orderClause = $"ORDER BY {sortBy} {sortOrder.ToUpper()}";

            var countSql = $@"
                SELECT COUNT(*) 
                FROM config_list_values clv
                LEFT JOIN config_lists cl ON clv.list_id = cl.id
                {whereClause}";

            var totalCount = await connection.QuerySingleAsync<int>(countSql, parameters);

            var sql = $@"
                SELECT 
                    clv.id, clv.list_id as ListId, clv.value_code as ValueCode, clv.value_name as ValueName, 
                    clv.display_order as DisplayOrder, clv.is_active as IsActive, clv.extra_data as ExtraData,
                    clv.created_at as CreatedAt, clv.updated_at as UpdatedAt, clv.created_by as CreatedBy, clv.updated_by as UpdatedBy,
                    cl.list_code as ListCode, cl.list_name as ListName
                FROM config_list_values clv
                LEFT JOIN config_lists cl ON clv.list_id = cl.id
                {whereClause}
                {orderClause}
                OFFSET @Offset ROWS 
                FETCH NEXT @PageSize ROWS ONLY";

            parameters.Add("@Offset", offset);
            parameters.Add("@PageSize", pageSize);

            var items = await connection.QueryAsync<ConfigListValue>(sql, parameters);

            return (items.ToList(), totalCount);
        }

        public async Task<ConfigListValue?> GetByIdAsync(int id)
        {
            using var connection = _dbContext.GetConnection();
            var sql = @"
                SELECT 
                    clv.id, clv.list_id as ListId, clv.value_code as ValueCode, clv.value_name as ValueName, 
                    clv.display_order as DisplayOrder, clv.is_active as IsActive, clv.extra_data as ExtraData,
                    clv.created_at as CreatedAt, clv.updated_at as UpdatedAt, clv.created_by as CreatedBy, clv.updated_by as UpdatedBy,
                    cl.list_code as ListCode, cl.list_name as ListName
                FROM config_list_values clv
                LEFT JOIN config_lists cl ON clv.list_id = cl.id
                WHERE clv.id = @Id";

            return await connection.QuerySingleOrDefaultAsync<ConfigListValue>(sql, new { Id = id });
        }

        public async Task<List<ConfigListValue>> GetByListIdAsync(int listId)
        {
            using var connection = _dbContext.GetConnection();
            var sql = @"
                SELECT 
                    clv.id, clv.list_id as ListId, clv.value_code as ValueCode, clv.value_name as ValueName, 
                    clv.display_order as DisplayOrder, clv.is_active as IsActive, clv.extra_data as ExtraData,
                    clv.created_at as CreatedAt, clv.updated_at as UpdatedAt, clv.created_by as CreatedBy, clv.updated_by as UpdatedBy,
                    cl.list_code as ListCode, cl.list_name as ListName
                FROM config_list_values clv
                LEFT JOIN config_lists cl ON clv.list_id = cl.id
                WHERE clv.list_id = @ListId
                ORDER BY clv.display_order ASC, clv.value_name ASC";

            var items = await connection.QueryAsync<ConfigListValue>(sql, new { ListId = listId });
            return items.ToList();
        }

        public async Task<ConfigListValue> AddAsync(ConfigListValue configListValue)
        {
            using var connection = _dbContext.GetConnection();
            var sql = @"
                INSERT INTO config_list_values (list_id, value_code, value_name, display_order, is_active, extra_data, created_at, created_by)
                VALUES (@ListId, @ValueCode, @ValueName, @DisplayOrder, @IsActive, @ExtraData, @CreatedAt, @CreatedBy);
                
                SELECT CAST(SCOPE_IDENTITY() as int)";

            var id = await connection.QuerySingleAsync<int>(sql, configListValue);
            configListValue.Id = id;
            return configListValue;
        }

        public async Task<ConfigListValue> UpdateAsync(ConfigListValue configListValue)
        {
            using var connection = _dbContext.GetConnection();
            var sql = @"
                UPDATE config_list_values 
                SET list_id = @ListId,
                    value_code = @ValueCode, 
                    value_name = @ValueName, 
                    display_order = @DisplayOrder,
                    is_active = @IsActive,
                    extra_data = @ExtraData,
                    updated_at = @UpdatedAt,
                    updated_by = @UpdatedBy
                WHERE id = @Id";

            await connection.ExecuteAsync(sql, configListValue);
            return configListValue;
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _dbContext.GetConnection();
            var sql = "DELETE FROM config_list_values WHERE id = @Id";
            await connection.ExecuteAsync(sql, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _dbContext.GetConnection();
            var sql = "SELECT COUNT(1) FROM config_list_values WHERE id = @Id";
            var count = await connection.QuerySingleAsync<int>(sql, new { Id = id });
            return count > 0;
        }

        public async Task<bool> ExistsByCodeAsync(int listId, string valueCode, int? excludeId = null)
        {
            using var connection = _dbContext.GetConnection();
            var sql = "SELECT COUNT(1) FROM config_list_values WHERE list_id = @ListId AND value_code = @ValueCode";
            var parameters = new { ListId = listId, ValueCode = valueCode };

            var count = await connection.QuerySingleAsync<int>(sql, parameters);
            return count > 0;
        }
    }
} 