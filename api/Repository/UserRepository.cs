using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "users";

        public UserRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<(List<User> Items, int TotalCount)> GetAllAsync()
        {
            var query = $@"
                SELECT 
                    id as id,
                    username as username,
                    email as email,
                    password_hash as passwordHash,
                    first_name as firstName,
                    last_name as lastName,
                    employee_id as employeeId,
                    phone as phone,
                    dob as dob,
                    gender as gender,
                    department as department,
                    designation as designation,
                    reporting_manager as reportingManagerId,
                    is_active as isActive,
                    is_email_verified as isEmailVerified,
                    is_phone_verified as isPhoneVerified,
                    last_login as lastLogin,
                    password_changed_at as passwordChangedAt,
                    failed_login_attempts as failedLoginAttempts,
                    locked_until as lockedUntil,
                    created_at as createdAt,
                    updated_at as updatedAt,
                    created_by as createdBy,
                    updated_by as updatedBy
                FROM {TableName}
                ORDER BY created_at DESC;
                
                SELECT COUNT(*) FROM {TableName};";

            using var connection = _dbContext.GetConnection();
            using var multi = await connection.QueryMultipleAsync(query);
            var items = (await multi.ReadAsync<User>()).AsList();
            var totalCount = await multi.ReadFirstAsync<int>();

            return (items, totalCount);
        }

        public async Task<User> GetByIdAsync(int id)
        {
            var query = $@"
                SELECT 
                    id as id,
                    username as username,
                    email as email,
                    password_hash as passwordHash,
                    first_name as firstName,
                    last_name as lastName,
                    employee_id as employeeId,
                    phone as phone,
                    dob as dob,
                    gender as gender,
                    department as department,
                    designation as designation,
                    reporting_manager as reportingManagerId,
                    is_active as isActive,
                    is_email_verified as isEmailVerified,
                    is_phone_verified as isPhoneVerified,
                    last_login as lastLogin,
                    password_changed_at as passwordChangedAt,
                    failed_login_attempts as failedLoginAttempts,
                    locked_until as lockedUntil,
                    created_at as createdAt,
                    updated_at as updatedAt,
                    created_by as createdBy,
                    updated_by as updatedBy
                FROM {TableName}
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(query, new { Id = id });
        }

        public async Task<User> GetByUsernameAsync(string username)
        {
            var query = $@"
                SELECT * FROM {TableName}
                WHERE username = @Username";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(query, new { Username = username });
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            var query = $@"
                SELECT * FROM {TableName}
                WHERE email = @Email";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(query, new { Email = email });
        }

        public async Task<User> AddAsync(User user)
        {
            var query = $@"
                INSERT INTO {TableName} (
                    username, email, password_hash, first_name, last_name,
                    employee_id, phone, dob, gender, department, designation, reporting_manager,
                    is_active, is_email_verified, is_phone_verified, created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @username, @email, @passwordHash, @firstName, @lastName,
                    @employeeId, @phone, @dob, @gender, @department, @designation, @reportingManagerId,
                    @isActive, @isEmailVerified, @isPhoneVerified, @createdAt, @updatedAt, @createdBy, @updatedBy
                )
                RETURNING *";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<User>(query, user);
        }

        public async Task UpdateAsync(User user)
        {
            var query = $@"
                UPDATE {TableName} 
                SET username = @username,
                    email = @email,
                    first_name = @firstName,
                    last_name = @lastName,
                    employee_id = @employeeId,
                    phone = @phone,
                    dob = @dob,
                    gender = @gender,
                    department = @department,
                    designation = @designation,
                    reporting_manager = @reportingManagerId,
                    is_active = @isActive,
                    is_email_verified = @isEmailVerified,
                    is_phone_verified = @isPhoneVerified,
                    updated_at = @updatedAt,
                    updated_by = @updatedBy
                WHERE id = @id";

            user.UpdatedAt = DateTime.UtcNow;

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, user);
        }

        public async Task DeleteAsync(int id)
        {
            var query = $"DELETE FROM {TableName} WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task UpdateLoginInfoAsync(User user)
        {
            var query = $@"
                UPDATE {TableName} 
                SET last_login = @lastLogin,
                    failed_login_attempts = @failedLoginAttempts,
                    locked_until = @lockedUntil,
                    updated_at = @updatedAt
                WHERE id = @id";

            user.UpdatedAt = DateTime.UtcNow;

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, user);
        }

        public async Task UpdatePasswordAsync(int userId, string passwordHash)
        {
            var query = $@"
                UPDATE {TableName} 
                SET password_hash = @passwordHash,
                    password_changed_at = @passwordChangedAt,
                    updated_at = @updatedAt
                WHERE id = @userId";

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new 
            { 
                userId = userId,
                passwordHash = passwordHash,
                passwordChangedAt = DateTime.UtcNow,
                updatedAt = DateTime.UtcNow
            });
        }
    }
}
