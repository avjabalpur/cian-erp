using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class RoleRepository : IRoleRepository
    {
        private readonly DapperDbContext _dbContext;
        private readonly string _tableName = "roles";
        public RoleRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }


        public async Task<(List<Role> Items, int TotalCount)> GetAllAsync()
        {
            var query = $@"
                SELECT 
                    id as id, 
                    name as name, 
                    description as description, 
                    is_active as isActive, 
                    created_at as createdAt, 
                    updated_at as updatedAt 
                FROM {_tableName}
                ORDER BY created_at DESC
               ;
                
                SELECT COUNT(*) FROM {_tableName};";

            using var connection = _dbContext.GetConnection();
            using var multi = await connection.QueryMultipleAsync(query);
            var items = (await multi.ReadAsync<Role>()).ToList();
            var totalCount = await multi.ReadFirstAsync<int>();

            return (items, totalCount);
        }

        public async Task<Role> GetByIdAsync(int id)
        {
            var query = $@"SELECT 
                id as id, 
                name as name, 
                description as description, 
                is_active as isActive, 
                created_at as createdAt, 
                updated_at as updatedAt 
            FROM {_tableName} WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<Role>(query, new { Id = id });
        }

        public async Task<Role> AddAsync(Role quote)
        {
            var query = $@"
                    INSERT INTO {_tableName} (
                        name, 
                        description, 
                        is_active, 
                        created_at, 
                        updated_at)
                VALUES (@Name, @Description, @IsActive, @CreatedAt, @UpdatedAt)
                RETURNING *";

            quote.CreatedAt = DateTime.UtcNow;
            quote.UpdatedAt = DateTime.UtcNow;

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<Role>(query, quote);
        }

        public async Task UpdateAsync(Role quote)
        {
            var query = $@"
                UPDATE {_tableName} 
                SET name = @Name,
                    description = @Description,
                    is_active = @IsActive,
                    updated_at = @UpdatedAt
                WHERE id = @Id";

            quote.UpdatedAt = DateTime.UtcNow;

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, quote);
        }

        public async Task DeleteAsync(int id)
        {
            var query = $@"DELETE FROM {_tableName} WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { Id = id });
        }
    }
} 