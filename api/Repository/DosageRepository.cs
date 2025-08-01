using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.DTOs.Dosage;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class DosageRepository : IDosageRepository
    {
        private readonly DapperDbContext _dbContext;

        public DosageRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<Dosage> GetByIdAsync(int id)
        {
            using var connection = _dbContext.GetConnection();
            const string sql = @"
                SELECT id, name, 
                register_date as registerDate, 
                is_active as isActive, 
                created_at as createdAt, 
                updated_at as updatedAt, 
                created_by as createdBy, 
                updated_by as updatedBy
                FROM dosage 
                WHERE id = @Id";

            return await connection.QueryFirstOrDefaultAsync<Dosage>(sql, new { Id = id });
        }

        public async Task<IEnumerable<Dosage>> GetAllAsync()
        {
            using var connection = _dbContext.GetConnection();
            const string sql = @"
                SELECT id, name, 
                register_date as registerDate, 
                is_active as isActive, 
                created_at as createdAt, 
                updated_at as updatedAt, 
                created_by as createdBy, 
                updated_by as updatedBy
                FROM dosage 
                ORDER BY name";

            return await connection.QueryAsync<Dosage>(sql);
        }

        public async Task<Dosage> CreateAsync(Dosage dosage)
        {
            using var connection = _dbContext.GetConnection();
            const string sql = @"
                INSERT INTO dosage (name, register_date, is_active, created_at, created_by)
                VALUES (@Name, @RegisterDate, @IsActive, @CreatedAt, @CreatedBy)
                RETURNING id, name, register_date, is_active, created_at, updated_at, created_by, updated_by";

            return await connection.QueryFirstAsync<Dosage>(sql, dosage);
        }

        public async Task<Dosage> UpdateAsync(Dosage dosage)
        {
            using var connection = _dbContext.GetConnection();
            const string sql = @"
                UPDATE dosage 
                SET name = @Name, register_date = @RegisterDate, is_active = @IsActive, 
                    updated_at = @UpdatedAt, updated_by = @UpdatedBy
                WHERE id = @Id
                RETURNING id, name, register_date, is_active, created_at, updated_at, created_by, updated_by";

            return await connection.QueryFirstAsync<Dosage>(sql, dosage);
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _dbContext.GetConnection();
            const string sql = "UPDATE dosage SET is_active = true WHERE id = @Id";
            await connection.ExecuteAsync(sql, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _dbContext.GetConnection();
            const string sql = "SELECT COUNT(*) FROM dosage WHERE id = @Id";
            var count = await connection.ExecuteScalarAsync<int>(sql, new { Id = id });
            return count > 0;
        }

        public async Task<bool> ExistsByNameAsync(string name, int? excludeId = null)
        {
            using var connection = _dbContext.GetConnection();
            var sql = "SELECT COUNT(*) FROM dosage WHERE name = @Name";
            var parameters = new { Name = name };

            var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
            return count > 0;
        }
    }
} 