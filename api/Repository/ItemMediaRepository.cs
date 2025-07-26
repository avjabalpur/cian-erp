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
            const string query = @"SELECT * FROM item_media WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ItemMedia>(query, new { Id = id });
        }

        public async Task<IEnumerable<ItemMedia>> GetByItemIdAsync(int itemId)
        {
            const string query = @"SELECT * FROM item_media WHERE item_id = @ItemId";
            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<ItemMedia>(query, new { ItemId = itemId });
        }

        public async Task<int> CreateAsync(ItemMedia entity)
        {
            const string query = @"INSERT INTO item_media (
                item_code, media_type, file_name, file_extension, file_size_bytes, mime_type, media_url, description, uploaded_by, uploaded_at
            ) VALUES (
                @ItemCode, @MediaType, @FileName, @FileExtension, @FileSizeBytes, @MimeType, @MediaUrl, @Description, @UploadedBy, @UploadedAt
            ) RETURNING id;";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<int>(query, entity);
        }

        public async Task<bool> UpdateAsync(ItemMedia entity)
        {
            const string query = @"UPDATE item_media SET
                item_code = @ItemCode,
                media_type = @MediaType,
                file_name = @FileName,
                file_extension = @FileExtension,
                file_size_bytes = @FileSizeBytes,
                mime_type = @MimeType,
                media_url = @MediaUrl,
                description = @Description,
                uploaded_by = @UploadedBy,
                uploaded_at = @UploadedAt
            WHERE id = @Id;";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteAsync(query, entity) > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string query = @"DELETE FROM item_media WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteAsync(query, new { Id = id }) > 0;
        }


    }
}
