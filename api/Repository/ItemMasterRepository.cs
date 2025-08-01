using Dapper;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;
using Xcianify.Repository.DbContext;

namespace Xcianify.Repository
{
    public class ItemMasterRepository : IItemMasterRepository
    {
        private readonly DapperDbContext _dbContext;
        private const string TableName = "item_master";

        public ItemMasterRepository(DapperDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task<(List<ItemMaster> Items, int TotalCount)> GetAllAsync(ItemMasterFilterDto filterDto)
        {
            var whereConditions = new List<string>();
            var parameters = new DynamicParameters();

            // Add search filter
            if (!string.IsNullOrWhiteSpace(filterDto.Search))
            {
                whereConditions.Add("(LOWER(item_code) LIKE @search OR LOWER(item_name) LIKE @search OR LOWER(short_name) LIKE @search)");
                parameters.Add("@search", $"%{filterDto.Search.ToLower()}%");
            }

            // Add itemTypeId filter
            if (filterDto.ItemTypeId.HasValue)
            {
                whereConditions.Add("item_type_id = @ItemTypeId");
                parameters.Add("@ItemTypeId", filterDto.ItemTypeId.Value);
            }

            // Always filter out deleted items
            whereConditions.Add("(is_deleted = false or is_deleted is null)");

            var whereClause = whereConditions.Count > 0 ? $"WHERE {string.Join(" AND ", whereConditions)}" : "";

            // Calculate offset for pagination
            var offset = (filterDto.PageNumber - 1) * filterDto.PageSize;

            var query = $@"
                SELECT 
                    id as Id,
                    item_code as ItemCode,
                    rev_no as RevNo,
                    item_type_id as ItemTypeId,
                    sub_type as SubType,
                    gs_ind as GsInd,
                    goods_type as GoodsType,
                    item_name as ItemName,
                    short_name as ShortName,
                    pharmacopoeia_name as PharmacopoeiaName,
                    unit_of_measure as UnitOfMeasure,
                    issuing_unit as IssuingUnit,
                    uom_iss_conv_factor as UomIssConvFactor,
                    uom_uqc_conv_factor as UomUqcConvFactor,
                    drawing_ref as DrawingRef,
                    std_assay_strength as StdAssayStrength,
                    shelf_life_months as ShelfLifeMonths,
                    shelf_life_days as ShelfLifeDays,
                    std_rate as StdRate,
                    lead_time_days as LeadTimeDays,
                    std_loss_on_dry as StdLossOnDry,
                    safety_stock as SafetyStock,
                    bought_out as BoughtOut,
                    job_work as JobWork,
                    imported as Imported,
                    current_buyer as CurrentBuyer,
                    economic_order_qty as EconomicOrderQty,
                    desired_pack_size as DesiredPackSize,
                    tax_credit_applicable as TaxCreditApplicable,
                    freight_on as FreightOn,
                    manufactured as Manufactured,
                    allowed_allergen_percent as AllowedAllergenPercent,
                    std_mfg_fees_per_unit as StdMfgFeesPerUnit,
                    main_prod_centre as MainProdCentre,
                    sold as Sold,
                    key_product as KeyProduct,
                    exported as Exported,
                    product_type as ProductType,
                    sales_division as SalesDivision,
                    product_group as ProductGroup,
                    conversion_factor as ConversionFactor,
                    vendor_part_no as VendorPartNo,
                    batch_not_applicable as BatchNotApplicable,
                    qc_required as QcRequired,
                    allergen as Allergen,
                    mfg_date_applicable as MfgDateApplicable,
                    expiry_date_applicable as ExpiryDateApplicable,
                    track_serial_nos as TrackSerialNos,
                    packing_freight_insurance_services as PackingFreightInsuranceServices,
                    active_ingredient as ActiveIngredient,
                    mfg_loc_name_required as MfgLocNameRequired,
                    mfg_mm_yyyy_applicable as MfgMmYyyyApplicable,
                    expiry_mm_yyyy_applicable as ExpiryMmYyyyApplicable,
                    principal_for_statutory_reporting as PrincipalForStatutoryReporting,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy,
                    is_deleted as IsDeleted
                FROM {TableName}
                {whereClause}
                ORDER BY created_at DESC
                LIMIT @PageSize OFFSET @Offset;
                
                SELECT COUNT(*) FROM {TableName} {whereClause};";

            parameters.Add("@PageSize", filterDto.PageSize);
            parameters.Add("@Offset", offset);

            using var connection = _dbContext.GetConnection();
            using var multi = await connection.QueryMultipleAsync(query, parameters);
            var items = (await multi.ReadAsync<ItemMaster>()).AsList();
            var totalCount = await multi.ReadFirstAsync<int>();

            return (items, totalCount);
        }

        public async Task<ItemMaster> GetByIdAsync(int id)
        {
            var query = $@"
                SELECT 
                    id as Id,
                    item_code as ItemCode,
                    rev_no as RevNo,
                    item_type_id as ItemTypeId,
                    sub_type as SubType,
                    gs_ind as GsInd,
                    goods_type as GoodsType,
                    item_name as ItemName,
                    short_name as ShortName,
                    pharmacopoeia_name as PharmacopoeiaName,
                    unit_of_measure as UnitOfMeasure,
                    issuing_unit as IssuingUnit,
                    uom_iss_conv_factor as UomIssConvFactor,
                    uom_uqc_conv_factor as UomUqcConvFactor,
                    drawing_ref as DrawingRef,
                    std_assay_strength as StdAssayStrength,
                    shelf_life_months as ShelfLifeMonths,
                    shelf_life_days as ShelfLifeDays,
                    std_rate as StdRate,
                    lead_time_days as LeadTimeDays,
                    std_loss_on_dry as StdLossOnDry,
                    safety_stock as SafetyStock,
                    bought_out as BoughtOut,
                    job_work as JobWork,
                    imported as Imported,
                    current_buyer as CurrentBuyer,
                    economic_order_qty as EconomicOrderQty,
                    desired_pack_size as DesiredPackSize,
                    tax_credit_applicable as TaxCreditApplicable,
                    freight_on as FreightOn,
                    manufactured as Manufactured,
                    allowed_allergen_percent as AllowedAllergenPercent,
                    std_mfg_fees_per_unit as StdMfgFeesPerUnit,
                    main_prod_centre as MainProdCentre,
                    sold as Sold,
                    key_product as KeyProduct,
                    exported as Exported,
                    product_type as ProductType,
                    sales_division as SalesDivision,
                    product_group as ProductGroup,
                    conversion_factor as ConversionFactor,
                    vendor_part_no as VendorPartNo,
                    batch_not_applicable as BatchNotApplicable,
                    qc_required as QcRequired,
                    allergen as Allergen,
                    mfg_date_applicable as MfgDateApplicable,
                    expiry_date_applicable as ExpiryDateApplicable,
                    track_serial_nos as TrackSerialNos,
                    packing_freight_insurance_services as PackingFreightInsuranceServices,
                    active_ingredient as ActiveIngredient,
                    mfg_loc_name_required as MfgLocNameRequired,
                    mfg_mm_yyyy_applicable as MfgMmYyyyApplicable,
                    expiry_mm_yyyy_applicable as ExpiryMmYyyyApplicable,
                    principal_for_statutory_reporting as PrincipalForStatutoryReporting,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy,
                    is_deleted as IsDeleted
                FROM {TableName}
                WHERE id = @Id AND is_deleted = false";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ItemMaster>(query, new { Id = id });
        }

        public async Task<ItemMaster> GetByItemCodeAsync(string itemCode)
        {
            var query = $@"
                SELECT 
                    id as Id,
                    item_code as ItemCode,
                    rev_no as RevNo,
                    item_type_id as ItemTypeId,
                    sub_type as SubType,
                    gs_ind as GsInd,
                    goods_type as GoodsType,
                    item_name as ItemName,
                    short_name as ShortName,
                    pharmacopoeia_name as PharmacopoeiaName,
                    unit_of_measure as UnitOfMeasure,
                    issuing_unit as IssuingUnit,
                    uom_iss_conv_factor as UomIssConvFactor,
                    uom_uqc_conv_factor as UomUqcConvFactor,
                    drawing_ref as DrawingRef,
                    std_assay_strength as StdAssayStrength,
                    shelf_life_months as ShelfLifeMonths,
                    shelf_life_days as ShelfLifeDays,
                    std_rate as StdRate,
                    lead_time_days as LeadTimeDays,
                    std_loss_on_dry as StdLossOnDry,
                    safety_stock as SafetyStock,
                    bought_out as BoughtOut,
                    job_work as JobWork,
                    imported as Imported,
                    current_buyer as CurrentBuyer,
                    economic_order_qty as EconomicOrderQty,
                    desired_pack_size as DesiredPackSize,
                    tax_credit_applicable as TaxCreditApplicable,
                    freight_on as FreightOn,
                    manufactured as Manufactured,
                    allowed_allergen_percent as AllowedAllergenPercent,
                    std_mfg_fees_per_unit as StdMfgFeesPerUnit,
                    main_prod_centre as MainProdCentre,
                    sold as Sold,
                    key_product as KeyProduct,
                    exported as Exported,
                    product_type as ProductType,
                    sales_division as SalesDivision,
                    product_group as ProductGroup,
                    conversion_factor as ConversionFactor,
                    vendor_part_no as VendorPartNo,
                    batch_not_applicable as BatchNotApplicable,
                    qc_required as QcRequired,
                    allergen as Allergen,
                    mfg_date_applicable as MfgDateApplicable,
                    expiry_date_applicable as ExpiryDateApplicable,
                    track_serial_nos as TrackSerialNos,
                    packing_freight_insurance_services as PackingFreightInsuranceServices,
                    active_ingredient as ActiveIngredient,
                    mfg_loc_name_required as MfgLocNameRequired,
                    mfg_mm_yyyy_applicable as MfgMmYyyyApplicable,
                    expiry_mm_yyyy_applicable as ExpiryMmYyyyApplicable,
                    principal_for_statutory_reporting as PrincipalForStatutoryReporting,
                    created_at as CreatedAt,
                    updated_at as UpdatedAt,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy,
                    is_deleted as IsDeleted
                FROM {TableName}
                WHERE item_code = @ItemCode AND is_deleted = false";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ItemMaster>(query, new { ItemCode = itemCode });
        }

        public async Task<ItemMaster> AddAsync(ItemMaster item)
        {
            var query = $@"
                INSERT INTO {TableName} (
                    item_code, rev_no, item_type_id, sub_type, gs_ind, goods_type, item_name, short_name,
                    pharmacopoeia_name, unit_of_measure, issuing_unit, uom_iss_conv_factor, uom_uqc_conv_factor,
                    drawing_ref, std_assay_strength, shelf_life_months, shelf_life_days, std_rate, lead_time_days,
                    std_loss_on_dry, safety_stock, bought_out, job_work, imported, current_buyer, economic_order_qty,
                    desired_pack_size, tax_credit_applicable, freight_on, manufactured, allowed_allergen_percent,
                    std_mfg_fees_per_unit, main_prod_centre, sold, key_product, exported, product_type,
                    sales_division, product_group, conversion_factor, vendor_part_no, batch_not_applicable,
                    qc_required, allergen, mfg_date_applicable, expiry_date_applicable, track_serial_nos,
                    packing_freight_insurance_services, active_ingredient, mfg_loc_name_required,
                    mfg_mm_yyyy_applicable, expiry_mm_yyyy_applicable, principal_for_statutory_reporting,
                    created_at, updated_at, created_by, updated_by, is_deleted
                ) VALUES (
                    @ItemCode, @RevNo, @ItemTypeId, @SubType, @GsInd, @GoodsType, @ItemName, @ShortName,
                    @PharmacopoeiaName, @UnitOfMeasure, @IssuingUnit, @UomIssConvFactor, @UomUqcConvFactor,
                    @DrawingRef, @StdAssayStrength, @ShelfLifeMonths, @ShelfLifeDays, @StdRate, @LeadTimeDays,
                    @StdLossOnDry, @SafetyStock, @BoughtOut, @JobWork, @Imported, @CurrentBuyer, @EconomicOrderQty,
                    @DesiredPackSize, @TaxCreditApplicable, @FreightOn, @Manufactured, @AllowedAllergenPercent,
                    @StdMfgFeesPerUnit, @MainProdCentre, @Sold, @KeyProduct, @Exported, @ProductType,
                    @SalesDivision, @ProductGroup, @ConversionFactor, @VendorPartNo, @BatchNotApplicable,
                    @QcRequired, @Allergen, @MfgDateApplicable, @ExpiryDateApplicable, @TrackSerialNos,
                    @PackingFreightInsuranceServices, @ActiveIngredient, @MfgLocNameRequired,
                    @MfgMmYyyyApplicable, @ExpiryMmYyyyApplicable, @PrincipalForStatutoryReporting,
                    @CreatedAt, @UpdatedAt, @CreatedBy, @UpdatedBy, @IsDeleted
                )
                RETURNING *";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstAsync<ItemMaster>(query, item);
        }

        public async Task UpdateAsync(ItemMaster item)
        {
            var query = $@"
                UPDATE {TableName} 
                SET item_code = @ItemCode,
                    rev_no = @RevNo,
                    item_type_id = @ItemTypeId,
                    sub_type = @SubType,
                    gs_ind = @GsInd,
                    goods_type = @GoodsType,
                    item_name = @ItemName,
                    short_name = @ShortName,
                    pharmacopoeia_name = @PharmacopoeiaName,
                    unit_of_measure = @UnitOfMeasure,
                    issuing_unit = @IssuingUnit,
                    uom_iss_conv_factor = @UomIssConvFactor,
                    uom_uqc_conv_factor = @UomUqcConvFactor,
                    drawing_ref = @DrawingRef,
                    std_assay_strength = @StdAssayStrength,
                    shelf_life_months = @ShelfLifeMonths,
                    shelf_life_days = @ShelfLifeDays,
                    std_rate = @StdRate,
                    lead_time_days = @LeadTimeDays,
                    std_loss_on_dry = @StdLossOnDry,
                    safety_stock = @SafetyStock,
                    bought_out = @BoughtOut,
                    job_work = @JobWork,
                    imported = @Imported,
                    current_buyer = @CurrentBuyer,
                    economic_order_qty = @EconomicOrderQty,
                    desired_pack_size = @DesiredPackSize,
                    tax_credit_applicable = @TaxCreditApplicable,
                    freight_on = @FreightOn,
                    manufactured = @Manufactured,
                    allowed_allergen_percent = @AllowedAllergenPercent,
                    std_mfg_fees_per_unit = @StdMfgFeesPerUnit,
                    main_prod_centre = @MainProdCentre,
                    sold = @Sold,
                    key_product = @KeyProduct,
                    exported = @Exported,
                    product_type = @ProductType,
                    sales_division = @SalesDivision,
                    product_group = @ProductGroup,
                    conversion_factor = @ConversionFactor,
                    vendor_part_no = @VendorPartNo,
                    batch_not_applicable = @BatchNotApplicable,
                    qc_required = @QcRequired,
                    allergen = @Allergen,
                    mfg_date_applicable = @MfgDateApplicable,
                    expiry_date_applicable = @ExpiryDateApplicable,
                    track_serial_nos = @TrackSerialNos,
                    packing_freight_insurance_services = @PackingFreightInsuranceServices,
                    active_ingredient = @ActiveIngredient,
                    mfg_loc_name_required = @MfgLocNameRequired,
                    mfg_mm_yyyy_applicable = @MfgMmYyyyApplicable,
                    expiry_mm_yyyy_applicable = @ExpiryMmYyyyApplicable,
                    principal_for_statutory_reporting = @PrincipalForStatutoryReporting,
                    updated_at = @UpdatedAt,
                    updated_by = @UpdatedBy,
                    is_deleted = @IsDeleted
                WHERE id = @Id";

            item.UpdatedAt = DateTime.UtcNow;

            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, item);
        }

        public async Task DeleteAsync(int id)
        {
            var query = $"UPDATE {TableName} SET is_deleted = true, updated_at = @UpdatedAt WHERE id = @Id";
            using var connection = _dbContext.GetConnection();
            await connection.ExecuteAsync(query, new { Id = id, UpdatedAt = DateTime.UtcNow });
        }

        public async Task<bool> ItemCodeExistsAsync(string itemCode)
        {
            var query = $"SELECT COUNT(*) FROM {TableName} WHERE item_code = @ItemCode AND is_deleted = false";
            using var connection = _dbContext.GetConnection();
            var count = await connection.ExecuteScalarAsync<int>(query, new { ItemCode = itemCode });
            return count > 0;
        }
    }
}
