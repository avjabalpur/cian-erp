using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ProductTypeRepository : IProductTypeRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "product_type";

        public ProductTypeRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<ProductType> GetByIdAsync(int id)
        {
            using var connection = _dbContext.GetConnection();
            const string sql = @"
                SELECT 
                    id, code, name, description, parent_type_id as ParentTypeId,
                    is_active as IsActive, created_at as CreatedAt, updated_at as UpdatedAt,
                    created_by as CreatedBy, updated_by as UpdatedBy
                FROM product_type 
                WHERE id = @Id";

            return await connection.QueryFirstOrDefaultAsync<ProductType>(sql, new { Id = id });
        }

        public async Task<IEnumerable<ProductType>> GetAllAsync()
        {
            using var connection = _dbContext.GetConnection();
            const string sql = @"
                SELECT 
                    id, code, name, description, parent_type_id as ParentTypeId,
                    is_active as IsActive, created_at as CreatedAt, updated_at as UpdatedAt,
                    created_by as CreatedBy, updated_by as UpdatedBy
                FROM product_type 
                ORDER BY code";

            return await connection.QueryAsync<ProductType>(sql);
        }

        public async Task<IEnumerable<ProductType>> GetActiveAsync()
        {
            using var connection = _dbContext.GetConnection();
            const string sql = @"
                SELECT 
                    id, code, name, description, parent_type_id as ParentTypeId,
                    is_active as IsActive, created_at as CreatedAt, updated_at as UpdatedAt,
                    created_by as CreatedBy, updated_by as UpdatedBy
                FROM product_type 
                WHERE is_active = true
                ORDER BY code";

            return await connection.QueryAsync<ProductType>(sql);
        }

        public async Task<IEnumerable<ProductType>> GetParentTypesAsync()
        {
            using var connection = _dbContext.GetConnection();
            const string sql = @"
                SELECT 
                    id, code, name, description, parent_type_id as ParentTypeId,
                    is_active as IsActive, created_at as CreatedAt, updated_at as UpdatedAt,
                    created_by as CreatedBy, updated_by as UpdatedBy
                FROM product_type 
                WHERE parent_type_id IS NULL AND is_active = true
                ORDER BY code";

            return await connection.QueryAsync<ProductType>(sql);
        }

        public async Task<bool> CodeExistsAsync(string code, int? excludeId = null)
        {
            using var connection = _dbContext.GetConnection();
            var sql = "SELECT COUNT(*) FROM product_type WHERE code = @Code";
            var parameters = new DynamicParameters();
            parameters.Add("@code", code);

            if (excludeId.HasValue)
            {
                sql += " AND id != @ExcludeId";
                parameters.Add("@ExcludeId", excludeId.Value);
            }

            var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
            return count > 0;
        }

        public async Task<ProductType> AddAsync(ProductType productType)
        {
            using var connection = _dbContext.GetConnection();
            const string sql = @"
                INSERT INTO product_type (code, name, description, parent_type_id, is_active, created_at, created_by)
                VALUES (@Code, @Name, @Description, @ParentTypeId, @IsActive, @CreatedAt, @CreatedBy)
                RETURNING id, code, name, description, parent_type_id as ParentTypeId,
                    is_active as IsActive, created_at as CreatedAt, updated_at as UpdatedAt,
                    created_by as CreatedBy, updated_by as UpdatedBy";

            return await connection.QueryFirstAsync<ProductType>(sql, productType);
        }

        public async Task<ProductType> UpdateAsync(ProductType productType)
        {
            using var connection = _dbContext.GetConnection();
            const string sql = @"
                UPDATE product_type 
                SET code = @Code, name = @Name, description = @Description, 
                    parent_type_id = @ParentTypeId, is_active = @IsActive, 
                    updated_at = @UpdatedAt, updated_by = @UpdatedBy
                WHERE id = @Id
                RETURNING id, code, name, description, parent_type_id as ParentTypeId,
                    is_active as IsActive, created_at as CreatedAt, updated_at as UpdatedAt,
                    created_by as CreatedBy, updated_by as UpdatedBy";

            return await connection.QueryFirstAsync<ProductType>(sql, productType);
        }

        public async Task DeleteAsync(ProductType productType)
        {
            using var connection = _dbContext.GetConnection();
            const string sql = "DELETE FROM product_type WHERE id = @Id";
            await connection.ExecuteAsync(sql, new { productType.Id });
        }
    }
} 