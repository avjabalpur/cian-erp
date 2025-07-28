using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class SalesOrderDocumentRepository : ISalesOrderDocumentRepository
    {
        private readonly DapperDbContext _context;

        public SalesOrderDocumentRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<SalesOrderDocument>> GetAllAsync()
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    sod.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_documents sod
                LEFT JOIN users u1 ON sod.created_by = u1.id
                LEFT JOIN users u2 ON sod.updated_by = u2.id
                WHERE sod.is_deleted = 0
                ORDER BY sod.created_at DESC";

            return await connection.QueryAsync<SalesOrderDocument>(query);
        }

        public async Task<SalesOrderDocument> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    sod.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_documents sod
                LEFT JOIN users u1 ON sod.created_by = u1.id
                LEFT JOIN users u2 ON sod.updated_by = u2.id
                WHERE sod.id = @Id AND sod.is_deleted = 0";

            return await connection.QuerySingleOrDefaultAsync<SalesOrderDocument>(query, new { Id = id });
        }

        public async Task<SalesOrderDocument> AddAsync(SalesOrderDocument document)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                INSERT INTO sales_order_documents (
                    sales_order_id, tag, file_name, file_path, file_type, metadata, 
                    created_by, created_at
                ) VALUES (
                    @SalesOrderId, @Tag, @FileName, @FilePath, @FileType, @Metadata,
                    @CreatedBy, @CreatedAt
                ) RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderDocument>(query, document);
        }

        public async Task<SalesOrderDocument> UpdateAsync(SalesOrderDocument document)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                UPDATE sales_order_documents SET
                    tag = @Tag,
                    file_name = @FileName,
                    file_path = @FilePath,
                    file_type = @FileType,
                    metadata = @Metadata,
                    updated_by = @UpdatedBy,
                    updated_at = @UpdatedAt
                WHERE id = @Id
                RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderDocument>(query, document);
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "UPDATE sales_order_documents SET is_deleted = 1 WHERE id = @Id";
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "SELECT COUNT(*) FROM sales_order_documents WHERE id = @Id AND is_deleted = 0";
            var count = await connection.QuerySingleAsync<int>(query, new { Id = id });
            return count > 0;
        }

        public async Task<IEnumerable<SalesOrderDocument>> GetBySalesOrderIdAsync(int salesOrderId)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    sod.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_documents sod
                LEFT JOIN users u1 ON sod.created_by = u1.id
                LEFT JOIN users u2 ON sod.updated_by = u2.id
                WHERE sod.sales_order_id = @SalesOrderId AND sod.is_deleted = 0
                ORDER BY sod.created_at DESC";

            return await connection.QueryAsync<SalesOrderDocument>(query, new { SalesOrderId = salesOrderId });
        }

        public async Task<IEnumerable<SalesOrderDocument>> GetByTagAsync(string tag)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    sod.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_documents sod
                LEFT JOIN users u1 ON sod.created_by = u1.id
                LEFT JOIN users u2 ON sod.updated_by = u2.id
                WHERE sod.tag = @Tag AND sod.is_deleted = 0
                ORDER BY sod.created_at DESC";

            return await connection.QueryAsync<SalesOrderDocument>(query, new { Tag = tag });
        }

        public async Task<IEnumerable<SalesOrderDocument>> GetByFileTypeAsync(string fileType)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    sod.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_documents sod
                LEFT JOIN users u1 ON sod.created_by = u1.id
                LEFT JOIN users u2 ON sod.updated_by = u2.id
                WHERE sod.file_type = @FileType AND sod.is_deleted = 0
                ORDER BY sod.created_at DESC";

            return await connection.QueryAsync<SalesOrderDocument>(query, new { FileType = fileType });
        }
    }
} 