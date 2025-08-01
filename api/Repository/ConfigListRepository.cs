using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ConfigListRepository : IConfigListRepository
    {
        private readonly DapperDbContext _dbContext;

        public ConfigListRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<(List<ConfigList> Items, int TotalCount)> GetAllAsync(
            string? search = null,
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

            if (!string.IsNullOrWhiteSpace(search))
            {
                whereConditions.Add("(list_code LIKE @search OR list_name LIKE @search OR description LIKE @search)");
                parameters.Add("@search", $"%{search}%");
            }

            if (isActive.HasValue)
            {
                whereConditions.Add("is_active = @IsActive");
                parameters.Add("@IsActive", isActive.Value);
            }

            var whereClause = whereConditions.Count > 0 ? $"WHERE {string.Join(" AND ", whereConditions)}" : "";

            // Default sorting
            sortBy ??= "created_at";
            sortOrder ??= "desc";
            var orderClause = $"ORDER BY {sortBy} {sortOrder.ToUpper()}";

            var countSql = $@"
                SELECT COUNT(*) 
                FROM config_lists 
                {whereClause}";

            var totalCount = await connection.QuerySingleAsync<int>(countSql, parameters);

            var sql = $@"
                SELECT 
                    id, list_code as ListCode, list_name as ListName, description, is_active as IsActive,
                    created_at as CreatedAt, updated_at as UpdatedAt, created_by as CreatedBy, updated_by as UpdatedBy
                FROM config_lists 
                {whereClause}
                {orderClause}
                OFFSET @Offset ROWS 
                FETCH NEXT @PageSize ROWS ONLY";

            parameters.Add("@Offset", offset);
            parameters.Add("@PageSize", pageSize);

            var items = await connection.QueryAsync<ConfigList>(sql, parameters);

            return (items.ToList(), totalCount);
        }

        public async Task<ConfigList?> GetByIdAsync(int id)
        {
            using var connection = _dbContext.GetConnection();
            var sql = @"
                SELECT 
                    id, list_code as ListCode, list_name as ListName, description, is_active as IsActive,
                    created_at as CreatedAt, updated_at as UpdatedAt, created_by as CreatedBy, updated_by as UpdatedBy
                FROM config_lists 
                WHERE id = @Id";

            return await connection.QuerySingleOrDefaultAsync<ConfigList>(sql, new { Id = id });
        }

        public async Task<ConfigList?> GetByCodeAsync(string listCode)
        {
            using var connection = _dbContext.GetConnection();
            var sql = @"
                SELECT 
                    id, list_code as ListCode, list_name as ListName, description, is_active as IsActive,
                    created_at as CreatedAt, updated_at as UpdatedAt, created_by as CreatedBy, updated_by as UpdatedBy
                FROM config_lists 
                WHERE list_code = @ListCode";

            return await connection.QuerySingleOrDefaultAsync<ConfigList>(sql, new { ListCode = listCode });
        }

        public async Task<ConfigList> AddAsync(ConfigList configList)
        {
            using var connection = _dbContext.GetConnection();
            var sql = @"
                INSERT INTO config_lists (list_code, list_name, description, is_active, created_at, created_by)
                VALUES (@ListCode, @ListName, @Description, @IsActive, @CreatedAt, @CreatedBy);
                
                SELECT CAST(SCOPE_IDENTITY() as int)";

            var id = await connection.QuerySingleAsync<int>(sql, configList);
            configList.Id = id;
            return configList;
        }

        public async Task<ConfigList> UpdateAsync(ConfigList configList)
        {
            using var connection = _dbContext.GetConnection();
            var sql = @"
                UPDATE config_lists 
                SET list_code = @ListCode, 
                    list_name = @ListName, 
                    description = @Description, 
                    is_active = @IsActive,
                    updated_at = @UpdatedAt,
                    updated_by = @UpdatedBy
                WHERE id = @Id";

            await connection.ExecuteAsync(sql, configList);
            return configList;
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _dbContext.GetConnection();
            var sql = "DELETE FROM config_lists WHERE id = @Id";
            await connection.ExecuteAsync(sql, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _dbContext.GetConnection();
            var sql = "SELECT COUNT(1) FROM config_lists WHERE id = @Id";
            var count = await connection.QuerySingleAsync<int>(sql, new { Id = id });
            return count > 0;
        }

        public async Task<bool> ExistsByCodeAsync(string listCode, int? excludeId = null)
        {
            using var connection = _dbContext.GetConnection();
            var sql = "SELECT COUNT(1) FROM config_lists WHERE list_code = @ListCode";
            var parameters = new { ListCode = listCode };

            var count = await connection.QuerySingleAsync<int>(sql, parameters);
            return count > 0;
        }
    }
} 