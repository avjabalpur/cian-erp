using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class SalesOrderSaveTransactionRepository : ISalesOrderSaveTransactionRepository
    {
        private readonly DapperDbContext _context;

        public SalesOrderSaveTransactionRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<SalesOrderSaveTransaction>> GetAllAsync()
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    sost.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name
                FROM sales_order_save_transactions sost
                LEFT JOIN users u1 ON sost.created_by = u1.id
                ORDER BY sost.created_at DESC";

            return await connection.QueryAsync<SalesOrderSaveTransaction>(query);
        }

        public async Task<SalesOrderSaveTransaction> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    sost.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name
                FROM sales_order_save_transactions sost
                LEFT JOIN users u1 ON sost.created_by = u1.id
                WHERE sost.id = @Id";

            return await connection.QuerySingleOrDefaultAsync<SalesOrderSaveTransaction>(query, new { Id = id });
        }

        public async Task<SalesOrderSaveTransaction> AddAsync(SalesOrderSaveTransaction saveTransaction)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                INSERT INTO sales_order_save_transactions (
                    sales_order_id, diff, created_by, created_at
                ) VALUES (
                    @SalesOrderId, @Diff, @CreatedBy, @CreatedAt
                ) RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderSaveTransaction>(query, saveTransaction);
        }

        public async Task<SalesOrderSaveTransaction> UpdateAsync(SalesOrderSaveTransaction saveTransaction)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                UPDATE sales_order_save_transactions SET
                    diff = @Diff,
                    updated_by = @UpdatedBy,
                    updated_at = @UpdatedAt
                WHERE id = @Id
                RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderSaveTransaction>(query, saveTransaction);
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "DELETE FROM sales_order_save_transactions WHERE id = @Id";
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "SELECT COUNT(*) FROM sales_order_save_transactions WHERE id = @Id";
            var count = await connection.QuerySingleAsync<int>(query, new { Id = id });
            return count > 0;
        }

        public async Task<IEnumerable<SalesOrderSaveTransaction>> GetBySalesOrderIdAsync(int salesOrderId)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    sost.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name
                FROM sales_order_save_transactions sost
                LEFT JOIN users u1 ON sost.created_by = u1.id
                WHERE sost.sales_order_id = @SalesOrderId
                ORDER BY sost.created_at DESC";

            return await connection.QueryAsync<SalesOrderSaveTransaction>(query, new { SalesOrderId = salesOrderId });
        }
    }
} 