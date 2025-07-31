using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.Organization;
using Xcianify.Repository.DbContext;
using Core.Model;
using Core.DTOs.Organization;

namespace Xcianify.Repository
{
    public class OrganizationRepository : IOrganizationRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "organizations";

        public OrganizationRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<(List<Organization> Items, int TotalCount)> GetAllAsync(OrganizationFilterDto filterDto)
        {
            var whereConditions = new List<string>();
            var parameters = new DynamicParameters();

            // Add search filter
            if (!string.IsNullOrWhiteSpace(filterDto.Search))
            {
                whereConditions.Add("(LOWER(name) LIKE @Search OR LOWER(code) LIKE @Search OR LOWER(contact_person) LIKE @Search OR LOWER(email) LIKE @Search OR CAST(id AS TEXT) LIKE @Search)");
                parameters.Add("@Search", $"%{filterDto.Search.ToLower()}%");
            }

            // Add isActive filter
            if (filterDto.IsActive.HasValue)
            {
                whereConditions.Add("is_active = @IsActive");
                parameters.Add("@IsActive", filterDto.IsActive.Value);
            }

            // Add location type filter
            if (filterDto.LocationTypeId.HasValue)
            {
                whereConditions.Add("location_type_id = @LocationTypeId");
                parameters.Add("@LocationTypeId", filterDto.LocationTypeId.Value);
            }

            var whereClause = whereConditions.Count > 0 ? $"WHERE {string.Join(" AND ", whereConditions)}" : "";

            // Calculate offset for pagination
            var offset = (filterDto.PageNumber - 1) * filterDto.PageSize;

            var query = $@"
                SELECT 
                    id as Id,
                    code as Code,
                    location_type_id as LocationTypeId,
                    name as Name,
                    contact_person as ContactPerson,
                    address1 as Address1,
                    address2 as Address2,
                    city as City,
                    state as State,
                    country as Country,
                    zip as Zip,
                    phone as Phone,
                    email as Email,
                    website as Website,
                    gstin_number as GstinNumber,
                    tds_cycle as TdsCycle,
                    employment_status_code as EmploymentStatusCode,
                    esi_office_code as EsiOfficeCode,
                    exc_regin_code as ExcReginCode,
                    st_regn_code as StRegnCode,
                    cin_number as CinNumber,
                    interface_code as InterfaceCode,
                    license_number as LicenseNumber,
                    ecc_number as EccNumber,
                    range as Range,
                    division as Division,
                    collectorate as Collectorate,
                    drug_license_number1 as DrugLicenseNumber1,
                    drug_license_number2 as DrugLicenseNumber2,
                    food_license_number as FoodLicenseNumber,
                    cst_regn_number as CstRegnNumber,
                    vat_tin_number as VatTinNumber,
                    pan_number as PanNumber,
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
            var items = (await multi.ReadAsync<Organization>()).AsList();
            var totalCount = await multi.ReadFirstAsync<int>();

            return (items, totalCount);
        }

        public async Task<Organization> GetByIdAsync(int id)
        {
            var query = $@"
                SELECT 
                    id as Id,
                    code as Code,
                    location_type_id as LocationTypeId,
                    name as Name,
                    contact_person as ContactPerson,
                    address1 as Address1,
                    address2 as Address2,
                    city as City,
                    state as State,
                    country as Country,
                    zip as Zip,
                    phone as Phone,
                    email as Email,
                    website as Website,
                    gstin_number as GstinNumber,
                    tds_cycle as TdsCycle,
                    employment_status_code as EmploymentStatusCode,
                    esi_office_code as EsiOfficeCode,
                    exc_regin_code as ExcReginCode,
                    st_regn_code as StRegnCode,
                    cin_number as CinNumber,
                    interface_code as InterfaceCode,
                    license_number as LicenseNumber,
                    ecc_number as EccNumber,
                    range as Range,
                    division as Division,
                    collectorate as Collectorate,
                    drug_license_number1 as DrugLicenseNumber1,
                    drug_license_number2 as DrugLicenseNumber2,
                    food_license_number as FoodLicenseNumber,
                    cst_regn_number as CstRegnNumber,
                    vat_tin_number as VatTinNumber,
                    pan_number as PanNumber,
                    is_active as IsActive,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy
                FROM {TableName}
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<Organization>(query, new { Id = id });
        }

