using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ItemMediaRepository : IItemMediaRepository
    {
        private const string TableName = "item_media";
        private readonly DapperDbContext _dbContext;

        public ItemMediaRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<ItemMedia> GetByIdAsync(int id)
        {
            const string query = @"
                SELECT 
                    id as Id,
                    item_id as ItemId,
                    media_type as MediaType,
                    file_name as FileName,
                    file_extension as FileExtension,
                    file_size_bytes as FileSizeBytes,
                    mime_type as MimeType,
                    media_url as MediaUrl,
                    description as Description
                FROM item_media 
                WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ItemMedia>(query, new { Id = id });
        }

        public async Task<IEnumerable<ItemMedia>> GetByItemIdAsync(int itemId)
        {
            const string query = @"
                SELECT 
                    id as Id,
                    item_id as ItemId,
                    media_type as MediaType,
                    file_name as FileName,
                    file_extension as FileExtension,
                    file_size_bytes as FileSizeBytes,
                    mime_type as MimeType,
                    media_url as MediaUrl,
                    description as Description
                FROM item_media 
                WHERE item_id = @ItemId";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<ItemMedia>(query, new { ItemId = itemId });
        }

        public async Task<int> CreateAsync(ItemMedia entity)
        {
            const string query = @"
                INSERT INTO item_media (
                    item_id, media_type, file_name, file_extension, file_size_bytes, 
                    mime_type, media_url, description,
                    created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @ItemId, @MediaType, @FileName, @FileExtension, @FileSizeBytes, 
                    @MimeType, @MediaUrl, @Description,
                    @CreatedAt, @UpdatedAt, @CreatedBy, @UpdatedBy
                ) RETURNING id;";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<int>(query, entity);
        }

        public async Task<bool> UpdateAsync(ItemMedia entity)
        {
            const string query = @"
                UPDATE item_media SET
                    item_id = @ItemId,
                    media_type = @MediaType,
                    file_name = @FileName,
                    file_extension = @FileExtension,
                    file_size_bytes = @FileSizeBytes,
                    mime_type = @MimeType,
                    media_url = @MediaUrl,
                    description = @Description,
                    updated_at = @UpdatedAt,
                    updated_by = @UpdatedBy
                WHERE id = @Id;";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteAsync(query, entity) > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string query = @"UPDATE item_media SET is_deleted = true, updated_at = @UpdatedAt WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteAsync(query, new { Id = id, UpdatedAt = DateTime.UtcNow }) > 0;
        }
    }
}
