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
                    SELECT 
                        id as Id,
                        item_id as ItemId,
                        pack_size_applicable as PackSizeApplicable,
                        default_pack_size as DefaultPackSize,
                        saleable_unit_contains as SaleableUnitContains,
                        qty_per_box as QtyPerBox,
                        boxes_per_case as BoxesPerCase,
                        case_packing_type as CasePackingType,
                        packing_rate as PackingRate,
                        qty_per_case as QtyPerCase,
                        net_weight_case as NetWeightCase,
                        tare_weight_case as TareWeightCase,
                        gross_weight_case as GrossWeightCase,
                        gross_weight_unit as GrossWeightUnit,
                        case_dimensions_inches as CaseDimensionsInches,
                        case_volume_cft as CaseVolumeCft,
                        case_dimensions_cm as CaseDimensionsCm,
                        case_volume_cbm as CaseVolumeCbm,
                        min_sale_rate as MinSaleRate,
                        min_so_qty as MinSoQty,
                        tertiary_gtin as TertiaryGtin,
                        secondary_gtin as SecondaryGtin,
                        primary_gtin as PrimaryGtin,
                        min_batch_qty_autoloading as MinBatchQtyAutoloading,
                        consider_as_new_product_till as ConsiderAsNewProductTill,
                        interface_code as InterfaceCode,
                        specs as Specs
                    FROM item_sales_details 
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
                    SELECT 
                        id as Id,
                        item_id as ItemId,
                        pack_size_applicable as PackSizeApplicable,
                        default_pack_size as DefaultPackSize,
                        saleable_unit_contains as SaleableUnitContains,
                        qty_per_box as QtyPerBox,
                        boxes_per_case as BoxesPerCase,
                        case_packing_type as CasePackingType,
                        packing_rate as PackingRate,
                        qty_per_case as QtyPerCase,
                        net_weight_case as NetWeightCase,
                        tare_weight_case as TareWeightCase,
                        gross_weight_case as GrossWeightCase,
                        gross_weight_unit as GrossWeightUnit,
                        case_dimensions_inches as CaseDimensionsInches,
                        case_volume_cft as CaseVolumeCft,
                        case_dimensions_cm as CaseDimensionsCm,
                        case_volume_cbm as CaseVolumeCbm,
                        min_sale_rate as MinSaleRate,
                        min_so_qty as MinSoQty,
                        tertiary_gtin as TertiaryGtin,
                        secondary_gtin as SecondaryGtin,
                        primary_gtin as PrimaryGtin,
                        min_batch_qty_autoloading as MinBatchQtyAutoloading,
                        consider_as_new_product_till as ConsiderAsNewProductTill,
                        interface_code as InterfaceCode,
                        specs as Specs
                    FROM item_sales_details 
                    WHERE item_id = @ItemId";
                
                return await connection.QueryFirstOrDefaultAsync<ItemSalesDetail>(query, new { ItemId = itemMasterId });
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
    INSERT INTO item_sales_details (
        item_id, pack_size_applicable, default_pack_size, saleable_unit_contains,   
        qty_per_box, boxes_per_case, case_packing_type, packing_rate,
        qty_per_case, net_weight_case, tare_weight_case, gross_weight_case,
        gross_weight_unit, case_dimensions_inches, case_volume_cft, case_dimensions_cm,
        case_volume_cbm, min_sale_rate, min_so_qty, tertiary_gtin,
        secondary_gtin, primary_gtin, min_batch_qty_autoloading, consider_as_new_product_till, interface_code, specs,
        created_at, updated_at, created_by, updated_by
    )
    VALUES (
        @ItemId, @PackSizeApplicable, @DefaultPackSize, @SaleableUnitContains,
        @QtyPerBox, @BoxesPerCase, @CasePackingType, @PackingRate,
        @QtyPerCase, @NetWeightCase, @TareWeightCase, @GrossWeightCase,
        @GrossWeightUnit, @CaseDimensionsInches, @CaseVolumeCft, @CaseDimensionsCm,
        @CaseVolumeCbm, @MinSaleRate, @MinSoQty, @TertiaryGtin,
        @SecondaryGtin, @PrimaryGtin, @MinBatchQtyAutoloading, @ConsiderAsNewProductTill,
        @InterfaceCode, @Specs,
        @CreatedAt, @UpdatedAt, @CreatedBy, @UpdatedBy
    )
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
                    UPDATE item_sales_details
                    SET 
                        pack_size_applicable = @PackSizeApplicable,
                        default_pack_size = @DefaultPackSize,
                        saleable_unit_contains = @SaleableUnitContains,
                        qty_per_box = @QtyPerBox,
                        boxes_per_case = @BoxesPerCase,
                        case_packing_type = @CasePackingType,
                        packing_rate = @PackingRate,
                        qty_per_case = @QtyPerCase,
                        net_weight_case = @NetWeightCase,
                        tare_weight_case = @TareWeightCase,
                        gross_weight_case = @GrossWeightCase,
                        gross_weight_unit = @GrossWeightUnit,
                        case_dimensions_inches = @CaseDimensionsInches,
                        case_volume_cft = @CaseVolumeCft,
                        case_dimensions_cm = @CaseDimensionsCm,
                        case_volume_cbm = @CaseVolumeCbm,
                        min_sale_rate = @MinSaleRate,
                        min_so_qty = @MinSoQty,
                        tertiary_gtin = @TertiaryGtin,
                        secondary_gtin = @SecondaryGtin,
                        primary_gtin = @PrimaryGtin,
                        min_batch_qty_autoloading = @MinBatchQtyAutoloading,
                        consider_as_new_product_till = @ConsiderAsNewProductTill,
                        interface_code = @InterfaceCode,
                        specs = @Specs,
                        updated_at = @UpdatedAt,
                        updated_by = @UpdatedBy
                    WHERE id = @Id";

                _logger.LogInformation($"Executing UPDATE for sales detail ID: {salesDetail.Id}");
                var affectedRows = await connection.ExecuteAsync(query, salesDetail);
                _logger.LogInformation($"UPDATE affected {affectedRows} rows for sales detail ID: {salesDetail.Id}");
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
                var query = @"UPDATE item_sales_details SET is_deleted = true, updated_at = @UpdatedAt WHERE id = @Id";
                var affectedRows = await connection.ExecuteAsync(query, new { Id = id, UpdatedAt = DateTime.UtcNow });
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
                var query = "SELECT COUNT(*) FROM item_sales_details WHERE item_id = @ItemId";
                
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
                _logger.LogError(ex, $"Error checking if sales detail exists for item master ID: {itemMasterId}");
                throw;
            }
        }
    }
}
