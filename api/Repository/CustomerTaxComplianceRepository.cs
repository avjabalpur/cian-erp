using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerTaxCompliance;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class CustomerTaxComplianceRepository : ICustomerTaxComplianceRepository
    {
        private readonly DapperDbContext _context;

        public CustomerTaxComplianceRepository(DapperDbContext context)
        {
            _context = context;
        }

        public async Task<List<CustomerTaxCompliance>> GetByCustomerIdAsync(int customerId)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                SELECT 
                    id, customer_id, vat_form_code, central_form_code, is_eligible_for_tcs,
                    tcs_type, is_applicable_higher_rate, is_deemed_non_resident,
                    is_deemed_permanent_establishment, is_bill_discount, is_reverse_end_of_year,
                    customer_interface_code, interface_file_format, projection_ratio,
                    number_of_displays, label_layout, number_of_copies, special_terms,
                    documents_through, created_at, updated_at
                FROM customer_tax_compliance 
                WHERE customer_id = @CustomerId
                ORDER BY created_at DESC";

            var taxCompliance = await connection.QueryAsync<CustomerTaxCompliance>(sql, new { CustomerId = customerId });
            return taxCompliance.ToList();
        }

        public async Task<CustomerTaxCompliance?> GetByIdAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                SELECT 
                    id, customer_id, vat_form_code, central_form_code, is_eligible_for_tcs,
                    tcs_type, is_applicable_higher_rate, is_deemed_non_resident,
                    is_deemed_permanent_establishment, is_bill_discount, is_reverse_end_of_year,
                    customer_interface_code, interface_file_format, projection_ratio,
                    number_of_displays, label_layout, number_of_copies, special_terms,
                    documents_through, created_at, updated_at
                FROM customer_tax_compliance 
                WHERE id = @Id";

            return await connection.QueryFirstOrDefaultAsync<CustomerTaxCompliance>(sql, new { Id = id });
        }

        public async Task<CustomerTaxCompliance> CreateAsync(CustomerTaxCompliance customerTaxCompliance)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                INSERT INTO customer_tax_compliance (
                    customer_id, vat_form_code, central_form_code, is_eligible_for_tcs,
                    tcs_type, is_applicable_higher_rate, is_deemed_non_resident,
                    is_deemed_permanent_establishment, is_bill_discount, is_reverse_end_of_year,
                    customer_interface_code, interface_file_format, projection_ratio,
                    number_of_displays, label_layout, number_of_copies, special_terms,
                    documents_through, created_at
                ) VALUES (
                    @CustomerId, @VatFormCode, @CentralFormCode, @IsEligibleForTcs,
                    @TcsType, @IsApplicableHigherRate, @IsDeemedNonResident,
                    @IsDeemedPermanentEstablishment, @IsBillDiscount, @IsReverseEndOfYear,
                    @CustomerInterfaceCode, @InterfaceFileFormat, @ProjectionRatio,
                    @NumberOfDisplays, @LabelLayout, @NumberOfCopies, @SpecialTerms,
                    @DocumentsThrough, @CreatedAt
                )
                RETURNING 
                    id, customer_id, vat_form_code, central_form_code, is_eligible_for_tcs,
                    tcs_type, is_applicable_higher_rate, is_deemed_non_resident,
                    is_deemed_permanent_establishment, is_bill_discount, is_reverse_end_of_year,
                    customer_interface_code, interface_file_format, projection_ratio,
                    number_of_displays, label_layout, number_of_copies, special_terms,
                    documents_through, created_at, updated_at";

            return await connection.QueryFirstAsync<CustomerTaxCompliance>(sql, customerTaxCompliance);
        }

        public async Task<CustomerTaxCompliance> UpdateAsync(CustomerTaxCompliance customerTaxCompliance)
        {
            using var connection = _context.GetConnection();
            var sql = @"
                UPDATE customer_tax_compliance SET
                    vat_form_code = @VatFormCode,
                    central_form_code = @CentralFormCode,
                    is_eligible_for_tcs = @IsEligibleForTcs,
                    tcs_type = @TcsType,
                    is_applicable_higher_rate = @IsApplicableHigherRate,
                    is_deemed_non_resident = @IsDeemedNonResident,
                    is_deemed_permanent_establishment = @IsDeemedPermanentEstablishment,
                    is_bill_discount = @IsBillDiscount,
                    is_reverse_end_of_year = @IsReverseEndOfYear,
                    customer_interface_code = @CustomerInterfaceCode,
                    interface_file_format = @InterfaceFileFormat,
                    projection_ratio = @ProjectionRatio,
                    number_of_displays = @NumberOfDisplays,
                    label_layout = @LabelLayout,
                    number_of_copies = @NumberOfCopies,
                    special_terms = @SpecialTerms,
                    documents_through = @DocumentsThrough,
                    updated_at = @UpdatedAt
                WHERE id = @Id
                RETURNING 
                    id, customer_id, vat_form_code, central_form_code, is_eligible_for_tcs,
                    tcs_type, is_applicable_higher_rate, is_deemed_non_resident,
                    is_deemed_permanent_establishment, is_bill_discount, is_reverse_end_of_year,
                    customer_interface_code, interface_file_format, projection_ratio,
                    number_of_displays, label_layout, number_of_copies, special_terms,
                    documents_through, created_at, updated_at";

            return await connection.QueryFirstAsync<CustomerTaxCompliance>(sql, customerTaxCompliance);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = "DELETE FROM customer_tax_compliance WHERE id = @Id";
            var rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = _context.GetConnection();
            var sql = "SELECT COUNT(*) FROM customer_tax_compliance WHERE id = @Id";
            var count = await connection.ExecuteScalarAsync<int>(sql, new { Id = id });
            return count > 0;
        }
    }
} 