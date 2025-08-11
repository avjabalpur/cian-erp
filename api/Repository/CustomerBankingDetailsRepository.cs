using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerBankingDetails;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class CustomerBankingDetailsRepository : ICustomerBankingDetailsRepository
    {
        private readonly DapperDbContext _context;

        public CustomerBankingDetailsRepository(DapperDbContext context)
        {
            _context = context;
        }

        public async Task<List<CustomerBankingDetails>> GetByCustomerIdAsync(int customerId)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                SELECT 
                    id, customer_id, bank_ifsc_code, bank_account_number, bank_name,
                    customer_banker, customer_vpa, bank_account_type_code, bank_branch,
                    bank_location, is_primary, created_at, updated_at
                FROM customer_banking_details 
                WHERE customer_id = @CustomerId
                ORDER BY is_primary DESC, created_at DESC";

            var bankingDetails = await connection.QueryAsync<CustomerBankingDetails>(sql, new { CustomerId = customerId });
            return bankingDetails.ToList();
        }

        public async Task<CustomerBankingDetails?> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                SELECT 
                    id, customer_id, bank_ifsc_code, bank_account_number, bank_name,
                    customer_banker, customer_vpa, bank_account_type_code, bank_branch,
                    bank_location, is_primary, created_at, updated_at
                FROM customer_banking_details 
                WHERE id = @Id";

            return await connection.QueryFirstOrDefaultAsync<CustomerBankingDetails>(sql, new { Id = id });
        }

        public async Task<CustomerBankingDetails> CreateAsync(CustomerBankingDetails customerBankingDetails)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                INSERT INTO customer_banking_details (
                    customer_id, bank_ifsc_code, bank_account_number, bank_name,
                    customer_banker, customer_vpa, bank_account_type_code, bank_branch,
                    bank_location, is_primary, created_at
                ) VALUES (
                    @CustomerId, @BankIfscCode, @BankAccountNumber, @BankName,
                    @CustomerBanker, @CustomerVpa, @BankAccountTypeCode, @BankBranch,
                    @BankLocation, @IsPrimary, @CreatedAt
                )
                RETURNING 
                    id, customer_id, bank_ifsc_code, bank_account_number, bank_name,
                    customer_banker, customer_vpa, bank_account_type_code, bank_branch,
                    bank_location, is_primary, created_at, updated_at";

            return await connection.QueryFirstAsync<CustomerBankingDetails>(sql, customerBankingDetails);
        }

        public async Task<CustomerBankingDetails> UpdateAsync(CustomerBankingDetails customerBankingDetails)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                UPDATE customer_banking_details SET
                    bank_ifsc_code = @BankIfscCode,
                    bank_account_number = @BankAccountNumber,
                    bank_name = @BankName,
                    customer_banker = @CustomerBanker,
                    customer_vpa = @CustomerVpa,
                    bank_account_type_code = @BankAccountTypeCode,
                    bank_branch = @BankBranch,
                    bank_location = @BankLocation,
                    is_primary = @IsPrimary,
                    updated_at = @UpdatedAt
                WHERE id = @Id
                RETURNING 
                    id, customer_id, bank_ifsc_code, bank_account_number, bank_name,
                    customer_banker, customer_vpa, bank_account_type_code, bank_branch,
                    bank_location, is_primary, created_at, updated_at";

            return await connection.QueryFirstAsync<CustomerBankingDetails>(sql, customerBankingDetails);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = "DELETE FROM customer_banking_details WHERE id = @Id";
            var rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = "SELECT COUNT(*) FROM customer_banking_details WHERE id = @Id";
            var count = await connection.ExecuteScalarAsync<int>(sql, new { Id = id });
            return count > 0;
        }
    }
} 