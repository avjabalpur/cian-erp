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
                    soqi.id,
                    soqi.quotation_id as quotationId,
                    soqi.sales_order_id as salesOrderId,
                    soqi.is_deleted as isDeleted,
                    soqi.item_id as itemId,
                    soqi.composition,
                    soqi.dosage_name as dosageName,
                    soqi.product_cast as productCast,
                    soqi.p_pack_short as pPackShort,
                    soqi.so_status as soStatus,
                    soqi.p_quantity as pQuantity,
                    soqi.p_foc_qty as pFocQty,
                    soqi.p_mrp as pMrp,
                    soqi.p_billing_rate as pBillingRate,
                    soqi.comments,
                    soqi.tax_percent as taxPercent,
                    soqi.product_extra_charges as productExtraCharges,
                    soqi.product_extra_charges_tax_percent as productExtraChargesTaxPercent
                FROM sales_order_quotation_items soqi
                WHERE soqi.is_deleted = false
                ORDER BY soqi.id DESC";

            return await connection.QueryAsync<SalesOrderQuotationItem>(query);
        }

        public async Task<SalesOrderQuotationItem> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soqi.id,
                    soqi.quotation_id as quotationId,
                    soqi.sales_order_id as salesOrderId,
                    soqi.is_deleted as isDeleted,
                    soqi.item_id as itemId,
                    soqi.composition,
                    soqi.dosage_name as dosageName,
                    soqi.product_cast as productCast,
                    soqi.p_pack_short as pPackShort,
                    soqi.so_status as soStatus,
                    soqi.p_quantity as pQuantity,
                    soqi.p_foc_qty as pFocQty,
                    soqi.p_mrp as pMrp,
                    soqi.p_billing_rate as pBillingRate,
                    soqi.comments,
                    soqi.tax_percent as taxPercent,
                    soqi.product_extra_charges as productExtraCharges,
                    soqi.product_extra_charges_tax_percent as productExtraChargesTaxPercent
                FROM sales_order_quotation_items soqi
                WHERE soqi.id = @Id AND soqi.is_deleted = false";

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
                    product_extra_charges_tax_percent, is_deleted
                ) VALUES (
                    @QuotationId, @SalesOrderId, @ItemId, @Composition, @DosageName,
                    @ProductCast, @PPackShort, @SoStatus, @PQuantity, @PFocQty,
                    @PMrp, @PBillingRate, @Comments, @TaxPercent, @ProductExtraCharges,
                    @ProductExtraChargesTaxPercent, @IsDeleted
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
                    product_extra_charges = @ProductExtraCharges, product_extra_charges_tax_percent = @ProductExtraChargesTaxPercent
                WHERE id = @Id AND is_deleted = false
                RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderQuotationItem>(query, quotationItem);
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "UPDATE sales_order_quotation_items SET is_deleted = true WHERE id = @Id";
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "SELECT COUNT(*) FROM sales_order_quotation_items WHERE id = @Id AND is_deleted = false";
            var count = await connection.QuerySingleAsync<int>(query, new { Id = id });
            return count > 0;
        }

        public async Task<IEnumerable<SalesOrderQuotationItem>> GetByQuotationIdAsync(int quotationId)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soqi.id,
                    soqi.quotation_id as quotationId,
                    soqi.sales_order_id as salesOrderId,
                    soqi.is_deleted as isDeleted,
                    soqi.item_id as itemId,
                    soqi.composition,
                    soqi.dosage_name as dosageName,
                    soqi.product_cast as productCast,
                    soqi.p_pack_short as pPackShort,
                    soqi.so_status as soStatus,
                    soqi.p_quantity as pQuantity,
                    soqi.p_foc_qty as pFocQty,
                    soqi.p_mrp as pMrp,
                    soqi.p_billing_rate as pBillingRate,
                    soqi.comments,
                    soqi.tax_percent as taxPercent,
                    soqi.product_extra_charges as productExtraCharges,
                    soqi.product_extra_charges_tax_percent as productExtraChargesTaxPercent
                FROM sales_order_quotation_items soqi
                WHERE soqi.quotation_id = @QuotationId AND soqi.is_deleted = false
                ORDER BY soqi.id DESC";

            return await connection.QueryAsync<SalesOrderQuotationItem>(query, new { QuotationId = quotationId });
        }

        public async Task<IEnumerable<SalesOrderQuotationItem>> GetBySalesOrderIdAsync(int salesOrderId)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soqi.id,
                    soqi.quotation_id as quotationId,
                    soqi.sales_order_id as salesOrderId,
                    soqi.is_deleted as isDeleted,
                    soqi.item_id as itemId,
                    soqi.composition,
                    soqi.dosage_name as dosageName,
                    soqi.product_cast as productCast,
                    soqi.p_pack_short as pPackShort,
                    soqi.so_status as soStatus,
                    soqi.p_quantity as pQuantity,
                    soqi.p_foc_qty as pFocQty,
                    soqi.p_mrp as pMrp,
                    soqi.p_billing_rate as pBillingRate,
                    soqi.comments,
                    soqi.tax_percent as taxPercent,
                    soqi.product_extra_charges as productExtraCharges,
                    soqi.product_extra_charges_tax_percent as productExtraChargesTaxPercent
                FROM sales_order_quotation_items soqi
                WHERE soqi.sales_order_id = @SalesOrderId AND soqi.is_deleted = false
                ORDER BY soqi.id DESC";

            return await connection.QueryAsync<SalesOrderQuotationItem>(query, new { SalesOrderId = salesOrderId });
        }
    }
} 