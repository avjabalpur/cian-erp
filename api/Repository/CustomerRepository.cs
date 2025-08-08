using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.Customer;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly DapperDbContext _context;

        public CustomerRepository(DapperDbContext context)
        {
            _context = context;
        }

        public async Task<(List<Customer> items, int totalCount)> GetAllAsync(CustomerFilterDto filter)
        {
            using var connection = _context.GetConnection();
            
            var whereConditions = new List<string>();
            var parameters = new DynamicParameters();

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                whereConditions.Add("(customer_name ILIKE @Search OR customer_code ILIKE @Search OR short_name ILIKE @Search)");
                parameters.Add("@Search", $"%{filter.Search}%");
            }

            if (!string.IsNullOrWhiteSpace(filter.CustomerCode))
            {
                whereConditions.Add("customer_code ILIKE @CustomerCode");
                parameters.Add("@CustomerCode", $"%{filter.CustomerCode}%");
            }

            if (!string.IsNullOrWhiteSpace(filter.CustomerName))
            {
                whereConditions.Add("customer_name ILIKE @CustomerName");
                parameters.Add("@CustomerName", $"%{filter.CustomerName}%");
            }

            if (!string.IsNullOrWhiteSpace(filter.CustomerTypeCode))
            {
                whereConditions.Add("customer_type_code = @CustomerTypeCode");
                parameters.Add("@CustomerTypeCode", filter.CustomerTypeCode);
            }

            if (!string.IsNullOrWhiteSpace(filter.Gstin))
            {
                whereConditions.Add("gstin ILIKE @Gstin");
                parameters.Add("@Gstin", $"%{filter.Gstin}%");
            }

            if (filter.IsActive.HasValue)
            {
                whereConditions.Add("is_active = @IsActive");
                parameters.Add("@IsActive", filter.IsActive.Value);
            }

            if (filter.IsExportCustomer.HasValue)
            {
                whereConditions.Add("is_export_customer = @IsExportCustomer");
                parameters.Add("@IsExportCustomer", filter.IsExportCustomer.Value);
            }

            // Always filter out deleted records
            whereConditions.Add("is_deleted = false");

            var whereClause = whereConditions.Count > 0 ? $"WHERE {string.Join(" AND ", whereConditions)}" : "";

            // Count query
            var countSql = $@"
                SELECT COUNT(*) 
                FROM customers 
                {whereClause}";

            var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

            // Data query
            var orderBy = filter.SortDescending ? "DESC" : "ASC";
            var sortColumn = filter.SortBy?.ToLower() switch
            {
                "customercode" => "customer_code",
                "customername" => "customer_name",
                "shortname" => "short_name",
                "gstin" => "gstin",
                "createdat" => "created_at",
                _ => "customer_name"
            };

            var sql = $@"
                SELECT 
                    id, location_code as locationCode, customer_number as customerNumber, customer_code as customerCode, customer_name as customerName, 
                    short_name as shortName, payee_name as payeeName, customer_type_code as customerTypeCode, segment_code as segmentCode, 
                    income_tax_pan_number as incomeTaxPanNumber, customer_sale_type as customerSaleType, export_type as exportType, gstin as gstin, 
                    drug_license_number as drugLicenseNumber, drug_license_expiry_date as drugLicenseExpiryDate, other_license_number as otherLicenseNumber, 
                    old_code as oldCode, customer_lot_number as customerLotNumber, stop_invoice as stopInvoice, is_export_customer as isExportCustomer, 
                    is_registered_dealer as isRegisteredDealer, is_record_closed as isRecordClosed, is_active as isActive, continent as continent, 
                    rebates as rebates, external_information as externalInformation, created_at as createdAt, updated_at as updatedAt, created_by as createdBy, 
                    updated_by as updatedBy, is_deleted as isDeleted    
                FROM customers 
                {whereClause}
                ORDER BY {sortColumn} {orderBy}
                LIMIT @PageSize OFFSET @Offset";

            parameters.Add("@PageSize", filter.PageSize);
            parameters.Add("@Offset", (filter.PageNumber - 1) * filter.PageSize);

            var items = await connection.QueryAsync<Customer>(sql, parameters);
            return (items.ToList(), totalCount);
        }

        public async Task<Customer?> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var sql = @"
                SELECT 
                    id, location_code as locationCode, customer_number as customerNumber, customer_code as customerCode, customer_name as customerName, 
                    short_name as shortName, payee_name as payeeName, customer_type_code as customerTypeCode, segment_code as segmentCode, 
                    income_tax_pan_number as incomeTaxPanNumber, customer_sale_type as customerSaleType, export_type as exportType, gstin as gstin, 
                    drug_license_number as drugLicenseNumber, drug_license_expiry_date as drugLicenseExpiryDate, other_license_number as otherLicenseNumber, 
                    old_code as oldCode, customer_lot_number as customerLotNumber, stop_invoice as stopInvoice, is_export_customer as isExportCustomer, 
                    is_registered_dealer as isRegisteredDealer, is_record_closed as isRecordClosed, is_active as isActive, continent as continent, 
                    rebates as rebates, external_information as externalInformation, created_at as createdAt, updated_at as updatedAt, created_by as createdBy, 
                    updated_by as updatedBy, is_deleted as isDeleted
                FROM customers 
                WHERE id = @Id AND is_deleted = false";

            return await connection.QueryFirstOrDefaultAsync<Customer>(sql, new { Id = id });
        }

        public async Task<Customer?> GetByCodeAsync(string customerCode)
        {
            using var connection = _context.GetConnection();
            
            var sql = @"
                SELECT 
                    id, location_code as locationCode, customer_number as customerNumber, customer_code as customerCode, customer_name as customerName, 
                    short_name as shortName, payee_name as payeeName, customer_type_code as customerTypeCode, segment_code as segmentCode, 
                    income_tax_pan_number as incomeTaxPanNumber, customer_sale_type as customerSaleType, export_type as exportType, gstin as gstin, 
                    drug_license_number as drugLicenseNumber, drug_license_expiry_date as drugLicenseExpiryDate, other_license_number as otherLicenseNumber, 
                    old_code as oldCode, customer_lot_number as customerLotNumber, stop_invoice as stopInvoice, is_export_customer as isExportCustomer, 
                    is_registered_dealer as isRegisteredDealer, is_record_closed as isRecordClosed, is_active as isActive, continent as continent, 
                    rebates as rebates, external_information as externalInformation, created_at as createdAt, updated_at as updatedAt, created_by as createdBy, 
                    updated_by as updatedBy, is_deleted as isDeleted
                FROM customers 
                WHERE customer_code = @CustomerCode AND is_deleted = false";

            return await connection.QueryFirstOrDefaultAsync<Customer>(sql, new { CustomerCode = customerCode });
        }

        public async Task<Customer> CreateAsync(Customer customer)
        {
            using var connection = _context.GetConnection();
            
            var sql = @"
                INSERT INTO customers (
                    location_code, customer_number, customer_code, customer_name, 
                    short_name, payee_name, customer_type_code, segment_code, 
                    income_tax_pan_number, customer_sale_type, export_type, gstin, 
                    drug_license_number, drug_license_expiry_date, other_license_number, 
                    old_code, customer_lot_number, stop_invoice, is_export_customer, 
                    is_registered_dealer, is_record_closed, is_active, continent, 
                    rebates, external_information, created_at, updated_at, created_by, 
                    updated_by, is_deleted
                ) VALUES (
                    @LocationCode, @CustomerNumber, @CustomerCode, @CustomerName, 
                    @ShortName, @PayeeName, @CustomerTypeCode, @SegmentCode, 
                    @IncomeTaxPanNumber, @CustomerSaleType, @ExportType, @Gstin, 
                    @DrugLicenseNumber, @DrugLicenseExpiryDate, @OtherLicenseNumber, 
                    @OldCode, @CustomerLotNumber, @StopInvoice, @IsExportCustomer, 
                    @IsRegisteredDealer, @IsRecordClosed, @IsActive, @Continent, 
                    @Rebates, @ExternalInformation, @CreatedAt, @UpdatedAt, @CreatedBy, 
                    @UpdatedBy, @IsDeleted
                ) RETURNING *";

            return await connection.QueryFirstAsync<Customer>(sql, customer);
        }

        public async Task<Customer> UpdateAsync(Customer customer)
        {
            using var connection = _context.GetConnection();
            
            var sql = @"
                UPDATE customers SET 
                    location_code = @LocationCode, customer_number = @CustomerNumber, 
                    customer_code = @CustomerCode, customer_name = @CustomerName, 
                    short_name = @ShortName, payee_name = @PayeeName, 
                    customer_type_code = @CustomerTypeCode, segment_code = @SegmentCode, 
                    income_tax_pan_number = @IncomeTaxPanNumber, 
                    customer_sale_type = @CustomerSaleType, export_type = @ExportType, 
                    gstin = @Gstin, drug_license_number = @DrugLicenseNumber, 
                    drug_license_expiry_date = @DrugLicenseExpiryDate, 
                    other_license_number = @OtherLicenseNumber, old_code = @OldCode, 
                    customer_lot_number = @CustomerLotNumber, stop_invoice = @StopInvoice, 
                    is_export_customer = @IsExportCustomer, 
                    is_registered_dealer = @IsRegisteredDealer, 
                    is_record_closed = @IsRecordClosed, is_active = @IsActive, 
                    continent = @Continent, rebates = @Rebates, 
                    external_information = @ExternalInformation, 
                    updated_at = @UpdatedAt, updated_by = @UpdatedBy
                WHERE id = @Id AND is_deleted = false
                RETURNING *";

            return await connection.QueryFirstAsync<Customer>(sql, customer);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var sql = @"
                UPDATE customers 
                SET is_deleted = true, updated_at = CURRENT_TIMESTAMP 
                WHERE id = @Id AND is_deleted = false";

            var rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            
            var sql = "SELECT COUNT(*) FROM customers WHERE id = @Id AND is_deleted = false";
            var count = await connection.ExecuteScalarAsync<int>(sql, new { Id = id });
            return count > 0;
        }

        public async Task<bool> ExistsByCodeAsync(string customerCode)
        {
            using var connection = _context.GetConnection();
            
            var sql = "SELECT COUNT(*) FROM customers WHERE customer_code = @CustomerCode AND is_deleted = false";
            var count = await connection.ExecuteScalarAsync<int>(sql, new { CustomerCode = customerCode });
            return count > 0;
        }
    }
} 