using Dapper;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Repository.DbContext;
using Xcianify.Core.DTOs;

namespace Xcianify.Repository
{
    public class ItemTypeRepository : IItemTypeRepository
    {
        private readonly DapperDbContext _dbContext;
        private bool _disposed = false;

        public ItemTypeRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ItemTypeDto> GetByIdAsync(int id)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = @"
                    SELECT it.id, it.code, it.name, it.description, it.parent_type_id AS ParentTypeId,
                           it.is_active AS IsActive, it.created_at AS CreatedAt, it.updated_at AS UpdatedAt,
                           it.created_by AS CreatedBy, it.updated_by AS UpdatedBy,
                           parent.name AS ParentTypeName
                    FROM item_type it
                    LEFT JOIN item_type parent ON it.parent_type_id = parent.id
                    WHERE it.id = @Id";

                return await connection.QueryFirstOrDefaultAsync<ItemTypeDto>(sql, new { Id = id });
            }
        }

        public async Task<PaginatedResult<ItemTypeDto>> GetAllAsync(ItemTypeFilterDto filter)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var whereClause = "WHERE 1=1";
                var parameters = new DynamicParameters();

                if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
                {
                    whereClause += " AND (it.code ILIKE @SearchTerm OR it.name ILIKE @SearchTerm)";
                    parameters.Add("@SearchTerm", $"%{filter.SearchTerm}%");
                }

                if (filter.IsActive.HasValue)
                {
                    whereClause += " AND it.is_active = @IsActive";
                    parameters.Add("@IsActive", filter.IsActive.Value);
                }

                var countSql = $"SELECT COUNT(*) FROM item_type it {whereClause}";
                var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

                var sql = @$"
                    SELECT it.id, it.code, it.name, it.description, it.parent_type_id AS ParentTypeId,
                           it.is_active AS IsActive, it.created_at AS CreatedAt, it.updated_at AS UpdatedAt,
                           it.created_by AS CreatedBy, it.updated_by AS UpdatedBy,
                           parent.name AS ParentTypeName
                    FROM item_type it
                    LEFT JOIN item_type parent ON it.parent_type_id = parent.id
                    {whereClause}
                    ORDER BY it.name
                    LIMIT @PageSize OFFSET @Offset";

                parameters.Add("@PageSize", filter.PageSize);
                parameters.Add("@Offset", (filter.PageNumber - 1) * filter.PageSize);

                var items = await connection.QueryAsync<ItemTypeDto>(sql, parameters);

                return new PaginatedResult<ItemTypeDto>
                {
                    Items = items.ToList(),
                    TotalCount = totalCount,
                    PageNumber = filter.PageNumber,
                    PageSize = filter.PageSize
                };
            }
        }

        public async Task<ItemTypeDto> CreateAsync(CreateItemTypeDto dto, int userId)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = @"
                    INSERT INTO item_type (code, name, description, parent_type_id, is_active, created_by, updated_by)
                    VALUES (@Code, @Name, @Description, @ParentTypeId, @IsActive, @CreatedBy, @UpdatedBy)
                    RETURNING id, code, name, description, parent_type_id AS ParentTypeId, is_active AS IsActive,
                              created_at AS CreatedAt, updated_at AS UpdatedAt, created_by AS CreatedBy, updated_by AS UpdatedBy";

                var parameters = new
                {
                    dto.Code,
                    dto.Name,
                    dto.Description,
                    dto.ParentTypeId,
                    dto.IsActive,
                    CreatedBy = userId,
                    UpdatedBy = userId
                };

                var result = await connection.QueryFirstOrDefaultAsync<ItemTypeDto>(sql, parameters);
                
                // Get parent type name if exists
                if (result != null && result.ParentTypeId.HasValue)
                {
                    var parentSql = "SELECT name FROM item_type WHERE id = @ParentTypeId";
                    result.ParentTypeName = await connection.QueryFirstOrDefaultAsync<string>(parentSql, new { ParentTypeId = result.ParentTypeId });
                }

                return result;
            }
        }

        public async Task<ItemTypeDto> UpdateAsync(int id, UpdateItemTypeDto dto, int userId)
        {
            using (var connection = _dbContext.GetConnection())
            {
                // Get existing item to preserve values not being updated
                var existing = await GetByIdAsync(id);
                if (existing == null)
                    return null;

                var sql = @"
                    UPDATE item_type 
                    SET code = @Code, 
                        name = @Name, 
                        description = @Description,
                        parent_type_id = @ParentTypeId,
                        is_active = @IsActive,
                        updated_by = @UpdatedBy,
                        updated_at = @UpdatedAt
                    WHERE id = @Id
                    RETURNING id, code, name, description, parent_type_id AS ParentTypeId, is_active AS IsActive,
                              created_at AS CreatedAt, updated_at AS UpdatedAt, created_by AS CreatedBy, updated_by AS UpdatedBy";

                var parameters = new
                {
                    Id = id,
                    Code = dto.Code ?? existing.Code,
                    Name = dto.Name ?? existing.Name,
                    Description = dto.Description ?? existing.Description,
                    ParentTypeId = dto.ParentTypeId ?? existing.ParentTypeId,
                    IsActive = dto.IsActive ?? existing.IsActive,
                    UpdatedBy = userId,
                    UpdatedAt = DateTime.UtcNow
                };

                var result = await connection.QueryFirstOrDefaultAsync<ItemTypeDto>(sql, parameters);
                
                // Get parent type name if exists
                if (result != null && result.ParentTypeId.HasValue)
                {
                    var parentSql = "SELECT name FROM item_type WHERE id = @ParentTypeId";
                    result.ParentTypeName = await connection.QueryFirstOrDefaultAsync<string>(parentSql, new { ParentTypeId = result.ParentTypeId });
                }

                return result;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using (var connection = _dbContext.GetConnection())
            {
                // Check if any items reference this type
                var checkSql = "SELECT COUNT(1) FROM item_type WHERE parent_type_id = @Id";
                var childCount = await connection.ExecuteScalarAsync<int>(checkSql, new { Id = id });
                
                if (childCount > 0)
                {
                    throw new InvalidOperationException("Cannot delete item type that has child types. Please reassign or delete the child types first.");
                }

                var sql = "DELETE FROM item_type WHERE id = @Id";
                var affectedRows = await connection.ExecuteAsync(sql, new { Id = id });
                return affectedRows > 0;
            }
        }

        public async Task<bool> ExistsAsync(string code, int? excludeId = null)
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = "SELECT COUNT(1) FROM item_type WHERE code = @Code";
                var parameters = new { Code = code };

                if (excludeId.HasValue)
                {
                    sql += " AND id != @ExcludeId";
                   // parameters = new { Code = code, ExcludeId = excludeId.Value };
                }

                var count = await connection.ExecuteScalarAsync<int>(sql, parameters);
                return count > 0;
            }
        }

        public async Task<IEnumerable<ItemTypeDto>> GetParentTypesAsync()
        {
            using (var connection = _dbContext.GetConnection())
            {
                var sql = @"
                    SELECT id, code, name, description, parent_type_id AS ParentTypeId, is_active AS IsActive
                    FROM item_type 
                    WHERE is_active = true
                    ORDER BY name";

                return await connection.QueryAsync<ItemTypeDto>(sql);
            }
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _dbContext?.Dispose();
                }
                _disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
