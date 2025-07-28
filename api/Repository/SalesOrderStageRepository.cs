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
    public class SalesOrderStageRepository : ISalesOrderStageRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "sales_order_stages";

        public SalesOrderStageRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<IEnumerable<SalesOrderStage>> GetAllAsync()
        {
            var query = $@"
                SELECT 
                    s.id as id,
                    s.sales_order_id as salesOrderId,
                    s.stage_name as stageName,
                    s.is_approved as isApproved,
                    s.created_at as createdAt,
                    s.updated_at as updatedAt,
                    s.created_by as createdBy,
                    s.updated_by as updatedBy,
                    s.is_deleted as isDeleted,
                    creator.first_name || ' ' || creator.last_name as createdByName,
                    updater.first_name || ' ' || updater.last_name as updatedByName
                FROM {TableName} s
                LEFT JOIN users creator ON s.created_by = creator.id
                LEFT JOIN users updater ON s.updated_by = updater.id
                WHERE s.is_deleted = 0
                ORDER BY s.created_at DESC";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<SalesOrderStage>(query);
        }

        public async Task<SalesOrderStage> GetByIdAsync(int id)
        {
            var query = $@"
                SELECT 
                    s.id as id,
                    s.sales_order_id as salesOrderId,
                    s.stage_name as stageName,
                    s.is_approved as isApproved,
                    s.created_at as createdAt,
                    s.updated_at as updatedAt,
                    s.created_by as createdBy,
                    s.updated_by as updatedBy,
                    s.is_deleted as isDeleted,
                    creator.first_name || ' ' || creator.last_name as createdByName,
                    updater.first_name || ' ' || updater.last_name as updatedByName
                FROM {TableName} s
                LEFT JOIN users creator ON s.created_by = creator.id
                LEFT JOIN users updater ON s.updated_by = updater.id
                WHERE s.id = @Id AND s.is_deleted = 0";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<SalesOrderStage>(query, new { Id = id });
        }

        public async Task<SalesOrderStage> AddAsync(SalesOrderStage stage)
        {
            var query = $@"
                INSERT INTO {TableName} (
                    sales_order_id, stage_name, is_approved, created_at, updated_at, created_by, updated_by, is_deleted
                ) VALUES (
                    @salesOrderId, @stageName, @isApproved, @createdAt, @updatedAt, @createdBy, @updatedBy, @isDeleted
                )
                RETURNING 
                    id as id,
                    sales_order_id as salesOrderId,
                    stage_name as stageName,
                    is_approved as isApproved,
                    created_at as createdAt,
                    updated_at as updatedAt,
                    created_by as createdBy,
                    updated_by as updatedBy,
                    is_deleted as isDeleted";

            stage.CreatedAt = DateTime.UtcNow;
            stage.UpdatedAt = DateTime.UtcNow;
            stage.IsDeleted = false;

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<SalesOrderStage>(query, stage);
        }

        public async Task<SalesOrderStage> UpdateAsync(SalesOrderStage stage)
        {
            var query = $@"
                UPDATE {TableName} 
                SET stage_name = @stageName,
                    is_approved = @isApproved,
                    updated_at = @updatedAt,
                    updated_by = @updatedBy
                WHERE id = @id AND is_deleted = 0
                RETURNING 
                    id as id,
                    sales_order_id as salesOrderId,
                    stage_name as stageName,
                    is_approved as isApproved,
                    created_at as createdAt,
                    updated_at as updatedAt,
                    created_by as createdBy,
                    updated_by as updatedBy,
                    is_deleted as isDeleted";

            stage.UpdatedAt = DateTime.UtcNow;

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<SalesOrderStage>(query, stage);
        }

        public async Task DeleteAsync(int id)
        {
            var query = $@"
                UPDATE {TableName} 
                SET is_deleted = 1, updated_at = @updatedAt
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { Id = id, updatedAt = DateTime.UtcNow });
        }

        public async Task<bool> ExistsAsync(int id)
        {
            var query = $"SELECT COUNT(*) FROM {TableName} WHERE id = @Id AND is_deleted = 0";
            using var connection = _dbContext.GetConnection();
            var count = await connection.ExecuteScalarAsync<int>(query, new { Id = id });
            return count > 0;
        }

        public async Task<IEnumerable<SalesOrderStage>> GetBySalesOrderIdAsync(int salesOrderId)
        {
            var query = $@"
                SELECT 
                    s.id as id,
                    s.sales_order_id as salesOrderId,
                    s.stage_name as stageName,
                    s.is_approved as isApproved,
                    s.created_at as createdAt,
                    s.updated_at as updatedAt,
                    s.created_by as createdBy,
                    s.updated_by as updatedBy,
                    s.is_deleted as isDeleted,
                    creator.first_name || ' ' || creator.last_name as createdByName,
                    updater.first_name || ' ' || updater.last_name as updatedByName
                FROM {TableName} s
                LEFT JOIN users creator ON s.created_by = creator.id
                LEFT JOIN users updater ON s.updated_by = updater.id
                WHERE s.sales_order_id = @SalesOrderId AND s.is_deleted = 0
                ORDER BY s.created_at ASC";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<SalesOrderStage>(query, new { SalesOrderId = salesOrderId });
        }

        public async Task<SalesOrderStage> GetBySalesOrderIdAndStageNameAsync(int salesOrderId, string stageName)
        {
            var query = $@"
                SELECT 
                    s.id as id,
                    s.sales_order_id as salesOrderId,
                    s.stage_name as stageName,
                    s.is_approved as isApproved,
                    s.created_at as createdAt,
                    s.updated_at as updatedAt,
                    s.created_by as createdBy,
                    s.updated_by as updatedBy,
                    s.is_deleted as isDeleted,
                    creator.first_name || ' ' || creator.last_name as createdByName,
                    updater.first_name || ' ' || updater.last_name as updatedByName
                FROM {TableName} s
                LEFT JOIN users creator ON s.created_by = creator.id
                LEFT JOIN users updater ON s.updated_by = updater.id
                WHERE s.sales_order_id = @SalesOrderId AND s.stage_name = @StageName AND s.is_deleted = 0";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<SalesOrderStage>(query, new { SalesOrderId = salesOrderId, StageName = stageName });
        }
    }
} 