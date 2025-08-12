using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;
using Xcianify.Core.DTOs.SalesOrder;

namespace Xcianify.Repository
{
    public class SalesOrderQuotationRepository : ISalesOrderQuotationRepository
    {
        private readonly DapperDbContext _context;

        public SalesOrderQuotationRepository(DapperDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<SalesOrderQuotation> GetByIdAsync(int id)
        {
            var query = @"
                SELECT 
                    soq.id as id,
                    soq.created_at as createdAt,
                    soq.created_by as createdBy,
                    soq.is_deleted as isDeleted,
                    o.name as companyName,
                    soq.quotation_number as quotationNumber,
                    soq.quotation_date as quotationDate,
                    c.customer_name as customerName,
                    '' as customerContactPerson,
                    c.phone as customerMobileNumber,
                    c.email as customerEmail,
                    '' as paymentTerms,
                    soq.advance_percentage as advancePercentage,
                    soq.charges,
                    soq.total_amount as totalAmount,
                    soq.advance_amount as advanceAmount,
                    soq.prev_copy_quotation_id as prevCopyQuotationId,
                    '' as finalComment,
                    '' as terms
                FROM sales_order_quotation soq
                LEFT JOIN organizations o ON soq.organization_id = o.id
                LEFT JOIN customers c ON soq.customer_id = c.id
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
                    o.name as companyName,
                    soq.quotation_number as quotationNumber,
                    soq.quotation_date as quotationDate,
                    c.customer_name as customerName,
                    '' as customerContactPerson,
                    c.phone as customerMobileNumber,
                    c.email as customerEmail,
                    '' as paymentTerms,
                    soq.advance_percentage as advancePercentage,
                    soq.charges,
                    soq.total_amount as totalAmount,
                    soq.advance_amount as advanceAmount,
                    soq.prev_copy_quotation_id as prevCopyQuotationId,
                    '' as finalComment,
                    '' as terms
                FROM sales_order_quotation soq
                LEFT JOIN organizations o ON soq.organization_id = o.id
                LEFT JOIN customers c ON soq.customer_id = c.id
                WHERE soq.quotation_number = @QuotationNumber AND soq.is_deleted = false";

            return await connection.QuerySingleOrDefaultAsync<SalesOrderQuotation>(query, new { QuotationNumber = quotationNumber });
        }

        public async Task<SalesOrderQuotation> AddAsync(SalesOrderQuotation quotation)
        {
            using var connection = _context.GetConnection();
            
            var query = @"
                INSERT INTO sales_order_quotation (
                    organization_id, quotation_number, quotation_date, customer_id,
                    advance_percentage, charges, total_amount, advance_amount,
                    prev_copy_quotation_id, is_deleted, created_by, created_at
                ) VALUES (
                    @OrganizationId, @QuotationNumber, @QuotationDate, @CustomerId,
                    @AdvancePercentage, @Charges, @TotalAmount, @AdvanceAmount,
                    @PrevCopyQuotationId, @IsDeleted, @CreatedBy, @CreatedAt
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
                    prev_copy_quotation_id = @PrevCopyQuotationId
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
       
        public async Task<(IEnumerable<SalesOrderQuotation> Items, int TotalCount)> GetAllAsync(QuotationFilterDto filterDto)
        {
            using var connection = _context.GetConnection();
            
            // If no filters provided, use default values
            var search = filterDto?.Search ?? "";
            var companyName = filterDto?.CompanyName ?? "";
            var customerName = filterDto?.CustomerName ?? "";
            var createdBy = filterDto?.CreatedBy;
            var fromDate = filterDto?.GetFromDate();
            var toDate = filterDto?.GetToDate();
            var sortBy = filterDto?.SortBy ?? "created_at";
            var sortOrder = filterDto?.SortOrder ?? "DESC";
            var page = filterDto?.Page ?? 1;
            var pageSize = filterDto?.PageSize ?? 10;
            
            var whereClause = "WHERE soq.is_deleted = false";
            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(search))
            {
                whereClause += " AND (soq.quotation_number ILIKE @Search OR c.customer_name ILIKE @Search OR o.name ILIKE @Search)";
                parameters.Add("@Search", $"%{search}%");
            }

            if (!string.IsNullOrEmpty(companyName) && companyName != "ANY")
            {
                whereClause += " AND o.name ILIKE @CompanyName";
                parameters.Add("@CompanyName", $"%{companyName}%");
            }

            if (!string.IsNullOrEmpty(customerName))
            {
                whereClause += " AND c.customer_name ILIKE @CustomerName";
                parameters.Add("@CustomerName", $"%{customerName}%");
            }

            if (createdBy.HasValue)
            {
                whereClause += " AND soq.created_by = @CreatedBy";
                parameters.Add("@CreatedBy", createdBy.Value);
            }

            if (fromDate.HasValue)
            {
                whereClause += " AND soq.quotation_date >= @FromDate";
                parameters.Add("@FromDate", fromDate.Value.Date);
            }

            if (toDate.HasValue)
            {
                whereClause += " AND soq.quotation_date <= @ToDate";
                parameters.Add("@ToDate", toDate.Value.Date.AddDays(1).AddSeconds(-1));
            }

            var countQuery = $@"
                SELECT COUNT(*)
                FROM sales_order_quotation soq
                LEFT JOIN organizations o ON soq.organization_id = o.id
                LEFT JOIN customers c ON soq.customer_id = c.id
                {whereClause}";

            var totalCount = await connection.QuerySingleAsync<int>(countQuery, parameters);

            // Map sort fields to actual table columns
            var sortField = sortBy switch
            {
                "quotation_number" => "soq.quotation_number",
                "quotation_date" => "soq.quotation_date",
                "customer_name" => "c.customer_name",
                "total_amount" => "soq.total_amount",
                "company_name" => "o.name",
                "created_at" => "soq.created_at",
                _ => "soq.created_at"
            };

            var orderClause = $"ORDER BY {sortField} {sortOrder}";
            var limitClause = $"LIMIT {pageSize} OFFSET {(page - 1) * pageSize}";

            var query = $@"
                SELECT 
                    soq.id as id,
                    soq.created_at as createdAt,
                    soq.created_by as createdBy,
                    soq.is_deleted as isDeleted,
                    o.name as companyName,
                    soq.quotation_number as quotationNumber,
                    soq.quotation_date as quotationDate,
                    c.customer_name as customerName,
                    '' as customerContactPerson,
                    '' as paymentTerms,
                    soq.advance_percentage as advancePercentage,
                    soq.charges,
                    soq.total_amount as totalAmount,
                    soq.advance_amount as advanceAmount,
                    soq.prev_copy_quotation_id as prevCopyQuotationId,
                    '' as finalComment,
                    '' as terms
                FROM sales_order_quotation soq
                LEFT JOIN organizations o ON soq.organization_id = o.id
                LEFT JOIN customers c ON soq.customer_id = c.id
                {whereClause}
                {orderClause}
                {limitClause}";

            var quotations = await connection.QueryAsync<SalesOrderQuotation>(query, parameters);

            return (quotations, totalCount);
        }
    }
} 