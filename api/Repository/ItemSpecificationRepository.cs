using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ItemSpecificationRepository : IItemSpecificationRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "item_specifications";

        public ItemSpecificationRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<ItemSpecification> GetByItemCodeAsync(string itemCode)
        {
            const string query = @"
                SELECT 
                    id as Id,
                    item_code as ItemCode,
                    specification as Specification,
                    substitute_for_item_code as SubstituteForItemCode,
                    custom_tariff_no as CustomTariffNo,
                    excise_tariff_no as ExciseTariffNo,
                    vat_comm_code as VatCommCode,
                    conversion_factor as ConversionFactor,
                    old_code as OldCode,
                    standard_weight as StandardWeight,
                    standard_conversion_cost_factor as StandardConversionCostFactor,
                    standard_packing_cost_factor as StandardPackingCostFactor,
                    markup_percentage as MarkupPercentage,
                    markup_amount as MarkupAmount,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt
                FROM item_specifications
                WHERE item_code = @ItemCode";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ItemSpecification>(query, new { ItemCode = itemCode });
        }

        public async Task CreateAsync(ItemSpecification specification)
        {
            const string query = @"
                INSERT INTO item_specifications (
                    item_code, specification, substitute_for_item_code, 
                    custom_tariff_no, excise_tariff_no, vat_comm_code, 
                    conversion_factor, old_code, standard_weight, 
                    standard_conversion_cost_factor, standard_packing_cost_factor, 
                    markup_percentage, markup_amount, created_by, updated_by
                ) VALUES (
                    @ItemCode, @Specification, @SubstituteForItemCode, 
                    @CustomTariffNo, @ExciseTariffNo, @VatCommCode, 
                    @ConversionFactor, @OldCode, @StandardWeight, 
                    @StandardConversionCostFactor, @StandardPackingCostFactor, 
                    @MarkupPercentage, @MarkupAmount, @CreatedBy, @UpdatedBy
                )";

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, specification);
        }

        public async Task UpdateAsync(ItemSpecification specification)
        {
            const string query = @"
                UPDATE item_specifications SET
                    specification = @Specification,
                    substitute_for_item_code = @SubstituteForItemCode,
                    custom_tariff_no = @CustomTariffNo,
                    excise_tariff_no = @ExciseTariffNo,
                    vat_comm_code = @VatCommCode,
                    conversion_factor = @ConversionFactor,
                    old_code = @OldCode,
                    standard_weight = @StandardWeight,
                    standard_conversion_cost_factor = @StandardConversionCostFactor,
                    standard_packing_cost_factor = @StandardPackingCostFactor,
                    markup_percentage = @MarkupPercentage,
                    markup_amount = @MarkupAmount,
                    updated_by = @UpdatedBy,
                    updated_at = @UpdatedAt
                WHERE item_code = @ItemCode";

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, specification);
        }

        public async Task DeleteAsync(string itemCode)
        {
            const string query = "DELETE FROM item_specifications WHERE item_code = @ItemCode";

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { ItemCode = itemCode });
        }
    }
}
