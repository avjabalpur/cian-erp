using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ItemBoughtOutDetailsRepository : IItemBoughtOutDetailsRepository
    {
        private readonly DapperDbContext _dbContext;

        public ItemBoughtOutDetailsRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ItemBoughtOutDetails> GetByItemIdAsync(int itemId)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = "SELECT * FROM item_bought_out_details WHERE item_id = @ItemId";
                return await connection.QueryFirstOrDefaultAsync<ItemBoughtOutDetails>(sql, new { ItemId = itemId });
            }
        }

        public async Task<ItemBoughtOutDetails> GetByIdAsync(int id)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = "SELECT * FROM item_bought_out_details WHERE id = @Id";
                return await connection.QueryFirstOrDefaultAsync<ItemBoughtOutDetails>(sql, new { Id = id });
            }
        }

        public async Task<IEnumerable<ItemBoughtOutDetails>> GetAllAsync()
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = "SELECT * FROM item_bought_out_details";
                return await connection.QueryAsync<ItemBoughtOutDetails>(sql);
            }
        }

        public async Task<ItemBoughtOutDetails> CreateAsync(ItemBoughtOutDetails details)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = @"
                    INSERT INTO item_bought_out_details 
                    (item_id, purchase_based_on, excess_planning_percent, reorder_level, 
                     min_stock_level, max_stock_level, min_balance_shelf_life_days, 
                     custom_duty_percent, igst_percent, sws_percent, max_purchase_rate, stop_procurement)
                    VALUES 
                    (@ItemId, @PurchaseBasedOn, @ExcessPlanningPercent, @ReorderLevel, 
                     @MinStockLevel, @MaxStockLevel, @MinBalanceShelfLifeDays, 
                     @CustomDutyPercent, @IgstPercent, @SwsPercent, @MaxPurchaseRate, @StopProcurement)
                    RETURNING *";

                return await connection.QueryFirstOrDefaultAsync<ItemBoughtOutDetails>(sql, details);
            }
        }

        public async Task<bool> UpdateAsync(ItemBoughtOutDetails details)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = @"
                    UPDATE item_bought_out_details 
                    SET item_id = @ItemId,
                        purchase_based_on = @PurchaseBasedOn,
                        excess_planning_percent = @ExcessPlanningPercent,
                        reorder_level = @ReorderLevel,
                        min_stock_level = @MinStockLevel,
                        max_stock_level = @MaxStockLevel,
                        min_balance_shelf_life_days = @MinBalanceShelfLifeDays,
                        custom_duty_percent = @CustomDutyPercent,
                        igst_percent = @IgstPercent,
                        sws_percent = @SwsPercent,
                        max_purchase_rate = @MaxPurchaseRate,
                        stop_procurement = @StopProcurement
                    WHERE id = @Id";

                var affectedRows = await connection.ExecuteAsync(sql, details);
                return affectedRows > 0;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = "DELETE FROM item_bought_out_details WHERE id = @Id";
                var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
                return affectedRows > 0;
            }
        }
    }
}