using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class HsnMasterRepository : IHsnMasterRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "hsn_master";

        public HsnMasterRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<(List<HsnMaster> Items, int TotalCount)> GetAllAsync(HsnMasterFilterDto filterDto)
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

            // Add hsnType filter
            if (!string.IsNullOrWhiteSpace(filterDto.HsnType))
            {
                whereConditions.Add("hsn_type = @HsnType");
                parameters.Add("@HsnType", filterDto.HsnType);
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
                    hsn_type as HsnType,
                    uqc as Uqc,
                    igst_rate as IgstRate,
                    cgst_rate as CgstRate,
                    sgst_rate as SgstRate,
                    cess_rate as CessRate,
                    is_reverse_charges as IsReverseCharges,
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
            var items = (await multi.ReadAsync<HsnMaster>()).AsList();
            var totalCount = await multi.ReadFirstAsync<int>();

            return (items, totalCount);
        }

        public async Task<HsnMaster> GetByIdAsync(int id)
        {
            var query = $@"
                SELECT 
                    id as Id,
                    code as Code,
                    name as Name,
                    description as Description,
                    hsn_type as HsnType,
                    uqc as Uqc,
                    igst_rate as IgstRate,
                    cgst_rate as CgstRate,
                    sgst_rate as SgstRate,
                    cess_rate as CessRate,
                    is_reverse_charges as IsReverseCharges,
                    is_active as IsActive,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy
                FROM {TableName}
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<HsnMaster>(query, new { Id = id });
        }

        public async Task<HsnMaster> AddAsync(HsnMaster hsnMaster)
        {
            var query = $@"
                INSERT INTO {TableName} (
                    code, name, description, hsn_type, uqc, igst_rate, cgst_rate, sgst_rate, cess_rate, 
                    is_reverse_charges, is_active, created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @Code, @Name, @Description, @HsnType, @Uqc, @IgstRate, @CgstRate, @SgstRate, @CessRate,
                    @IsReverseCharges, @IsActive, @CreatedAt, @UpdatedAt, @CreatedBy, @UpdatedBy
                )
                RETURNING *";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<HsnMaster>(query, hsnMaster);
        }

        public async Task UpdateAsync(HsnMaster hsnMaster)
        {
            var query = $@"
                UPDATE {TableName} 
                SET code = @Code,
                    name = @Name,
                    description = @Description,
                    hsn_type = @HsnType,
                    uqc = @Uqc,
                    igst_rate = @IgstRate,
                    cgst_rate = @CgstRate,
                    sgst_rate = @SgstRate,
                    cess_rate = @CessRate,
                    is_reverse_charges = @IsReverseCharges,
                    is_active = @IsActive,
                    updated_at = @UpdatedAt,
                    updated_by = @UpdatedBy
                WHERE id = @Id";

            hsnMaster.UpdatedAt = DateTime.UtcNow;

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, hsnMaster);
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

        public async Task<IEnumerable<HsnMaster>> GetHsnTypesAsync()
        {
            var query = $@"
                SELECT 
                    id as Id,
                    code as Code,
                    name as Name,
                    description as Description,
                    hsn_type as HsnType,
                    uqc as Uqc,
                    igst_rate as IgstRate,
                    cgst_rate as CgstRate,
                    sgst_rate as SgstRate,
                    cess_rate as CessRate,
                    is_reverse_charges as IsReverseCharges,
                    is_active as IsActive,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy
                FROM {TableName} 
                WHERE is_active = true
                ORDER BY name";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<HsnMaster>(query);
        }
    }
}
