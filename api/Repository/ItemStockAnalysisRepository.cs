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
                    SELECT 
                        id as Id,
                        item_id as ItemId,
                        abc_consumption_value as AbcConsumptionValue,
                        xyz_stock_value as XyzStockValue,
                        fsn_movement as FsnMovement,
                        ved_analysis as VedAnalysis,
                        created_at as CreatedAt,
                        updated_at as UpdatedAt,
                        created_by as CreatedBy,
                        updated_by as UpdatedBy,
                        is_active as IsActive,
                        is_deleted as IsDeleted
                    FROM item_stock_analysis 
                    WHERE id = @Id AND (is_deleted = false OR is_deleted IS NULL)";
                
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
                    SELECT 
                        id as Id,
                        item_id as ItemId,
                        abc_consumption_value as AbcConsumptionValue,
                        xyz_stock_value as XyzStockValue,
                        fsn_movement as FsnMovement,
                        ved_analysis as VedAnalysis,
                        created_at as CreatedAt,
                        updated_at as UpdatedAt,
                        created_by as CreatedBy,
                        updated_by as UpdatedBy,
                        is_active as IsActive,
                        is_deleted as IsDeleted
                    FROM item_stock_analysis 
                    WHERE item_id = @ItemId AND (is_deleted = false OR is_deleted IS NULL)";
                
                return await connection.QueryFirstOrDefaultAsync<ItemStockAnalysis>(query, new { ItemId = itemMasterId });
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
                    INSERT INTO item_stock_analysis
                   (item_id, abc_consumption_value, xyz_stock_value, 
                   fsn_movement, ved_analysis, created_at, updated_at, 
                   created_by, updated_by, is_active, is_deleted)
                 VALUES 
                (@ItemId, @AbcConsumptionValue, @XyzStockValue, 
                @FsnMovement, @VedAnalysis, @CreatedAt, @UpdatedAt, 
                @CreatedBy, @UpdatedBy, @IsActive, @IsDeleted)
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
                    UPDATE item_stock_analysis
                    SET 
                        abc_consumption_value = @AbcConsumptionValue,
                        xyz_stock_value = @XyzStockValue,
                        fsn_movement = @FsnMovement,
                        ved_analysis = @VedAnalysis,
                        is_active = @IsActive,
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
                var query = @"UPDATE item_stock_analysis SET is_deleted = true, updated_at = @UpdatedAt WHERE id = @Id";
                var affectedRows = await connection.ExecuteAsync(query, new { Id = id, UpdatedAt = DateTime.UtcNow });
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
                var query = "SELECT COUNT(*) FROM item_stock_analysis WHERE item_id = @ItemId AND (is_deleted = false OR is_deleted IS NULL)";
                
                if (excludeId.HasValue)
                {
                    query += " AND id != @ExcludeId";
                }
                
                var count = await connection.ExecuteScalarAsync<int>(
                    query, 
                    new { ItemId = itemMasterId, ExcludeId = excludeId });
                    
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
