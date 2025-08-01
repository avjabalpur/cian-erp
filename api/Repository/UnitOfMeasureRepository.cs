using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Repository.DbContext;
using Xcianify.Core.DTOs;

namespace Xcianify.Repository
{
    public class UnitOfMeasureRepository : IUnitOfMeasureRepository
    {
        private readonly DapperDbContext _dbContext;
        private bool _disposed = false;

        public UnitOfMeasureRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<UnitOfMeasureDto> GetByIdAsync(int id)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = @"
                    SELECT id, uom_code AS UomCode, uom_name AS UomName, conversion_factor AS ConversionFactor,
                           created_at AS CreatedAt, updated_at AS UpdatedAt, created_by AS CreatedBy, updated_by AS UpdatedBy
                    FROM unit_of_measures 
                    WHERE id = @Id";

                return await connection.QueryFirstOrDefaultAsync<UnitOfMeasureDto>(sql, new { Id = id });
            }
        }

        public async Task<PaginatedResult<UnitOfMeasureDto>> GetAllAsync(UnitOfMeasureFilterDto filter)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var whereClause = "WHERE 1=1";
                var parameters = new DynamicParameters();

                if (!string.IsNullOrWhiteSpace(filter.search))
                {
                    whereClause += " AND (uom_code ILIKE @search OR uom_name ILIKE @search)";
                    parameters.Add("@search", $"%{filter.search}%");
                }

                var countSql = $"SELECT COUNT(*) FROM unit_of_measures {whereClause}";
                var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

                var sql = @$"
                    SELECT id, uom_code AS UomCode, uom_name AS UomName, conversion_factor AS ConversionFactor,
                           created_at AS CreatedAt, updated_at AS UpdatedAt, created_by AS CreatedBy, updated_by AS UpdatedBy
                    FROM unit_of_measures 
                    {whereClause}
                    ORDER BY uom_name
                    LIMIT @PageSize OFFSET @Offset";

                parameters.Add("@PageSize", filter.PageSize);
                parameters.Add("@Offset", (filter.PageNumber - 1) * filter.PageSize);

                var items = await connection.QueryAsync<UnitOfMeasureDto>(sql, parameters);

                return new PaginatedResult<UnitOfMeasureDto>
                {
                    Items = items.ToList(),
                    TotalCount = totalCount,
                    PageNumber = filter.PageNumber,
                    PageSize = filter.PageSize
                };
            }
        }

        public async Task<UnitOfMeasureDto> CreateAsync(CreateUnitOfMeasureDto dto, int userId)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = @"
                    INSERT INTO unit_of_measures (uom_code, uom_name, conversion_factor, created_by, updated_by)
                    VALUES (@UomCode, @UomName, @ConversionFactor, @CreatedBy, @UpdatedBy)
                    RETURNING id, uom_code AS UomCode, uom_name AS UomName, conversion_factor AS ConversionFactor,
                              created_at AS CreatedAt, updated_at AS UpdatedAt, created_by AS CreatedBy, updated_by AS UpdatedBy";

                var parameters = new
                {
                    dto.UomCode,
                    dto.UomName,
                    ConversionFactor = dto.ConversionFactor ?? 1.0m,
                    CreatedBy = userId,
                    UpdatedBy = userId
                };

                return await connection.QueryFirstOrDefaultAsync<UnitOfMeasureDto>(sql, parameters);
            }
        }

        public async Task<UnitOfMeasureDto> UpdateAsync(int id, UpdateUnitOfMeasureDto dto, int userId)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = @"
                    UPDATE unit_of_measures 
                    SET uom_code = @UomCode, 
                        uom_name = @UomName, 
                        conversion_factor = @ConversionFactor,
                        updated_by = @UpdatedBy,
                        updated_at = @UpdatedAt
                    WHERE id = @Id
                    RETURNING id, uom_code AS UomCode, uom_name AS UomName, conversion_factor AS ConversionFactor,
                              created_at AS CreatedAt, updated_at AS UpdatedAt, created_by AS CreatedBy, updated_by AS UpdatedBy";

                var parameters = new
                {
                    Id = id,
                    dto.UomCode,
                    dto.UomName,
                    ConversionFactor = dto.ConversionFactor ?? 1.0m,
                    UpdatedBy = userId,
                    UpdatedAt = DateTime.UtcNow
                };

                return await connection.QueryFirstOrDefaultAsync<UnitOfMeasureDto>(sql, parameters);
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = "DELETE FROM unit_of_measures WHERE id = @Id";
                var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
                return affectedRows > 0;
            }
        }

        public async Task<bool> ExistsAsync(string uomCode, int? excludeId = null)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = "SELECT COUNT(1) FROM unit_of_measures WHERE uom_code = @UomCode";
                var parameters = new { UomCode = uomCode };

                if (excludeId.HasValue)
                {
                    sql += " AND id != @ExcludeId";
                   // parameters = new { UomCode = uomCode, ExcludeId = excludeId.Value };
                }

                var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
                return count > 0;
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
