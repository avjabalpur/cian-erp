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
    public class ItemStockAnalysisRepository : IItemStockAnalysisRepository
    {
        private const string TableName = "item_stock_analysis";
        private readonly DapperDbContext _dbContext;
        private readonly ILogger<ItemStockAnalysisRepository> _logger;

        public ItemStockAnalysisRepository(
            DapperDbContext dbContext,
            ILogger<ItemStockAnalysisRepository> logger)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<ItemStockAnalysis> GetByIdAsync(int id)
        {
            try
            {
                using var connection = _dbContext.GetConnection();
                var query = @"
                    SELECT * FROM ""item_stock_analysis"" 
                    WHERE id = @Id";
                
                return await connection.QueryFirstOrDefaultAsync<ItemStockAnalysis>(query, new { Id = id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting stock analysis by ID: {id}");
                throw;
            }
        }

        public async Task<ItemStockAnalysis> GetByItemMasterIdAsync(int itemMasterId)
        {
            try
            {
                using var connection = _dbContext.GetConnection();
                var query = @"
                    SELECT * FROM ""item_stock_analysis"" 
                    WHERE item_master_id = @ItemMasterId";
                
                return await connection.QueryFirstOrDefaultAsync<ItemStockAnalysis>(query, new { ItemMasterId = itemMasterId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting stock analysis by item master ID: {itemMasterId}");
                throw;
            }
        }

        public async Task<ItemStockAnalysis> CreateAsync(ItemStockAnalysis stockAnalysis)
        {
            try
            {
                using var connection = _dbContext.GetConnection();
                var query = @"
                    INSERT INTO ""item_stock_analysis""
                        (item_master_id, minimum_stock_level, maximum_stock_level, 
                         reorder_level, economic_order_quantity, lead_time_days, 
                         average_usage_per_day, last_stock_check_date, last_stock_quantity, 
                         next_stock_check_date, is_active, notes, created_by, updated_by)
                    VALUES 
                        (@ItemMasterId, @MinimumStockLevel, @MaximumStockLevel, 
                         @ReorderLevel, @EconomicOrderQuantity, @LeadTimeDays, 
                         @AverageUsagePerDay, @LastStockCheckDate, @LastStockQuantity, 
                         @NextStockCheckDate, @IsActive, @Notes, @CreatedBy, @UpdatedBy)
                    RETURNING id;";

                var id = await connection.ExecuteScalarAsync<int>(query, stockAnalysis);
                stockAnalysis.Id = id;
                return stockAnalysis;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating stock analysis");
                throw;
            }
        }

        public async Task<bool> UpdateAsync(ItemStockAnalysis stockAnalysis)
        {
            try
            {
                using var connection = _dbContext.GetConnection();
                var query = @"
                    UPDATE ""item_stock_analysis""
                    SET 
                        minimum_stock_level = @MinimumStockLevel,
                        maximum_stock_level = @MaximumStockLevel,
                        reorder_level = @ReorderLevel,
                        economic_order_quantity = @EconomicOrderQuantity,
                        lead_time_days = @LeadTimeDays,
                        average_usage_per_day = @AverageUsagePerDay,
                        last_stock_check_date = @LastStockCheckDate,
                        last_stock_quantity = @LastStockQuantity,
                        next_stock_check_date = @NextStockCheckDate,
                        is_active = @IsActive,
                        notes = @Notes,
                        updated_by = @UpdatedBy,
                        updated_at = @UpdatedAt
                    WHERE id = @Id";

                var affectedRows = await connection.ExecuteAsync(query, stockAnalysis);
                return affectedRows > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating stock analysis ID: {stockAnalysis?.Id}");
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                using var connection = _dbContext.GetConnection();
                var query = @"DELETE FROM ""item_stock_analysis"" WHERE id = @Id";
                var affectedRows = await connection.ExecuteAsync(query, new { Id = id });
                return affectedRows > 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting stock analysis ID: {id}");
                throw;
            }
        }

        public async Task<bool> ExistsForItemMasterAsync(int itemMasterId, int? excludeId = null)
        {
            try
            {
                using var connection = _dbContext.GetConnection();
                var query = "SELECT COUNT(*) FROM \"item_stock_analysis\" WHERE item_master_id = @ItemMasterId";
                
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
                _logger.LogError(ex, $"Error checking if stock analysis exists for item master ID: {itemMasterId}");
                throw;
            }
        }
    }
}
