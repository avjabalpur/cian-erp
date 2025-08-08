using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerType;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class CustomerTypeRepository : ICustomerTypeRepository
    {
        private readonly DapperDbContext _context;

        public CustomerTypeRepository(DapperDbContext context)
        {
            _context = context;
        }

        public async Task<(List<CustomerType> items, int totalCount)> GetAllAsync(CustomerTypeFilterDto filter)
        {
            using var connection = _context.GetConnection();
            
            var whereConditions = new List<string>();
            var parameters = new DynamicParameters();

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                whereConditions.Add("(name ILIKE @Search OR code ILIKE @Search OR description ILIKE @Search)");
                parameters.Add("@Search", $"%{filter.Search}%");
            }

            if (!string.IsNullOrWhiteSpace(filter.Code))
            {
                whereConditions.Add("code ILIKE @Code");
                parameters.Add("@Code", $"%{filter.Code}%");
            }

            if (!string.IsNullOrWhiteSpace(filter.Name))
            {
                whereConditions.Add("name ILIKE @Name");
                parameters.Add("@Name", $"%{filter.Name}%");
            }

            // Always filter out deleted records
            whereConditions.Add("is_deleted = false");

            var whereClause = whereConditions.Count > 0 ? $"WHERE {string.Join(" AND ", whereConditions)}" : "";

            // Count query
            var countSql = $@"
                SELECT COUNT(*) 
                FROM customer_types 
                {whereClause}";

            var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

            // Data query
            var orderBy = "DESC";
            var sortColumn = "created_at";

            var sql = $@"
                SELECT 
                    id, code, name, description, is_export_type, is_domestic_type,
                    requires_drug_license, credit_terms_applicable, is_active,
                    created_at, updated_at, created_by, updated_by, is_deleted
                FROM customer_types 
                {whereClause}
                ORDER BY {sortColumn} {orderBy}
                LIMIT @PageSize OFFSET @Offset";


            parameters.Add("@PageSize", filter.PageSize);
            parameters.Add("@Offset", (filter.PageNumber - 1) * filter.PageSize);

            var customerTypes = await connection.QueryAsync<CustomerType>(sql, parameters);
            return (customerTypes.ToList(), totalCount);
        }

        public async Task<CustomerType?> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                SELECT 
                    id, code, name, description, is_export_type, is_domestic_type,
                    requires_drug_license, credit_terms_applicable, is_active,
                    created_at, updated_at, created_by, updated_by, is_deleted
                FROM customer_types 
                WHERE id = @Id AND is_deleted = false";

            return await connection.QueryFirstOrDefaultAsync<CustomerType>(sql, new { Id = id });
        }

        public async Task<CustomerType?> GetByCodeAsync(string code)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                SELECT 
                    id, code, name, description, is_export_type, is_domestic_type,
                    requires_drug_license, credit_terms_applicable, is_active,
                    created_at, updated_at, created_by, updated_by, is_deleted
                FROM customer_types 
                WHERE code = @Code AND is_deleted = false";

            return await connection.QueryFirstOrDefaultAsync<CustomerType>(sql, new { Code = code });
        }

        public async Task<CustomerType> CreateAsync(CustomerType customerType)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                INSERT INTO customer_types (
                    code, name, description, is_export_type, is_domestic_type,
                    requires_drug_license, credit_terms_applicable, is_active,
                    created_at, created_by, is_deleted
                ) VALUES (
                    @Code, @Name, @Description, @IsExportType, @IsDomesticType,
                    @RequiresDrugLicense, @CreditTermsApplicable, @IsActive,
                    @CreatedAt, @CreatedBy, false
                )
                RETURNING 
                    id, code, name, description, is_export_type, is_domestic_type,
                    requires_drug_license, credit_terms_applicable, is_active,
                    created_at, updated_at, created_by, updated_by, is_deleted";

            return await connection.QueryFirstAsync<CustomerType>(sql, customerType);
        }

        public async Task<CustomerType> UpdateAsync(CustomerType customerType)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                UPDATE customer_types SET
                    code = @Code,
                    name = @Name,
                    description = @Description,
                    is_export_type = @IsExportType,
                    is_domestic_type = @IsDomesticType,
                    requires_drug_license = @RequiresDrugLicense,
                    credit_terms_applicable = @CreditTermsApplicable,
                    is_active = @IsActive,
                    updated_at = @UpdatedAt,
                    updated_by = @UpdatedBy
                WHERE id = @Id AND is_deleted = false
                RETURNING 
                    id, code, name, description, is_export_type, is_domestic_type,
                    requires_drug_license, credit_terms_applicable, is_active,
                    created_at, updated_at, created_by, updated_by, is_deleted";

            return await connection.QueryFirstAsync<CustomerType>(sql, customerType);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                UPDATE customer_types 
                SET is_deleted = true, updated_at = NOW()
                WHERE id = @Id AND is_deleted = false";

            var rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = "SELECT COUNT(*) FROM customer_types WHERE id = @Id AND is_deleted = false";
            var count = await connection.ExecuteScalarAsync<int>(sql, new { Id = id });
            return count > 0;
        }

        public async Task<bool> ExistsByCodeAsync(string code)
        {
            using var connection = _context.GetConnection();
            var sql = "SELECT COUNT(*) FROM customer_types WHERE code = @Code AND is_deleted = false";
            var count = await connection.ExecuteScalarAsync<int>(sql, new { Code = code });
            return count > 0;
        }
    }
} 