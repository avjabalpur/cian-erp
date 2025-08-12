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
                    soq.id as id,
                    soq.created_at as createdAt,
                    soq.created_by as createdBy,
                    soq.is_deleted as isDeleted,
                    soq.company_name as companyName,
                    soq.quotation_number as quotationNumber,
                    soq.quotation_date as quotationDate,
                    soq.customer_name as customerName,
                    soq.customer_contact_person as customerContactPerson,
                    soq.customer_mobile_number as customerMobileNumber,
                    soq.customer_email as customerEmail,
                    soq.payment_terms as paymentTerms,
                    soq.advance_percentage as advancePercentage,
                    soq.charges,
                    soq.total_amount as totalAmount,
                    soq.advance_amount as advanceAmount,
                    soq.prev_copy_quotation_id as prevCopyQuotationId,
                    soq.final_comment as finalComment,
                    soq.terms
                FROM sales_order_quotation soq
                WHERE soq.is_deleted = false
                ORDER BY soq.created_at DESC";

            return await connection.QueryAsync<SalesOrderQuotation>(query);
        }

        public async Task<SalesOrderQuotation> GetByIdAsync(int id)
        {
            var query = @"
                SELECT 
                    soq.id as id,
                    soq.created_at as createdAt,
                    soq.created_by as createdBy,
                    soq.is_deleted as isDeleted,
                    soq.company_name as companyName,
                    soq.quotation_number as quotationNumber,
                    soq.quotation_date as quotationDate,
                    soq.customer_name as customerName,
                    soq.customer_contact_person as customerContactPerson,
                    soq.customer_mobile_number as customerMobileNumber,
                    soq.customer_email as customerEmail,
                    soq.payment_terms as paymentTerms,
                    soq.advance_percentage as advancePercentage,
                    soq.charges,
                    soq.total_amount as totalAmount,
                    soq.advance_amount as advanceAmount,
                    soq.prev_copy_quotation_id as prevCopyQuotationId,
                    soq.final_comment as finalComment,
                    soq.terms
                FROM sales_order_quotation soq
                WHERE soq.id = @Id AND soq.is_deleted = false";

            using var connection = _context.GetConnection();
            return await connection.QuerySingleOrDefaultAsync<SalesOrderQuotation>(query, new { Id = id });
        }

        public async Task<SalesOrderQuotation> GetByQuotationNumberAsync(string quotationNumber)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soq.id as id,
                    soq.created_at as createdAt,
                    soq.created_by as createdBy,
                    soq.is_deleted as isDeleted,
                    soq.company_name as companyName,
                    soq.quotation_number as quotationNumber,
                    soq.quotation_date as quotationDate,
                    soq.customer_name as customerName,
                    soq.customer_contact_person as customerContactPerson,
                    soq.customer_mobile_number as customerMobileNumber,
                    soq.customer_email as customerEmail,
                    soq.payment_terms as paymentTerms,
                    soq.advance_percentage as advancePercentage,
                    soq.charges,
                    soq.total_amount as totalAmount,
                    soq.advance_amount as advanceAmount,
                    soq.prev_copy_quotation_id as prevCopyQuotationId,
                    soq.final_comment as finalComment,
                    soq.terms
                FROM sales_order_quotation soq
                WHERE soq.quotation_number = @QuotationNumber AND soq.is_deleted = false";

            return await connection.QuerySingleOrDefaultAsync<SalesOrderQuotation>(query, new { QuotationNumber = quotationNumber });
        }

        public async Task<SalesOrderQuotation> AddAsync(SalesOrderQuotation quotation)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                INSERT INTO sales_order_quotation (
                    company_name, quotation_number, quotation_date, customer_name,
                    customer_contact_person, customer_mobile_number, customer_email,
                    payment_terms, advance_percentage, charges, total_amount, advance_amount,
                    prev_copy_quotation_id, final_comment, terms, is_deleted, created_by, created_at,
                    updated_by, updated_at
                ) VALUES (
                    @CompanyName, @QuotationNumber, @QuotationDate, @CustomerName,
                    @CustomerContactPerson, @CustomerMobileNumber, @CustomerEmail,
                    @PaymentTerms, @AdvancePercentage, @Charges, @TotalAmount, @AdvanceAmount,
                    @PrevCopyQuotationId, @FinalComment, @Terms, @IsDeleted, @CreatedBy, @CreatedAt,
                    @UpdatedBy, @UpdatedAt
                ) RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderQuotation>(query, quotation);
        }

        public async Task<SalesOrderQuotation> UpdateAsync(SalesOrderQuotation quotation)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                UPDATE sales_order_quotation SET
                    company_name = @CompanyName, quotation_number = @QuotationNumber,
                    quotation_date = @QuotationDate, customer_name = @CustomerName,
                    customer_contact_person = @CustomerContactPerson, customer_mobile_number = @CustomerMobileNumber,
                    customer_email = @CustomerEmail, payment_terms = @PaymentTerms,
                    advance_percentage = @AdvancePercentage, charges = @Charges,
                    total_amount = @TotalAmount, advance_amount = @AdvanceAmount,
                    prev_copy_quotation_id = @PrevCopyQuotationId, final_comment = @FinalComment,
                    terms = @Terms, updated_by = @UpdatedBy, updated_at = @UpdatedAt
                WHERE id = @Id AND is_deleted = false
                RETURNING *";

            return await connection.QuerySingleAsync<SalesOrderQuotation>(query, quotation);
        }

        public async Task DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "UPDATE sales_order_quotation SET is_deleted = true WHERE id = @Id";
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var query = "SELECT COUNT(*) FROM sales_order_quotation WHERE id = @Id AND is_deleted = false";
            var count = await connection.QuerySingleAsync<int>(query, new { Id = id });
            return count > 0;
        }

        public async Task<bool> QuotationNumberExistsAsync(string quotationNumber, int? excludeId = null)
        {
            using var connection = _context.GetConnection();
            
            var query = "SELECT COUNT(*) FROM sales_order_quotation WHERE quotation_number = @QuotationNumber AND is_deleted = false";
            var parameters = new { QuotationNumber = quotationNumber };
            
            var count = await connection.QuerySingleAsync<int>(query, parameters);
            return count > 0;
        }

        public async Task<IEnumerable<SalesOrderQuotation>> GetByCustomerNameAsync(string customerName)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soq.id as id,
                    soq.created_at as createdAt,
                    soq.created_by as createdBy,
                    soq.is_deleted as isDeleted,
                    soq.company_name as companyName,
                    soq.quotation_number as quotationNumber,
                    soq.quotation_date as quotationDate,
                    soq.customer_name as customerName,
                    soq.customer_contact_person as customerContactPerson,
                    soq.customer_mobile_number as customerMobileNumber,
                    soq.customer_email as customerEmail,
                    soq.payment_terms as paymentTerms,
                    soq.advance_percentage as advancePercentage,
                    soq.charges,
                    soq.total_amount as totalAmount,
                    soq.advance_amount as advanceAmount,
                    soq.prev_copy_quotation_id as prevCopyQuotationId,
                    soq.final_comment as finalComment,
                    soq.terms
                FROM sales_order_quotation soq
                WHERE soq.customer_name ILIKE @CustomerName AND soq.is_deleted = false
                ORDER BY soq.created_at DESC";

            return await connection.QueryAsync<SalesOrderQuotation>(query, new { CustomerName = $"%{customerName}%" });
        }

        public async Task<IEnumerable<SalesOrderQuotation>> GetByCompanyNameAsync(string companyName)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soq.id as id,
                    soq.created_at as createdAt,
                    soq.created_by as createdBy,
                    soq.is_deleted as isDeleted,
                    soq.company_name as companyName,
                    soq.quotation_number as quotationNumber,
                    soq.quotation_date as quotationDate,
                    soq.customer_name as customerName,
                    soq.customer_contact_person as customerContactPerson,
                    soq.customer_mobile_number as customerMobileNumber,
                    soq.customer_email as customerEmail,
                    soq.payment_terms as paymentTerms,
                    soq.advance_percentage as advancePercentage,
                    soq.charges,
                    soq.total_amount as totalAmount,
                    soq.advance_amount as advanceAmount,
                    soq.prev_copy_quotation_id as prevCopyQuotationId,
                    soq.final_comment as finalComment,
                    soq.terms
                FROM sales_order_quotation soq
                WHERE soq.company_name ILIKE @CompanyName AND soq.is_deleted = false
                ORDER BY soq.created_at DESC";

            return await connection.QueryAsync<SalesOrderQuotation>(query, new { CompanyName = $"%{companyName}%" });
        }

        public async Task<IEnumerable<SalesOrderQuotation>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                SELECT 
                    soq.id as id,
                    soq.created_at as createdAt,
                    soq.created_by as createdBy,
                    soq.is_deleted as isDeleted,
                    soq.company_name as companyName,
                    soq.quotation_number as quotationNumber,
                    soq.quotation_date as quotationDate,
                    soq.customer_name as customerName,
                    soq.customer_contact_person as customerContactPerson,
                    soq.customer_mobile_number as customerMobileNumber,
                    soq.customer_email as customerEmail,
                    soq.payment_terms as paymentTerms,
                    soq.advance_percentage as advancePercentage,
                    soq.charges,
                    soq.total_amount as totalAmount,
                    soq.advance_amount as advanceAmount,
                    soq.prev_copy_quotation_id as prevCopyQuotationId,
                    soq.final_comment as finalComment,
                    soq.terms
                FROM sales_order_quotation soq
                WHERE soq.quotation_date BETWEEN @StartDate AND @EndDate AND soq.is_deleted = false
                ORDER BY soq.quotation_date DESC";

            return await connection.QueryAsync<SalesOrderQuotation>(query, new { StartDate = startDate, EndDate = endDate });
        }
    }
} 