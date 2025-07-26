using System;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Logging;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ItemSalesDetailRepository : IItemSalesDetailRepository
    {
        private const string TableName = "item_sales_details";
        private readonly DapperDbContext _dbContext;
        private readonly ILogger<ItemSalesDetailRepository> _logger;

        public ItemSalesDetailRepository(
            DapperDbContext dbContext,
            ILogger<ItemSalesDetailRepository> logger)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<ItemSalesDetail> GetByIdAsync(int id)
        {
            try
            {
                using var connection = _dbContext.GetConnection();
                var query = @"
                    SELECT * FROM ""item_sales_details"" 
                    WHERE id = @Id";
                
                return await connection.QueryFirstOrDefaultAsync<ItemSalesDetail>(query, new { Id = id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting sales detail by ID: {id}");
                throw;
            }
        }

        public async Task<ItemSalesDetail> GetByItemMasterIdAsync(int itemMasterId)
        {
            try
            {
                using var connection = _dbContext.GetConnection();
                var query = @"
                    SELECT * FROM ""item_sales_details"" 
                    WHERE item_master_id = @ItemMasterId";
                
                return await connection.QueryFirstOrDefaultAsync<ItemSalesDetail>(query, new { ItemMasterId = itemMasterId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting sales detail by item master ID: {itemMasterId}");
                throw;
            }
        }

        public async Task<ItemSalesDetail> CreateAsync(ItemSalesDetail salesDetail)
        {
            try
            {
                using var connection = _dbContext.GetConnection();
                var query = @"
                    INSERT INTO ""item_sales_details""
                        (item_master_id, selling_price, currency_id, is_tax_inclusive, 
                         discount_percentage, minimum_order_quantity, lead_time_days, 
                         is_active, notes, created_by, updated_by)
                    VALUES 
                        (@ItemMasterId, @SellingPrice, @CurrencyId, @IsTaxInclusive, 
                         @DiscountPercentage, @MinimumOrderQuantity, @LeadTimeDays, 
                         @IsActive, @Notes, @CreatedBy, @UpdatedBy)
                    RETURNING id;";

                var id = await connection.ExecuteScalarAsync<int>(query, salesDetail);
                salesDetail.Id = id;
                return salesDetail;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating sales detail");
                throw;
            }
        }

        public async Task<bool> UpdateAsync(ItemSalesDetail salesDetail)
        {
            try
            {
                using var connection = _dbContext.GetConnection();
                var query = @"
                    UPDATE ""item_sales_details""
                    SET 
                        selling_price = @SellingPrice,
                        currency_id = @CurrencyId,
                        is_tax_inclusive = @IsTaxInclusive,
                        discount_percentage = @DiscountPercentage,
                        minimum_order_quantity = @MinimumOrderQuantity,
                        lead_time_days = @LeadTimeDays,
                        is_active = @IsActive,
                        notes = @Notes,
                        updated_by = @UpdatedBy,
                        updated_at = @UpdatedAt
                    WHERE id = @Id";

                var affectedRows = await connection.ExecuteAsync(query, salesDetail);
                return affectedRows > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating sales detail ID: {salesDetail?.Id}");
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                using var connection = _dbContext.GetConnection();
                var query = @"DELETE FROM ""item_sales_details"" WHERE id = @Id";
                var affectedRows = await connection.ExecuteAsync(query, new { Id = id });
                return affectedRows > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting sales detail ID: {id}");
                throw;
            }
        }

        public async Task<bool> ExistsForItemMasterAsync(int itemMasterId, int? excludeId = null)
        {
            try
            {
                using var connection = _dbContext.GetConnection();
                var query = "SELECT COUNT(*) FROM \"item_sales_details\" WHERE item_master_id = @ItemMasterId";
                
                if (excludeId.HasValue)
                {
                    query += " AND id != @ExcludeId";
                }
                
                var count = await connection.ExecuteScalarAsync<int>(
                    query, 
                    new { ItemMasterId = itemMasterId, ExcludeId = excludeId });
                    
                return count > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error checking if sales detail exists for item master ID: {itemMasterId}");
                throw;
            }
        }
    }
}
