using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class SalesOrderChatRepository : ISalesOrderChatRepository
    {
        private readonly DapperDbContext _context;

        public SalesOrderChatRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<SalesOrderChat>> GetAllAsync()
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soc.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name
                FROM sales_order_chat soc
                LEFT JOIN users u1 ON soc.created_by = u1.id
                ORDER BY soc.created_time DESC";

            return await connection.QueryAsync<SalesOrderChat>(query);
        }

        public async Task<SalesOrderChat> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soc.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name
                FROM sales_order_chat soc
                LEFT JOIN users u1 ON soc.created_by = u1.id
                WHERE soc.id = @Id";

            return await connection.QuerySingleOrDefaultAsync<SalesOrderChat>(query, new { Id = id });
        }

        public async Task<SalesOrderChat> AddAsync(SalesOrderChat chat)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                INSERT INTO sales_order_chat (
                    sales_order_id, comment, created_by, created_time
                ) VALUES (
                    @SalesOrderId, @Comment, @CreatedBy, @CreatedTime
                ) RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderChat>(query, chat);
        }

        public async Task<SalesOrderChat> UpdateAsync(SalesOrderChat chat)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                UPDATE sales_order_chat SET
                    comment = @Comment,
                    updated_by = @UpdatedBy,
                    updated_time = @UpdatedTime
                WHERE id = @Id
                RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderChat>(query, chat);
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "DELETE FROM sales_order_chat WHERE id = @Id";
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "SELECT COUNT(*) FROM sales_order_chat WHERE id = @Id";
            var count = await connection.QuerySingleAsync<int>(query, new { Id = id });
            return count > 0;
        }

        public async Task<IEnumerable<SalesOrderChat>> GetBySalesOrderIdAsync(int salesOrderId)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soc.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name
                FROM sales_order_chat soc
                LEFT JOIN users u1 ON soc.created_by = u1.id
                WHERE soc.sales_order_id = @SalesOrderId
                ORDER BY soc.created_time DESC";

            return await connection.QueryAsync<SalesOrderChat>(query, new { SalesOrderId = salesOrderId });
        }
    }
} 