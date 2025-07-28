using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;

namespace Xcianify.Repository
{
    public class SalesOrderPerformaInvoiceItemRepository : ISalesOrderPerformaInvoiceItemRepository
    {
        private readonly IDbConnection _connection;

        public SalesOrderPerformaInvoiceItemRepository(IConfiguration configuration)
        {
            _connection = new Npgsql.NpgsqlConnection(configuration.GetConnectionString("DefaultConnection"));
        }

        public async Task<IEnumerable<SalesOrderPerformaInvoiceItem>> GetAllAsync()
        {
            const string sql = @"
                SELECT 
                    pi.*,
                    u1.name as created_by_name,
                    u2.name as updated_by_name
                FROM sales_order_performa_invoice_items pi
                LEFT JOIN users u1 ON pi.created_by = u1.id
                LEFT JOIN users u2 ON pi.updated_by = u2.id
                WHERE pi.is_deleted = false
                ORDER BY pi.created_at DESC";

            return await _connection.QueryAsync<SalesOrderPerformaInvoiceItem>(sql);
        }

        public async Task<SalesOrderPerformaInvoiceItem> GetByIdAsync(int id)
        {
            const string sql = @"
                SELECT 
                    pi.*,
                    u1.name as created_by_name,
                    u2.name as updated_by_name
                FROM sales_order_performa_invoice_items pi
                LEFT JOIN users u1 ON pi.created_by = u1.id
                LEFT JOIN users u2 ON pi.updated_by = u2.id
                WHERE pi.id = @Id AND pi.is_deleted = false";

            return await _connection.QueryFirstOrDefaultAsync<SalesOrderPerformaInvoiceItem>(sql, new { Id = id });
        }

        public async Task<SalesOrderPerformaInvoiceItem> AddAsync(SalesOrderPerformaInvoiceItem item)
        {
            const string sql = @"
                INSERT INTO sales_order_performa_invoice_items 
                (performa_invoice_id, sales_order_id, item_id, composition, dosage_name, 
                 product_cast, p_pack_short, p_quantity, p_foc_qty, p_billing_rate,
                 created_at, updated_at, created_by, updated_by, is_deleted)
                VALUES 
                (@PerformaInvoiceId, @SalesOrderId, @ItemId, @Composition, @DosageName,
                 @ProductCast, @PPackShort, @PQuantity, @PFocQty, @PBillingRate,
                 @CreatedAt, @UpdatedAt, @CreatedBy, @UpdatedBy, @IsDeleted)
                RETURNING *";

            return await _connection.QueryFirstOrDefaultAsync<SalesOrderPerformaInvoiceItem>(sql, item);
        }

        public async Task<SalesOrderPerformaInvoiceItem> UpdateAsync(SalesOrderPerformaInvoiceItem item)
        {
            const string sql = @"
                UPDATE sales_order_performa_invoice_items 
                SET performa_invoice_id = @PerformaInvoiceId,
                    sales_order_id = @SalesOrderId,
                    item_id = @ItemId,
                    composition = @Composition,
                    dosage_name = @DosageName,
                    product_cast = @ProductCast,
                    p_pack_short = @PPackShort,
                    p_quantity = @PQuantity,
                    p_foc_qty = @PFocQty,
                    p_billing_rate = @PBillingRate,
                    updated_at = @UpdatedAt,
                    updated_by = @UpdatedBy
                WHERE id = @Id AND is_deleted = false
                RETURNING *";

            return await _connection.QueryFirstOrDefaultAsync<SalesOrderPerformaInvoiceItem>(sql, item);
        }

        public async Task DeleteAsync(int id)
        {
            const string sql = @"
                UPDATE sales_order_performa_invoice_items 
                SET is_deleted = true, updated_at = @UpdatedAt
                WHERE id = @Id";

            await _connection.ExecuteAsync(sql, new { Id = id, UpdatedAt = DateTime.UtcNow });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            const string sql = "SELECT COUNT(1) FROM sales_order_performa_invoice_items WHERE id = @Id AND is_deleted = false";
            var count = await _connection.ExecuteScalarAsync<int>(sql, new { Id = id });
            return count > 0;
        }

        public async Task<IEnumerable<SalesOrderPerformaInvoiceItem>> GetByPerformaInvoiceIdAsync(int performaInvoiceId)
        {
            const string sql = @"
                SELECT 
                    pi.*,
                    u1.name as created_by_name,
                    u2.name as updated_by_name
                FROM sales_order_performa_invoice_items pi
                LEFT JOIN users u1 ON pi.created_by = u1.id
                LEFT JOIN users u2 ON pi.updated_by = u2.id
                WHERE pi.performa_invoice_id = @PerformaInvoiceId AND pi.is_deleted = false
                ORDER BY pi.created_at DESC";

            return await _connection.QueryAsync<SalesOrderPerformaInvoiceItem>(sql, new { PerformaInvoiceId = performaInvoiceId });
        }

        public async Task<IEnumerable<SalesOrderPerformaInvoiceItem>> GetBySalesOrderIdAsync(int salesOrderId)
        {
            const string sql = @"
                SELECT 
                    pi.*,
                    u1.name as created_by_name,
                    u2.name as updated_by_name
                FROM sales_order_performa_invoice_items pi
                LEFT JOIN users u1 ON pi.created_by = u1.id
                LEFT JOIN users u2 ON pi.updated_by = u2.id
                WHERE pi.sales_order_id = @SalesOrderId AND pi.is_deleted = false
                ORDER BY pi.created_at DESC";

            return await _connection.QueryAsync<SalesOrderPerformaInvoiceItem>(sql, new { SalesOrderId = salesOrderId });
        }
    }
} 