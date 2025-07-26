using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class SalesOrderQuotationItemRepository : ISalesOrderQuotationItemRepository
    {
        private readonly DapperDbContext _context;

        public SalesOrderQuotationItemRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<SalesOrderQuotationItem>> GetAllAsync()
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soqi.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_quotation_items soqi
                LEFT JOIN users u1 ON soqi.created_by = u1.id
                LEFT JOIN users u2 ON soqi.updated_by = u2.id
                WHERE soqi.is_deleted = 0
                ORDER BY soqi.created_time DESC";

            return await connection.QueryAsync<SalesOrderQuotationItem>(query);
        }

        public async Task<SalesOrderQuotationItem> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soqi.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_quotation_items soqi
                LEFT JOIN users u1 ON soqi.created_by = u1.id
                LEFT JOIN users u2 ON soqi.updated_by = u2.id
                WHERE soqi.id = @Id AND soqi.is_deleted = 0";

            return await connection.QuerySingleOrDefaultAsync<SalesOrderQuotationItem>(query, new { Id = id });
        }

        public async Task<SalesOrderQuotationItem> AddAsync(SalesOrderQuotationItem quotationItem)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                INSERT INTO sales_order_quotation_items (
                    quotation_id, sales_order_id, item_id, composition, dosage_name,
                    product_cast, p_pack_short, so_status, p_quantity, p_foc_qty,
                    p_mrp, p_billing_rate, comments, tax_percent, product_extra_charges,
                    product_extra_charges_tax_percent, is_deleted, created_by, created_time,
                    updated_by, updated_time
                ) VALUES (
                    @QuotationId, @SalesOrderId, @ItemId, @Composition, @DosageName,
                    @ProductCast, @PPackShort, @SoStatus, @PQuantity, @PFocQty,
                    @PMrp, @PBillingRate, @Comments, @TaxPercent, @ProductExtraCharges,
                    @ProductExtraChargesTaxPercent, @IsDeleted, @CreatedBy, @CreatedTime,
                    @UpdatedBy, @UpdatedTime
                ) RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderQuotationItem>(query, quotationItem);
        }

        public async Task<SalesOrderQuotationItem> UpdateAsync(SalesOrderQuotationItem quotationItem)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                UPDATE sales_order_quotation_items SET
                    quotation_id = @QuotationId, sales_order_id = @SalesOrderId,
                    item_id = @ItemId, composition = @Composition, dosage_name = @DosageName,
                    product_cast = @ProductCast, p_pack_short = @PPackShort, so_status = @SoStatus,
                    p_quantity = @PQuantity, p_foc_qty = @PFocQty, p_mrp = @PMrp,
                    p_billing_rate = @PBillingRate, comments = @Comments, tax_percent = @TaxPercent,
                    product_extra_charges = @ProductExtraCharges, product_extra_charges_tax_percent = @ProductExtraChargesTaxPercent,
                    updated_by = @UpdatedBy, updated_time = @UpdatedTime
                WHERE id = @Id AND is_deleted = 0
                RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderQuotationItem>(query, quotationItem);
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "UPDATE sales_order_quotation_items SET is_deleted = 1 WHERE id = @Id";
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "SELECT COUNT(*) FROM sales_order_quotation_items WHERE id = @Id AND is_deleted = 0";
            var count = await connection.QuerySingleAsync<int>(query, new { Id = id });
            return count > 0;
        }

        public async Task<IEnumerable<SalesOrderQuotationItem>> GetByQuotationIdAsync(int quotationId)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soqi.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_quotation_items soqi
                LEFT JOIN users u1 ON soqi.created_by = u1.id
                LEFT JOIN users u2 ON soqi.updated_by = u2.id
                WHERE soqi.quotation_id = @QuotationId AND soqi.is_deleted = 0
                ORDER BY soqi.created_time DESC";

            return await connection.QueryAsync<SalesOrderQuotationItem>(query, new { QuotationId = quotationId });
        }

        public async Task<IEnumerable<SalesOrderQuotationItem>> GetBySalesOrderIdAsync(int salesOrderId)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soqi.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_quotation_items soqi
                LEFT JOIN users u1 ON soqi.created_by = u1.id
                LEFT JOIN users u2 ON soqi.updated_by = u2.id
                WHERE soqi.sales_order_id = @SalesOrderId AND soqi.is_deleted = 0
                ORDER BY soqi.created_time DESC";

            return await connection.QueryAsync<SalesOrderQuotationItem>(query, new { SalesOrderId = salesOrderId });
        }
    }
} 