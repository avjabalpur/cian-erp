using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Repository.DbContext;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.ItemMaster;

namespace Xcianify.Repository
{
    public class HsnMasterRepository : IHsnMasterRepository
    {
        private readonly DapperDbContext _dbContext;
        private bool _disposed = false;

        public HsnMasterRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<HsnMasterDto> GetByIdAsync(int id)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = @"
                    SELECT id, code, name, description, hsn_type AS HsnType, uqc AS Uqc,
                           igst_rate AS IgstRate, cgst_rate AS CgstRate, sgst_rate AS SgstRate, 
                           cess_rate AS CessRate, is_reverse_charges AS IsReverseCharges, 
                           is_active AS IsActive, created_at AS CreatedAt, updated_at AS UpdatedAt, 
                           created_by AS CreatedBy, updated_by AS UpdatedBy
                    FROM hsn_master 
                    WHERE id = @Id";

                return await connection.QueryFirstOrDefaultAsync<HsnMasterDto>(sql, new { Id = id });
            }
        }

        public async Task<PaginatedResult<HsnMasterDto>> GetAllAsync(HsnMasterFilterDto filter)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var whereClause = "WHERE 1=1";
                var parameters = new DynamicParameters();

                if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
                {
                    whereClause += " AND (code ILIKE @SearchTerm OR name ILIKE @SearchTerm OR description ILIKE @SearchTerm)";
                    parameters.Add("@SearchTerm", $"%{filter.SearchTerm}%");
                }

                if (!string.IsNullOrWhiteSpace(filter.HsnType))
                {
                    whereClause += " AND hsn_type = @HsnType";
                    parameters.Add("@HsnType", filter.HsnType);
                }

                if (filter.IsActive.HasValue)
                {
                    whereClause += " AND is_active = @IsActive";
                    parameters.Add("@IsActive", filter.IsActive.Value);
                }

                var countSql = $"SELECT COUNT(*) FROM hsn_master {whereClause}";
                var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

                var sql = @$"
                    SELECT id, code, name, description, hsn_type AS HsnType, uqc AS Uqc,
                           igst_rate AS IgstRate, cgst_rate AS CgstRate, sgst_rate AS SgstRate, 
                           cess_rate AS CessRate, is_reverse_charges AS IsReverseCharges, 
                           is_active AS IsActive, created_at AS CreatedAt, updated_at AS UpdatedAt, 
                           created_by AS CreatedBy, updated_by AS UpdatedBy
                    FROM hsn_master 
                    {whereClause}
                    ORDER BY code, name
                    LIMIT @PageSize OFFSET @Offset";

                parameters.Add("@PageSize", filter.PageSize);
                parameters.Add("@Offset", (filter.PageNumber - 1) * filter.PageSize);

                var items = await connection.QueryAsync<HsnMasterDto>(sql, parameters);

                return new PaginatedResult<HsnMasterDto>
                {
                    Items = items.ToList(),
                    TotalCount = totalCount,
                    PageNumber = filter.PageNumber,
                    PageSize = filter.PageSize
                };
            }
        }

        public async Task<HsnMasterDto> CreateAsync(CreateHsnMasterDto dto, int userId)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = @"
                    INSERT INTO hsn_master 
                        (code, name, description, hsn_type, uqc, igst_rate, cgst_rate, 
                         sgst_rate, cess_rate, is_reverse_charges, is_active, created_by, updated_by)
                    VALUES 
                        (@Code, @Name, @Description, @HsnType, @Uqc, @IgstRate, @CgstRate, 
                         @SgstRate, @CessRate, @IsReverseCharges, @IsActive, @CreatedBy, @UpdatedBy)
                    RETURNING 
                        id, code, name, description, hsn_type AS HsnType, uqc AS Uqc,
                        igst_rate AS IgstRate, cgst_rate AS CgstRate, sgst_rate AS SgstRate, 
                        cess_rate AS CessRate, is_reverse_charges AS IsReverseCharges, 
                        is_active AS IsActive, created_at AS CreatedAt, updated_at AS UpdatedAt, 
                        created_by AS CreatedBy, updated_by AS UpdatedBy";

                var parameters = new
                {
                    dto.Code,
                    dto.Name,
                    dto.Description,
                    dto.HsnType,
                    dto.Uqc,
                    IgstRate = dto.IgstRate ?? 0.00m,
                    CgstRate = dto.CgstRate ?? 0.00m,
                    SgstRate = dto.SgstRate ?? 0.00m,
                    CessRate = dto.CessRate ?? 0.00m,
                    IsReverseCharges = dto.IsReverseCharges ?? false,
                    IsActive = dto.IsActive,
                    CreatedBy = userId,
                    UpdatedBy = userId
                };

                return await connection.QueryFirstOrDefaultAsync<HsnMasterDto>(sql, parameters);
            }
        }

        public async Task<HsnMasterDto> UpdateAsync(int id, UpdateHsnMasterDto dto, int userId)
        {
            using (var connection = _dbContext.GetConnection())
            {
                // Get existing record to preserve values not being updated
                var existing = await GetByIdAsync(id);
                if (existing == null)
                    return null;

                var sql = @"
                    UPDATE hsn_master 
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
                        updated_by = @UpdatedBy,
                        updated_at = @UpdatedAt
                    WHERE id = @Id
                    RETURNING 
                        id, code, name, description, hsn_type AS HsnType, uqc AS Uqc,
                        igst_rate AS IgstRate, cgst_rate AS CgstRate, sgst_rate AS SgstRate, 
                        cess_rate AS CessRate, is_reverse_charges AS IsReverseCharges, 
                        is_active AS IsActive, created_at AS CreatedAt, updated_at AS UpdatedAt, 
                        created_by AS CreatedBy, updated_by AS UpdatedBy";

                var parameters = new
                {
                    Id = id,
                    Code = dto.Code ?? existing.Code,
                    Name = dto.Name ?? existing.Name,
                    Description = dto.Description ?? existing.Description,
                    HsnType = dto.HsnType ?? existing.HsnType,
                    Uqc = dto.Uqc ?? existing.Uqc,
                    IgstRate = dto.IgstRate ?? existing.IgstRate,
                    CgstRate = dto.CgstRate ?? existing.CgstRate,
                    SgstRate = dto.SgstRate ?? existing.SgstRate,
                    CessRate = dto.CessRate ?? existing.CessRate,
                    IsReverseCharges = dto.IsReverseCharges ?? existing.IsReverseCharges,
                    IsActive = dto.IsActive ?? existing.IsActive,
                    UpdatedBy = userId,
                    UpdatedAt = DateTime.UtcNow
                };

                return await connection.QueryFirstOrDefaultAsync<HsnMasterDto>(sql, parameters);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using (var connection = _dbContext.GetConnection())
            {
                // Check if any items reference this HSN code
                // Note: You'll need to implement this check based on your item table structure
                // var checkSql = "SELECT COUNT(1) FROM items WHERE hsn_id = @Id";
                // var referenceCount = await connection.ExecuteScalarAsync<int>(checkSql, new { Id = id });
                
                // if (referenceCount > 0)
                // {
                //     throw new InvalidOperationException("Cannot delete HSN code that is being used by items.");
                // }

                var sql = "DELETE FROM hsn_master WHERE id = @Id";
                var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
                return affectedRows > 0;
            }
        }

        public async Task<bool> ExistsAsync(string code, int? excludeId = null)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = "SELECT COUNT(1) FROM hsn_master WHERE code = @Code";
                var parameters = new { Code = code };

                if (excludeId.HasValue)
                {
                    sql += " AND id != @ExcludeId";
                  //  parameters = new { Code = code, ExcludeId = excludeId.Value };
                }

                var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
                return count > 0;
            }
        }

        public async Task<IEnumerable<HsnMasterDto>> GetHsnTypesAsync()
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = @"
                    SELECT DISTINCT hsn_type AS HsnType
                    FROM hsn_master 
                    WHERE hsn_type IS NOT NULL
                    ORDER BY hsn_type";

                return await connection.QueryAsync<HsnMasterDto>(sql);
            }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _dbContext?.Dispose();
                }
                _disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
