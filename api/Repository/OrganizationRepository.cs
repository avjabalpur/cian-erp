using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.DTOs.Organization;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class OrganizationRepository : IOrganizationRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "organizations";
        private const string LocationTypeTable = "location_type";

        public OrganizationRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<Organization> GetByIdAsync(int id)
        {
            var query = $@"
                SELECT o.*, lt.* 
                FROM {TableName} o
                LEFT JOIN {LocationTypeTable} lt ON o.location_type_id = lt.id
                WHERE o.id = @Id";

            using var connection = _dbContext.GetConnection();
            var result = await connection.QueryAsync<Organization, LocationType, Organization>(
                query,
                (org, locationType) =>
                {
                    //org.LocationType = locationType;
                    return org;
                },
                new { Id = id },
                splitOn: "id,id"
            );

            return result.AsList().Count > 0 ? result.AsList()[0] : null;
        }

        public async Task<Organization> GetByCodeAsync(string code)
        {
            var query = $@"
                SELECT o.*, lt.* 
                FROM {TableName} o
                LEFT JOIN {LocationTypeTable} lt ON o.location_type_id = lt.id
                WHERE o.code = @Code";

            using var connection = _dbContext.GetConnection();
            var result = await connection.QueryAsync<Organization, LocationType, Organization>(
                query,
                (org, locationType) =>
                {
                   // org.LocationType = locationType;
                    return org;
                },
                new { Code = code },
                splitOn: "id,id"
            );

            return result.AsList().Count > 0 ? result.AsList()[0] : null;
        }

        public async Task<IEnumerable<Organization>> GetAllAsync(OrganizationFilterDto filter)
        {
            var whereClause = BuildWhereClause(filter);
            //var orderBy = string.IsNullOrEmpty(filter.SortBy) 
            //    ? "o.created_at DESC" 
            //    : $"o.{filter.SortBy} {(filter.SortDescending ? "DESC" : "ASC")}";

            var query = $@"
                SELECT o.*, lt.* 
                FROM {TableName} o
                LEFT JOIN {LocationTypeTable} lt ON o.location_type_id = lt.id
                {whereClause}
                ORDER BY created_at
                LIMIT @PageSize OFFSET @Offset";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryAsync<Organization, LocationType, Organization>(
                query,
                (org, locationType) =>
                {
                   // org.LocationType = locationType;
                    return org;
                },
                new 
                { 
                    SearchTerm = $"%{filter.SearchTerm}%",
                    IsActive = filter.IsActive,
                    LocationTypeId = filter.LocationTypeId,
                    PageSize = filter.PageSize,
                    Offset = (filter.PageNumber - 1) * filter.PageSize
                },
                splitOn: "id,id"
            );
        }

        public async Task<int> GetCountAsync(OrganizationFilterDto filter)
        {
            var whereClause = BuildWhereClause(filter);
            var query = $@"
                SELECT COUNT(1)
                FROM {TableName} o
                {whereClause}";

            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<int>(query, new 
            { 
                SearchTerm = $"%{filter.SearchTerm}%",
                IsActive = filter.IsActive,
                LocationTypeId = filter.LocationTypeId
            });
        }

        public async Task<Organization> CreateAsync(Organization organization)
        {
            var query = $@"
                INSERT INTO {TableName} (
                    code, location_type_id, name, contact_person, address1, address2, 
                    city, state, country, zip, phone, email, website, gstin_number, 
                    pan_number, is_active, created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @Code, @LocationTypeId, @Name, @ContactPerson, @Address1, @Address2,
                    @City, @State, @Country, @Zip, @Phone, @Email, @Website, @GstinNumber,
                    @PanNumber, @IsActive, @CreatedAt, @UpdatedAt, @CreatedBy, @UpdatedBy
                )
                RETURNING *";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<Organization>(query, organization);
        }

        public async Task UpdateAsync(Organization organization)
        {
            var query = $@"
                UPDATE {TableName}
                SET 
                    code = @Code,
                    location_type_id = @LocationTypeId,
                    name = @Name,
                    contact_person = @ContactPerson,
                    address1 = @Address1,
                    address2 = @Address2,
                    city = @City,
                    state = @State,
                    country = @Country,
                    zip = @Zip,
                    phone = @Phone,
                    email = @Email,
                    website = @Website,
                    gstin_number = @GstinNumber,
                    pan_number = @PanNumber,
                    is_active = @IsActive,
                    updated_at = @UpdatedAt,
                    updated_by = @UpdatedBy
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, organization);
        }

        public async Task DeleteAsync(int id)
        {
            var query = $"DELETE FROM {TableName} WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { Id = id });
        }

        public async Task<bool> ExistsAsync(string code, int? excludeId = null)
        {
            var query = $"SELECT COUNT(1) FROM {TableName} WHERE code = @Code";
            if (excludeId.HasValue)
            {
                query += " AND id != @ExcludeId";
            }

            using var connection = _dbContext.GetConnection();
            return await connection.ExecuteScalarAsync<bool>(query, new { Code = code, ExcludeId = excludeId });
        }

        private string BuildWhereClause(OrganizationFilterDto filter)
        {
            var conditions = new List<string>();
            
            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                conditions.Add("(o.name ILIKE @SearchTerm OR o.code ILIKE @SearchTerm OR o.contact_person ILIKE @SearchTerm OR o.email ILIKE @SearchTerm)");
            }
            
            if (filter.IsActive.HasValue)
            {
                conditions.Add("o.is_active = @IsActive");
            }
            
            if (filter.LocationTypeId.HasValue)
            {
                conditions.Add("o.location_type_id = @LocationTypeId");
            }

            return conditions.Count > 0 ? $"WHERE {string.Join(" AND ", conditions)}" : string.Empty;
        }
    }
}
