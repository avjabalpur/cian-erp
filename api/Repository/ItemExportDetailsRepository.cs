using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ItemExportDetailsRepository : IItemExportDetailsRepository
    {
        private const string TableName = "item_export_details";
        private readonly DapperDbContext _dbContext;

        public ItemExportDetailsRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<ItemExportDetails> GetByIdAsync(int id)
        {
            const string query = @"
        SELECT 
            id AS Id,
            item_id AS ItemId,
            export_description AS ItemDescriptionForExports,
            export_product_group_code AS ExportProductGroupCode,
            export_product_group_name AS ExportProductGroupName,
            depb_rate_list_srl_no AS DepbRateListSrlNo,
            depb_rate AS DepbRate,
            depb_value_cap AS DepbValueCap,
            depb_remarks AS DepbRemarks,
            drawback_srl_no AS DutyDrawbackSrlNo,
            drawback_rate AS DutyDrawbackRate,
            drawback_rate_type AS DutyDrawbackRateType,
            drawback_value_cap AS DutyDrawbackValueCap,
            drawback_remarks AS DutyDrawbackRemarks
        FROM item_export_details
        WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ItemExportDetails>(query, new { Id = id });
        }

        public async Task<IEnumerable<ItemExportDetails>> GetByItemIdAsync(int itemId)
        {
            const string query = @"
        SELECT 
            id AS Id,
            item_id AS ItemId,
            export_description AS ItemDescriptionForExports,
            export_product_group_code AS ExportProductGroupCode,
            export_product_group_name AS ExportProductGroupName,
            depb_rate_list_srl_no AS DepbRateListSrlNo,
            depb_rate AS DepbRate,
            depb_value_cap AS DepbValueCap,
            depb_remarks AS DepbRemarks,
            drawback_srl_no AS DutyDrawbackSrlNo,
            drawback_rate AS DutyDrawbackRate,
            drawback_rate_type AS DutyDrawbackRateType,
            drawback_value_cap AS DutyDrawbackValueCap,
            drawback_remarks AS DutyDrawbackRemarks
        FROM item_export_details
        WHERE item_id = @ItemId;";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<ItemExportDetails>(query, new { ItemId = itemId });
        }

        public async Task<int> CreateAsync(ItemExportDetails entity)
        {
           
            const string query = @"INSERT INTO item_export_details (
                export_description, export_product_group_code, export_product_group_name, 
                depb_rate_list_srl_no, depb_rate, depb_value_cap, depb_remarks, 
                drawback_srl_no, drawback_rate, drawback_rate_type, drawback_value_cap, drawback_remarks,item_id
            ) VALUES (
                @ItemDescriptionForExports, @ExportProductGroupCode, @ExportProductGroupName,
                @DepbRateListSrlNo, @DepbRate, @DepbValueCap, @DepbRemarks,
                @DutyDrawbackSrlNo , @DutyDrawbackRate , @DutyDrawbackRateType , @DutyDrawbackValueCap , @DutyDrawbackRemarks,@ItemId
            ) RETURNING id;";
            
            using var connection = _dbContext.GetConnection();
            var result = await connection.ExecuteScalarAsync<int>(query, entity);
            return result;
        }

        public async Task<bool> UpdateAsync(ItemExportDetails entity)
        {
            const string query = @"
UPDATE item_export_details SET
    item_id = @ItemId,
    export_description = @ItemDescriptionForExports,
    export_product_group_code = @ExportProductGroupCode,
    export_product_group_name = @ExportProductGroupName,
    depb_rate_list_srl_no = @DepbRateListSrlNo,
    depb_rate = @DepbRate,
    depb_value_cap = @DepbValueCap,
    depb_remarks = @DepbRemarks,
    drawback_srl_no = @DutyDrawbackSrlNo,
    drawback_rate = @DutyDrawbackRate,
    drawback_rate_type = @DutyDrawbackRateType,
    drawback_value_cap = @DutyDrawbackValueCap,
    drawback_remarks = @DutyDrawbackRemarks
WHERE id = @Id;";

            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteAsync(query, entity) > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string query = @"DELETE FROM item_export_details WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteAsync(query, new { Id = id }) > 0;
        }

        // Method to check table structure
        public async Task<IEnumerable<dynamic>> GetTableStructureAsync()
        {
            const string query = @"
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = 'item_export_details' 
                ORDER BY ordinal_position";
            
            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync(query);
        }
    }
}
