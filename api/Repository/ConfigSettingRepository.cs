using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.ConfigSetting;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ConfigSettingRepository : IConfigSettingRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "config_settings";

        public ConfigSettingRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<(List<ConfigSetting> Items, int TotalCount)> GetAllAsync(ConfigSettingFilterDto filterDto)
        {
            var whereConditions = new List<string>();
            var parameters = new DynamicParameters();

            // Add search filter
            if (!string.IsNullOrWhiteSpace(filterDto.SearchTerm))
            {
                whereConditions.Add("(LOWER(setting_key) LIKE @Search OR LOWER(setting_name) LIKE @Search OR LOWER(description) LIKE @Search OR CAST(id AS TEXT) LIKE @Search)");
                parameters.Add("@Search", $"%{filterDto.SearchTerm.ToLower()}%");
            }

            // Add isActive filter
            if (filterDto.IsActive.HasValue)
            {
                whereConditions.Add("is_active = @IsActive");
                parameters.Add("@IsActive", filterDto.IsActive.Value);
            }

            var whereClause = whereConditions.Count > 0 ? $"WHERE {string.Join(" AND ", whereConditions)}" : "";

            // Calculate offset for pagination
            var offset = (filterDto.PageNumber - 1) * filterDto.PageSize;

            var query = $@"
                SELECT 
                    id as Id,
                    setting_key as SettingKey,
                    setting_name as SettingName,
                    description as Description,
                    string_value as StringValue,
                    integer_value as IntegerValue,
                    boolean_value as BooleanValue,
                    decimal_value as DecimalValue,
                    default_value as DefaultValue,
                    is_active as IsActive,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy
                FROM {TableName}
                {whereClause}
                ORDER BY created_at DESC
                LIMIT @PageSize OFFSET @Offset;
                
                SELECT COUNT(*) FROM {TableName} {whereClause};";

            parameters.Add("@PageSize", filterDto.PageSize);
            parameters.Add("@Offset", offset);

            using var connection = _dbContext.GetConnection();
            using var multi = await connection.QueryMultipleAsync(query, parameters);
            var items = (await multi.ReadAsync<ConfigSetting>()).AsList();
            var totalCount = await multi.ReadFirstAsync<int>();

            return (items, totalCount);
        }

        public async Task<ConfigSetting> GetByIdAsync(int id)
        {
            var query = $@"
                SELECT 
                    id as Id,
                    setting_key as SettingKey,
                    setting_name as SettingName,
                    description as Description,
                    string_value as StringValue,
                    integer_value as IntegerValue,
                    boolean_value as BooleanValue,
                    decimal_value as DecimalValue,
                    default_value as DefaultValue,
                    is_active as IsActive,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy
                FROM {TableName}
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ConfigSetting>(query, new { Id = id });
        }

        public async Task<ConfigSetting> GetByKeyAsync(string settingKey)
        {
            var query = $@"
                SELECT 
                    id as Id,
                    setting_key as SettingKey,
                    setting_name as SettingName,
                    description as Description,
                    string_value as StringValue,
                    integer_value as IntegerValue,
                    boolean_value as BooleanValue,
                    decimal_value as DecimalValue,
                    default_value as DefaultValue,
                    is_active as IsActive,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy
                FROM {TableName}
                WHERE setting_key = @SettingKey";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ConfigSetting>(query, new { SettingKey = settingKey });
        }

        public async Task<ConfigSetting> CreateAsync(ConfigSetting configSetting)
        {
            var query = $@"
                INSERT INTO {TableName} (
                    setting_key, setting_name, description, string_value, integer_value,
                    boolean_value, decimal_value, default_value, is_active, created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @SettingKey, @SettingName, @Description, @StringValue, @IntegerValue,
                    @BooleanValue, @DecimalValue, @DefaultValue, @IsActive, @CreatedAt, @UpdatedAt, @CreatedBy, @UpdatedBy
                )
                RETURNING *";

            configSetting.CreatedAt = DateTime.UtcNow;
            configSetting.UpdatedAt = DateTime.UtcNow;

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<ConfigSetting>(query, configSetting);
        }

        public async Task UpdateAsync(ConfigSetting configSetting)
        {
            var query = $@"
                UPDATE {TableName}
                SET 
                    setting_key = @SettingKey,
                    setting_name = @SettingName,
                    description = @Description,
                    string_value = @StringValue,
                    integer_value = @IntegerValue,
                    boolean_value = @BooleanValue,
                    decimal_value = @DecimalValue,
                    default_value = @DefaultValue,
                    is_active = @IsActive,
                    updated_at = @UpdatedAt,
                    updated_by = @UpdatedBy
                WHERE id = @Id";

            configSetting.UpdatedAt = DateTime.UtcNow;

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, configSetting);
        }

        public async Task DeleteAsync(int id)
        {
            var query = $"DELETE FROM {TableName} WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(string settingKey, int? excludeId = null)
        {
            var query = $"SELECT COUNT(1) FROM {TableName} WHERE setting_key = @SettingKey";
            if (excludeId.HasValue)
            {
                query += " AND id != @ExcludeId";
            }

            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<bool>(query, new { SettingKey = settingKey, ExcludeId = excludeId });
        }
    }
} 