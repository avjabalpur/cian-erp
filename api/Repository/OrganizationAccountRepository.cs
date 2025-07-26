using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class OrganizationAccountRepository : IOrganizationAccountRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "organization_accounts";
        private const string OrganizationTable = "organizations";

        public OrganizationAccountRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<OrganizationAccount> GetByIdAsync(int id)
        {
            var query = $@"
                SELECT oa.*, o.* 
                FROM {TableName} oa
                LEFT JOIN {OrganizationTable} o ON oa.organization_id = o.id
                WHERE oa.id = @Id";

            using var connection = _dbContext.GetConnection();
            var result = await connection.QueryAsync<OrganizationAccount, Organization, OrganizationAccount>(
                query,
                (account, org) =>
                {
                   // account.Organization = org;
                    return account;
                },
                new { Id = id },
                splitOn: "id,id"
            );

            return result.AsList().Count > 0 ? result.AsList()[0] : null;
        }

        public async Task<IEnumerable<OrganizationAccount>> GetByOrganizationIdAsync(int organizationId)
        {
            var query = $@"
                SELECT oa.*, o.* 
                FROM {TableName} oa
                LEFT JOIN {OrganizationTable} o ON oa.organization_id = o.id
                WHERE oa.organization_id = @OrganizationId
                ORDER BY oa.is_active DESC, oa.created_at DESC";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<OrganizationAccount, Organization, OrganizationAccount>(
                query,
                (account, org) =>
                {
                   // account.Organization = org;
                    return account;
                },
                new { OrganizationId = organizationId },
                splitOn: "id,id"
            );
        }

        public async Task<OrganizationAccount> CreateAsync(OrganizationAccount account)
        {
            var query = $@"
                INSERT INTO {TableName} (
                    organization_id, account_type, account_number, bank_name, 
                    ifsc_code, swift_code, account_holder_name, is_active, 
                    created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @OrganizationId, @AccountType, @AccountNumber, @BankName, 
                    @IfscCode, @SwiftCode, @AccountHolderName, @IsActive, 
                    @CreatedAt, @UpdatedAt, @CreatedBy, @UpdatedBy
                )
                RETURNING *";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<OrganizationAccount>(query, account);
        }

        public async Task UpdateAsync(OrganizationAccount account)
        {
            var query = $@"
                UPDATE {TableName}
                SET 
                    account_type = @AccountType,
                    account_number = @AccountNumber,
                    bank_name = @BankName,
                    ifsc_code = @IfscCode,
                    swift_code = @SwiftCode,
                    account_holder_name = @AccountHolderName,
                    is_active = @IsActive,
                    updated_at = @UpdatedAt,
                    updated_by = @UpdatedBy
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, account);
        }

        public async Task DeleteAsync(int id)
        {
            var query = $"DELETE FROM {TableName} WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(int organizationId, string accountNumber, int? excludeId = null)
        {
            var query = $"SELECT COUNT(1) FROM {TableName} WHERE organization_id = @OrganizationId AND account_number = @AccountNumber";
            if (excludeId.HasValue)
            {
                query += " AND id != @ExcludeId";
            }

            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<bool>(query, new 
            { 
                OrganizationId = organizationId, 
                AccountNumber = accountNumber,
                ExcludeId = excludeId
            });
        }
    }
}
