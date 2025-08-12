using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ExtensionDataRepository : IExtensionDataRepository
    {
        private const string TableName = "extension_data";
        private readonly DapperDbContext _dbContext;

        public ExtensionDataRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<ExtensionData> GetByIdAsync(int id)
        {
            const string query = @"
                SELECT 
                    id as Id,
                    entity_type as EntityType,
                    entity_type_id as EntityTypeId,
                    property_key as PropertyKey,
                    property_label as PropertyLabel,
                    property_description as PropertyDescription,
                    property_value as PropertyValue,
                    data_type as DataType,
                    display_order as DisplayOrder,
                    is_active as IsActive,
                    is_deleted as IsDeleted,
                    created_by as CreatedBy,
                    created_at as CreatedAt,
                    updated_by as UpdatedBy,
                    updated_at as UpdatedAt
                FROM extension_data 
                WHERE id = @Id AND is_deleted = false";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ExtensionData>(query, new { Id = id });
        }

        public async Task<IEnumerable<ExtensionData>> GetAllAsync()
        {
            const string query = @"
                SELECT 
                    id as Id,
                    entity_type as EntityType,
                    entity_type_id as EntityTypeId,
                    property_key as PropertyKey,
                    property_label as PropertyLabel,
                    property_description as PropertyDescription,
                    property_value as PropertyValue,
                    data_type as DataType,
                    display_order as DisplayOrder,
                    is_active as IsActive,
                    is_deleted as IsDeleted,
                    created_by as CreatedBy,
                    created_at as CreatedAt,
                    updated_by as UpdatedBy,
                    updated_at as UpdatedAt
                FROM extension_data 
                WHERE is_deleted = false
                ORDER BY entity_type, entity_type_id, display_order";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<ExtensionData>(query);
        }

        public async Task<IEnumerable<ExtensionData>> GetByEntityTypeAsync(string entityType)
        {
            const string query = @"
                SELECT 
                    id as Id,
                    entity_type as EntityType,
                    entity_type_id as EntityTypeId,
                    property_key as PropertyKey,
                    property_label as PropertyLabel,
                    property_description as PropertyDescription,
                    property_value as PropertyValue,
                    data_type as DataType,
                    display_order as DisplayOrder,
                    is_active as IsActive,
                    is_deleted as IsDeleted,
                    created_by as CreatedBy,
                    created_at as CreatedAt,
                    updated_by as UpdatedBy,
                    updated_at as UpdatedAt
                FROM extension_data 
                WHERE entity_type = @EntityType AND is_deleted = false
                ORDER BY entity_type_id, display_order";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<ExtensionData>(query, new { EntityType = entityType });
        }

        public async Task<IEnumerable<ExtensionData>> GetByEntityTypeAndIdAsync(string entityType, int entityTypeId)
        {
            const string query = @"
                SELECT 
                    id as Id,
                    entity_type as EntityType,
                    entity_type_id as EntityTypeId,
                    property_key as PropertyKey,
                    property_label as PropertyLabel,
                    property_description as PropertyDescription,
                    property_value as PropertyValue,
                    data_type as DataType,
                    display_order as DisplayOrder,
                    is_active as IsActive,
                    is_deleted as IsDeleted,
                    created_by as CreatedBy,
                    created_at as CreatedAt,
                    updated_by as UpdatedBy,
                    updated_at as UpdatedAt
                FROM extension_data 
                WHERE entity_type = @EntityType AND entity_type_id = @EntityTypeId AND is_deleted = false
                ORDER BY display_order";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<ExtensionData>(query, new { EntityType = entityType, EntityTypeId = entityTypeId });
        }

        public async Task<IEnumerable<ExtensionData>> GetActiveAsync()
        {
            const string query = @"
                SELECT 
                    id as Id,
                    entity_type as EntityType,
                    entity_type_id as EntityTypeId,
                    property_key as PropertyKey,
                    property_label as PropertyLabel,
                    property_description as PropertyDescription,
                    property_value as PropertyValue,
                    data_type as DataType,
                    display_order as DisplayOrder,
                    is_active as IsActive,
                    is_deleted as IsDeleted,
                    created_by as CreatedBy,
                    created_at as CreatedAt,
                    updated_by as UpdatedBy,
                    updated_at as UpdatedAt
                FROM extension_data 
                WHERE is_active = true AND is_deleted = false
                ORDER BY entity_type, entity_type_id, display_order";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<ExtensionData>(query);
        }

        public async Task<int> CreateAsync(ExtensionData entity)
        {
            const string query = @"
                INSERT INTO extension_data (
                    entity_type, entity_type_id, property_key, property_label, property_description,
                    property_value, data_type, display_order, is_active, is_deleted,
                    created_by, created_at, updated_by, updated_at
                ) VALUES (
                    @EntityType, @EntityTypeId, @PropertyKey, @PropertyLabel, @PropertyDescription,
                    @PropertyValue, @DataType, @DisplayOrder, @IsActive, @IsDeleted,
                    @CreatedBy, @CreatedAt, @UpdatedBy, @UpdatedAt
                ) RETURNING id;";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<int>(query, entity);
        }

        public async Task<bool> UpdateAsync(ExtensionData entity)
        {
            const string query = @"
                UPDATE extension_data SET
                    property_key = @PropertyKey,
                    property_label = @PropertyLabel,
                    property_description = @PropertyDescription,
                    property_value = @PropertyValue,
                    data_type = @DataType,
                    display_order = @DisplayOrder,
                    is_active = @IsActive,
                    updated_by = @UpdatedBy,
                    updated_at = @UpdatedAt
                WHERE id = @Id;";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteAsync(query, entity) > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string query = @"UPDATE extension_data SET is_deleted = true, updated_at = @UpdatedAt WHERE id = @Id AND is_deleted = false";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteAsync(query, new { Id = id, UpdatedAt = DateTime.UtcNow }) > 0;
        }
    }
}
