using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class SalesOrderCommentRepository : ISalesOrderCommentRepository
    {
        private readonly DapperDbContext _context;

        public SalesOrderCommentRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<SalesOrderComment>> GetAllAsync()
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soc.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name
                FROM sales_order_comments soc
                LEFT JOIN users u1 ON soc.created_by = u1.id
                WHERE soc.is_deleted = false
                ORDER BY soc.created_at DESC";

            return await connection.QueryAsync<SalesOrderComment>(query);
        }

        public async Task<SalesOrderComment> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soc.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name
                FROM sales_order_comments soc
                LEFT JOIN users u1 ON soc.created_by = u1.id
                WHERE soc.id = @Id AND soc.is_deleted = false";

            return await connection.QuerySingleOrDefaultAsync<SalesOrderComment>(query, new { Id = id });
        }

        public async Task<SalesOrderComment> AddAsync(SalesOrderComment comment)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                INSERT INTO sales_order_comments (
                    sales_order_id, comments, status, type, 
                    created_by, created_at
                ) VALUES (
                    @SalesOrderId, @Comments, @Status, @Type,
                    @CreatedBy, @CreatedAt
                ) RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderComment>(query, comment);
        }

        public async Task<SalesOrderComment> UpdateAsync(SalesOrderComment comment)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                UPDATE sales_order_comments SET
                    comments = @Comments,
                    status = @Status,
                    type = @Type
                WHERE id = @Id AND is_deleted = false
                RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderComment>(query, comment);
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "UPDATE sales_order_comments SET is_deleted = true WHERE id = @Id";
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "SELECT COUNT(*) FROM sales_order_comments WHERE id = @Id AND is_deleted = false";
            var count = await connection.QuerySingleAsync<int>(query, new { Id = id });
            return count > 0;
        }

        public async Task<IEnumerable<SalesOrderComment>> GetBySalesOrderIdAsync(int salesOrderId)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soc.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name
                FROM sales_order_comments soc
                LEFT JOIN users u1 ON soc.created_by = u1.id
                WHERE soc.sales_order_id = @SalesOrderId AND soc.is_deleted = false
                ORDER BY soc.created_at DESC";

            return await connection.QueryAsync<SalesOrderComment>(query, new { SalesOrderId = salesOrderId });
        }

        public async Task<IEnumerable<SalesOrderComment>> GetByStatusAsync(string status)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soc.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name
                FROM sales_order_comments soc
                LEFT JOIN users u1 ON soc.created_by = u1.id
                WHERE soc.status = @Status AND soc.is_deleted = false
                ORDER BY soc.created_at DESC";

            return await connection.QueryAsync<SalesOrderComment>(query, new { Status = status });
        }

        public async Task<IEnumerable<SalesOrderComment>> GetByTypeAsync(string type)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soc.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name
                FROM sales_order_comments soc
                LEFT JOIN users u1 ON soc.created_by = u1.id
                WHERE soc.type = @Type AND soc.is_deleted = false
                ORDER BY soc.created_at DESC";

            return await connection.QueryAsync<SalesOrderComment>(query, new { Type = type });
        }
    }
} 