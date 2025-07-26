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
            const string query = @"SELECT * FROM item_export_details WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ItemExportDetails>(query, new { Id = id });
        }

        public async Task<IEnumerable<ItemExportDetails>> GetByItemIdAsync(int itemId)
        {
            const string query = @"SELECT * FROM item_export_details WHERE item_id = @ItemId";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<ItemExportDetails>(query, new { ItemId = itemId });
        }

        public async Task<int> CreateAsync(ItemExportDetails entity)
        {
            const string query = @"INSERT INTO item_export_details (
                item_code, export_description, export_product_group_code, export_product_group_name, depb_rate_list_srl_no, depb_rate, depb_value_cap, depb_remarks, drawback_srl_no, drawback_rate, drawback_rate_type, drawback_value_cap, drawback_remarks
            ) VALUES (
                @ItemCode, @ExportDescription, @ExportProductGroupCode, @ExportProductGroupName, @DepbRateListSrlNo, @DepbRate, @DepbValueCap, @DepbRemarks, @DrawbackSrlNo, @DrawbackRate, @DrawbackRateType, @DrawbackValueCap, @DrawbackRemarks
            ) RETURNING id;";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<int>(query, entity);
        }

        public async Task<bool> UpdateAsync(ItemExportDetails entity)
        {
            const string query = @"UPDATE item_export_details SET
                item_code = @ItemCode,
                export_description = @ExportDescription,
                export_product_group_code = @ExportProductGroupCode,
                export_product_group_name = @ExportProductGroupName,
                depb_rate_list_srl_no = @DepbRateListSrlNo,
                depb_rate = @DepbRate,
                depb_value_cap = @DepbValueCap,
                depb_remarks = @DepbRemarks,
                drawback_srl_no = @DrawbackSrlNo,
                drawback_rate = @DrawbackRate,
                drawback_rate_type = @DrawbackRateType,
                drawback_value_cap = @DrawbackValueCap,
                drawback_remarks = @DrawbackRemarks
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


    }
}
