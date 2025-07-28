using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class SalesOrderQuotationRepository : ISalesOrderQuotationRepository
    {
        private readonly DapperDbContext _context;

        public SalesOrderQuotationRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<SalesOrderQuotation>> GetAllAsync()
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soq.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_quotation soq
                LEFT JOIN users u1 ON soq.created_by = u1.id
                LEFT JOIN users u2 ON soq.updated_by = u2.id
                WHERE soq.is_deleted = 0
                ORDER BY soq.created_at DESC";

            return await connection.QueryAsync<SalesOrderQuotation>(query);
        }

        public async Task<SalesOrderQuotation> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soq.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_quotation soq
                LEFT JOIN users u1 ON soq.created_by = u1.id
                LEFT JOIN users u2 ON soq.updated_by = u2.id
                WHERE soq.id = @Id AND soq.is_deleted = 0";

            return await connection.QuerySingleOrDefaultAsync<SalesOrderQuotation>(query, new { Id = id });
        }

        public async Task<SalesOrderQuotation> GetByQuotationNumberAsync(string quotationNumber)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soq.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_quotation soq
                LEFT JOIN users u1 ON soq.created_by = u1.id
                LEFT JOIN users u2 ON soq.updated_by = u2.id
                WHERE soq.quotation_number = @QuotationNumber AND soq.is_deleted = 0";

            return await connection.QuerySingleOrDefaultAsync<SalesOrderQuotation>(query, new { QuotationNumber = quotationNumber });
        }

        public async Task<SalesOrderQuotation> AddAsync(SalesOrderQuotation quotation)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                INSERT INTO sales_order_quotation (
                    organization_id, quotation_number, quotation_date, customer_id,
                    advance_percentage, charges, total_amount, advance_amount,
                    prev_copy_quotation_id, is_deleted, created_by, created_at,
                    updated_by, updated_at
                ) VALUES (
                    @OrganizationId, @QuotationNumber, @QuotationDate, @CustomerId,
                    @AdvancePercentage, @Charges, @TotalAmount, @AdvanceAmount,
                    @PrevCopyQuotationId, @IsDeleted, @CreatedBy, @CreatedAt,
                    @UpdatedBy, @UpdatedAt
                ) RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderQuotation>(query, quotation);
        }

        public async Task<SalesOrderQuotation> UpdateAsync(SalesOrderQuotation quotation)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                UPDATE sales_order_quotation SET
                    organization_id = @OrganizationId, quotation_number = @QuotationNumber,
                    quotation_date = @QuotationDate, customer_id = @CustomerId,
                    advance_percentage = @AdvancePercentage, charges = @Charges,
                    total_amount = @TotalAmount, advance_amount = @AdvanceAmount,
                    prev_copy_quotation_id = @PrevCopyQuotationId,
                    updated_by = @UpdatedBy, updated_at = @UpdatedAt
                WHERE id = @Id AND is_deleted = 0
                RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderQuotation>(query, quotation);
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "UPDATE sales_order_quotation SET is_deleted = 1 WHERE id = @Id";
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "SELECT COUNT(*) FROM sales_order_quotation WHERE id = @Id AND is_deleted = 0";
            var count = await connection.QuerySingleAsync<int>(query, new { Id = id });
            return count > 0;
        }

        public async Task<bool> QuotationNumberExistsAsync(string quotationNumber, int? excludeId = null)
        {
            using var connection = _context.GetConnection();
            
            var query = "SELECT COUNT(*) FROM sales_order_quotation WHERE quotation_number = @QuotationNumber AND is_deleted = 0";
            var parameters = new { QuotationNumber = quotationNumber };
            
            var count = await connection.QuerySingleAsync<int>(query, parameters);
            return count > 0;
        }

        public async Task<IEnumerable<SalesOrderQuotation>> GetByCustomerIdAsync(int customerId)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soq.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_quotation soq
                LEFT JOIN users u1 ON soq.created_by = u1.id
                LEFT JOIN users u2 ON soq.updated_by = u2.id
                WHERE soq.customer_id = @CustomerId AND soq.is_deleted = 0
                ORDER BY soq.created_at DESC";

            return await connection.QueryAsync<SalesOrderQuotation>(query, new { CustomerId = customerId });
        }

        public async Task<IEnumerable<SalesOrderQuotation>> GetByOrganizationIdAsync(int organizationId)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soq.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_quotation soq
                LEFT JOIN users u1 ON soq.created_by = u1.id
                LEFT JOIN users u2 ON soq.updated_by = u2.id
                WHERE soq.organization_id = @OrganizationId AND soq.is_deleted = 0
                ORDER BY soq.created_at DESC";

            return await connection.QueryAsync<SalesOrderQuotation>(query, new { OrganizationId = organizationId });
        }

        public async Task<IEnumerable<SalesOrderQuotation>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soq.*,
                    u1.first_name || ' ' || u1.last_name as created_by_name,
                    u2.first_name || ' ' || u2.last_name as updated_by_name
                FROM sales_order_quotation soq
                LEFT JOIN users u1 ON soq.created_by = u1.id
                LEFT JOIN users u2 ON soq.updated_by = u2.id
                WHERE soq.quotation_date BETWEEN @StartDate AND @EndDate AND soq.is_deleted = 0
                ORDER BY soq.quotation_date DESC";

            return await connection.QueryAsync<SalesOrderQuotation>(query, new { StartDate = startDate, EndDate = endDate });
        }
    }
} 