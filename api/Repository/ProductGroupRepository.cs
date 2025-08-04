using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ProductGroupRepository : IProductGroupRepository
    {
        private readonly DapperDbContext _context;

        public ProductGroupRepository(DapperDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductGroup>> GetAllAsync()
        {
            using var connection = _context.GetConnection();
            var sql = @"
                SELECT id, 
                code, 
                level, 
                product_group_name as productGroupName, 
                unit as unit, sales_division_id as salesDivisionId, 
                uom_for_mls as uomForMls, 
                conversion_factor as conversionFactor, 
                conversion_factor_unit as conversionFactorUnit, 
                cost_centre_code as costCentreCode,
                is_closed as isClosed, 
                updated_by as updatedBy, 
                updated_timestamp as updatedTimestamp, 
                rev_no as revNo, 
                is_active as isActive,
                created_at as createdAt, 
                updated_at as updatedAt
                FROM product_groups 
                WHERE is_active = true 
                ORDER BY product_group_name";
            
            return await connection.QueryAsync<ProductGroup>(sql);
        }

        public async Task<ProductGroup> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                 SELECT id, 
                    code, 
                    level, 
                    product_group_name as productGroupName, 
                    unit as unit, sales_division_id as salesDivisionId, 
                    uom_for_mls as uomForMls, 
                    conversion_factor as conversionFactor, 
                    conversion_factor_unit as conversionFactorUnit, 
                    cost_centre_code as costCentreCode,
                    is_closed as isClosed, 
                    updated_by as updatedBy, 
                    updated_timestamp as updatedTimestamp, 
                    rev_no as revNo, 
                    is_active as isActive,
                    created_at as createdAt, 
                    updated_at as updatedAt
                FROM product_groups 
                WHERE id = @Id AND is_active = true";
            
            return await connection.QuerySingleOrDefaultAsync<ProductGroup>(sql, new { Id = id });
        }

        public async Task<ProductGroup> GetByCodeAsync(string code)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                SELECT id, code, level, product_group_name as productGroupName, unit, sales_division_id as salesDivisionId, 
                       uom_for_mls as uomForMls, conversion_factor as conversionFactor, conversion_factor_unit as conversionFactorUnit, cost_centre_code as costCentreCode,
                       is_closed as isClosed, updated_by as updatedBy, updated_timestamp as updatedTimestamp, rev_no as revNo, is_active as isActive,
                       created_at as createdAt, updated_at as updatedAt
                FROM product_groups 
                WHERE code = @Code AND is_active = true";
            
            return await connection.QuerySingleOrDefaultAsync<ProductGroup>(sql, new { Code = code });
        }

        public async Task<ProductGroup> CreateAsync(ProductGroup productGroup)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                INSERT INTO product_groups (code, level, product_group_name, unit, sales_division_id,
                                          uom_for_mls, conversion_factor, conversion_factor_unit, cost_centre_code,
                                          is_closed, updated_by, updated_timestamp, rev_no, is_active,
                                          created_at, updated_at)
                VALUES (@Code, @Level, @ProductGroupName, @Unit, @SalesDivisionCode,
                       @UomForMls, @ConversionFactor, @ConversionFactorUnit, @CostCentreCode,
                       @IsClosed, @UpdatedBy, @UpdatedTimestamp, @RevNo, @IsActive,
                       @CreatedAt, @UpdatedAt)
                RETURNING id, code, level, product_group_name, unit, sales_division_id, 
                          uom_for_mls, conversion_factor, conversion_factor_unit, cost_centre_code,
                          is_closed, updated_by, updated_timestamp, rev_no, is_active,
                          created_at, updated_at";
            
            return await connection.QuerySingleAsync<ProductGroup>(sql, productGroup);
        }

        public async Task<ProductGroup> UpdateAsync(ProductGroup productGroup)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                UPDATE product_groups 
                SET code = @Code, level = @Level, product_group_name = @ProductGroupName,
                    unit = @Unit, sales_division_id = @SalesDivisionCode, uom_for_mls = @UomForMls,
                    conversion_factor = @ConversionFactor, conversion_factor_unit = @ConversionFactorUnit,
                    cost_centre_code = @CostCentreCode, is_closed = @IsClosed, updated_by = @UpdatedBy,
                    updated_timestamp = @UpdatedTimestamp, rev_no = @RevNo, is_active = @IsActive,
                    updated_at = @UpdatedAt
                WHERE id = @Id
                RETURNING id, code, level, product_group_name, unit, sales_division_id, 
                          uom_for_mls, conversion_factor, conversion_factor_unit, cost_centre_code,
                          is_closed, updated_by, updated_timestamp, rev_no, is_active,
                          created_at, updated_at";
            
            return await connection.QuerySingleAsync<ProductGroup>(sql, productGroup);
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = "UPDATE product_groups SET is_active = false, updated_at = @UpdatedAt WHERE id = @Id";
            await connection.ExecuteAsync(sql, new { Id = id, UpdatedAt = DateTime.UtcNow });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = "SELECT COUNT(1) FROM product_groups WHERE id = @Id AND is_active = true";
            var count = await connection.ExecuteScalarAsync<int>(sql, new { Id = id });
            return count > 0;
        }

        public async Task<bool> ExistsByCodeAsync(string code, int? excludeId = null)
        {
            using var connection = _context.GetConnection();
            var sql = "SELECT COUNT(1) FROM product_groups WHERE code = @Code AND is_active = true";
            var parameters = new DynamicParameters();
            parameters.Add("@Code", code);
            
            if (excludeId.HasValue)
            {
                sql += " AND id != @ExcludeId";
                parameters.Add("@ExcludeId", excludeId.Value);
            }
            
            var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
            return count > 0;
        }
    }
} 