        public async Task<Organization> GetByCodeAsync(string code)
        {
            var query = $@"
                SELECT 
                    id as Id,
                    code as Code,
                    location_type_id as LocationTypeId,
                    name as Name,
                    contact_person as ContactPerson,
                    address1 as Address1,
                    address2 as Address2,
                    city as City,
                    state as State,
                    country as Country,
                    zip as Zip,
                    phone as Phone,
                    email as Email,
                    website as Website,
                    gstin_number as GstinNumber,
                    tds_cycle as TdsCycle,
                    employment_status_code as EmploymentStatusCode,
                    esi_office_code as EsiOfficeCode,
                    exc_regin_code as ExcReginCode,
                    st_regn_code as StRegnCode,
                    cin_number as CinNumber,
                    interface_code as InterfaceCode,
                    license_number as LicenseNumber,
                    ecc_number as EccNumber,
                    range as Range,
                    division as Division,
                    collectorate as Collectorate,
                    drug_license_number1 as DrugLicenseNumber1,
                    drug_license_number2 as DrugLicenseNumber2,
                    food_license_number as FoodLicenseNumber,
                    cst_regn_number as CstRegnNumber,
                    vat_tin_number as VatTinNumber,
                    pan_number as PanNumber,
                    is_active as IsActive,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy
                FROM {TableName}
                WHERE code = @Code";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<Organization>(query, new { Code = code });
        }

        public async Task<Organization> CreateAsync(Organization organization)
        {
            var query = $@"
                INSERT INTO {TableName} (
                    code, location_type_id, name, contact_person, address1, address2,
                    city, state, country, zip, phone, email, website, gstin_number,
                    tds_cycle, employment_status_code, esi_office_code, exc_regin_code,
                    st_regn_code, cin_number, interface_code, license_number, ecc_number,
                    range, division, collectorate, drug_license_number1, drug_license_number2,
                    food_license_number, cst_regn_number, vat_tin_number, pan_number,
                    is_active, created_at, updated_at, created_by, updated_by
                ) VALUES (
                    @Code, @LocationTypeId, @Name, @ContactPerson, @Address1, @Address2,
                    @City, @State, @Country, @Zip, @Phone, @Email, @Website, @GstinNumber,
                    @TdsCycle, @EmploymentStatusCode, @EsiOfficeCode, @ExcReginCode,
                    @StRegnCode, @CinNumber, @InterfaceCode, @LicenseNumber, @EccNumber,
                    @Range, @Division, @Collectorate, @DrugLicenseNumber1, @DrugLicenseNumber2,
                    @FoodLicenseNumber, @CstRegnNumber, @VatTinNumber, @PanNumber,
                    @IsActive, @CreatedAt, @UpdatedAt, @CreatedBy, @UpdatedBy
                )
                RETURNING *";

            organization.CreatedAt = DateTime.UtcNow;
            organization.UpdatedAt = DateTime.UtcNow;

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
                    tds_cycle = @TdsCycle,
                    employment_status_code = @EmploymentStatusCode,
                    esi_office_code = @EsiOfficeCode,
                    exc_regin_code = @ExcReginCode,
                    st_regn_code = @StRegnCode,
                    cin_number = @CinNumber,
                    interface_code = @InterfaceCode,
                    license_number = @LicenseNumber,
                    ecc_number = @EccNumber,
                    range = @Range,
                    division = @Division,
                    collectorate = @Collectorate,
                    drug_license_number1 = @DrugLicenseNumber1,
                    drug_license_number2 = @DrugLicenseNumber2,
                    food_license_number = @FoodLicenseNumber,
                    cst_regn_number = @CstRegnNumber,
                    vat_tin_number = @VatTinNumber,
                    pan_number = @PanNumber,
                    is_active = @IsActive,
                    updated_at = @UpdatedAt,
                    updated_by = @UpdatedBy
                WHERE id = @Id";

            organization.UpdatedAt = DateTime.UtcNow;

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
    }
}
