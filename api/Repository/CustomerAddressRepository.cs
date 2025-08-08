using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerAddress;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class CustomerAddressRepository : ICustomerAddressRepository
    {
        private readonly DapperDbContext _context;

        public CustomerAddressRepository(DapperDbContext context)
        {
            _context = context;
        }

        public async Task<List<CustomerAddress>> GetByCustomerIdAsync(int customerId)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                SELECT 
                    id, customer_id, address_line_1, address_line_2, address_line_3,
                    city, zip_code, country, state_code, gst_state_code,
                    contact_person, telephone_number, mobile_number, fax_number,
                    email_id, website, is_primary, created_at, updated_at
                FROM customer_addresses 
                WHERE customer_id = @CustomerId
                ORDER BY is_primary DESC, created_at DESC";

            var addresses = await connection.QueryAsync<CustomerAddress>(sql, new { CustomerId = customerId });
            return addresses.ToList();
        }

        public async Task<CustomerAddress?> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                SELECT 
                    id, customer_id, address_line_1, address_line_2, address_line_3,
                    city, zip_code, country, state_code, gst_state_code,
                    contact_person, telephone_number, mobile_number, fax_number,
                    email_id, website, is_primary, created_at, updated_at
                FROM customer_addresses 
                WHERE id = @Id";

            return await connection.QueryFirstOrDefaultAsync<CustomerAddress>(sql, new { Id = id });
        }

        public async Task<CustomerAddress> CreateAsync(CustomerAddress customerAddress)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                INSERT INTO customer_addresses (
                    customer_id, address_line_1, address_line_2, address_line_3,
                    city, zip_code, country, state_code, gst_state_code,
                    contact_person, telephone_number, mobile_number, fax_number,
                    email_id, website, is_primary, created_at
                ) VALUES (
                    @CustomerId, @AddressLine1, @AddressLine2, @AddressLine3,
                    @City, @ZipCode, @Country, @StateCode, @GstStateCode,
                    @ContactPerson, @TelephoneNumber, @MobileNumber, @FaxNumber,
                    @EmailId, @Website, @IsPrimary, @CreatedAt
                )
                RETURNING 
                    id, customer_id, address_line_1, address_line_2, address_line_3,
                    city, zip_code, country, state_code, gst_state_code,
                    contact_person, telephone_number, mobile_number, fax_number,
                    email_id, website, is_primary, created_at, updated_at";

            return await connection.QueryFirstAsync<CustomerAddress>(sql, customerAddress);
        }

        public async Task<CustomerAddress> UpdateAsync(CustomerAddress customerAddress)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                UPDATE customer_addresses SET
                    address_line_1 = @AddressLine1,
                    address_line_2 = @AddressLine2,
                    address_line_3 = @AddressLine3,
                    city = @City,
                    zip_code = @ZipCode,
                    country = @Country,
                    state_code = @StateCode,
                    gst_state_code = @GstStateCode,
                    contact_person = @ContactPerson,
                    telephone_number = @TelephoneNumber,
                    mobile_number = @MobileNumber,
                    fax_number = @FaxNumber,
                    email_id = @EmailId,
                    website = @Website,
                    is_primary = @IsPrimary,
                    updated_at = @UpdatedAt
                WHERE id = @Id
                RETURNING 
                    id, customer_id, address_line_1, address_line_2, address_line_3,
                    city, zip_code, country, state_code, gst_state_code,
                    contact_person, telephone_number, mobile_number, fax_number,
                    email_id, website, is_primary, created_at, updated_at";

            return await connection.QueryFirstAsync<CustomerAddress>(sql, customerAddress);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = "DELETE FROM customer_addresses WHERE id = @Id";
            var rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = "SELECT COUNT(*) FROM customer_addresses WHERE id = @Id";
            var count = await connection.ExecuteScalarAsync<int>(sql, new { Id = id });
            return count > 0;
        }
    }
} 