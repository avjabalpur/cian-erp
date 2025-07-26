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

        public async Task<(List<ItemMaster> Items, int TotalCount)> GetAllAsync(ItemMasterFilterDto filter)
        {
            var whereClause = new List<string>();
            var parameters = new DynamicParameters();

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                whereClause.Add($"(LOWER(item_code) LIKE @SearchTerm OR LOWER(item_name) LIKE @SearchTerm OR LOWER(short_name) LIKE @SearchTerm)");
                parameters.Add("SearchTerm", $"%{filter.SearchTerm.ToLower()}%");
            }

            if (filter.ItemTypeId.HasValue)
            {
                whereClause.Add("item_type_id = @ItemTypeId");
                parameters.Add("ItemTypeId", filter.ItemTypeId.Value);
            }

            var whereClauseStr = whereClause.Any() ? "WHERE " + string.Join(" AND ", whereClause) : "";
            var countQuery = $"SELECT COUNT(*) FROM {TableName} {whereClauseStr}";
            
            using var connection = _dbContext.GetConnection();
            var totalCount = await connection.ExecuteScalarAsync<int>(countQuery, parameters);

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
                    created_on as CreatedOn,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy,
                    updated_at as UpdatedAt
                FROM {TableName}
                {whereClauseStr}
                ORDER BY item_code
                LIMIT @PageSize OFFSET @Offset";

            parameters.Add("PageSize", filter.PageSize);
            parameters.Add("Offset", (filter.PageNumber - 1) * filter.PageSize);

            var items = (await connection.QueryAsync<ItemMaster>(query, parameters)).ToList();
            return (items, totalCount);
        }

        public async Task<ItemMaster> GetByIdAsync(int id)
        {
            const string query = @"
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
                    created_on as CreatedOn,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy,
                    updated_at as UpdatedAt
                FROM item_master
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ItemMaster>(query, new { Id = id });
        }

        public async Task<ItemMaster> GetByItemCodeAsync(string itemCode)
        {
            const string query = @"
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
                    created_on as CreatedOn,
                    created_by as CreatedBy,
                    updated_by as UpdatedBy,
                    updated_at as UpdatedAt
                FROM {TableName}
                WHERE item_code = @ItemCode";

            using var connection = _dbContext.GetConnection();
            return await connection.QueryFirstOrDefaultAsync<ItemMaster>(query, new { ItemCode = itemCode });
        }

        public async Task<int> CreateAsync(ItemMaster item)
        {
            const string query = @"
                INSERT INTO item_master (
                    item_code, rev_no, item_type_id, sub_type, gs_ind, goods_type, item_name, 
                    short_name, pharmacopoeia_name, unit_of_measure, issuing_unit, uom_iss_conv_factor, 
                    uom_uqc_conv_factor, drawing_ref, std_assay_strength, shelf_life_months, 
                    shelf_life_days, std_rate, lead_time_days, std_loss_on_dry, safety_stock, 
                    bought_out, job_work, imported, current_buyer, economic_order_qty, 
                    desired_pack_size, tax_credit_applicable, freight_on, manufactured, 
                    allowed_allergen_percent, std_mfg_fees_per_unit, main_prod_centre, sold, 
                    key_product, exported, product_type, sales_division, product_group, 
                    conversion_factor, vendor_part_no, batch_not_applicable, qc_required, 
                    allergen, mfg_date_applicable, expiry_date_applicable, track_serial_nos, 
                    packing_freight_insurance_services, active_ingredient, mfg_loc_name_required, 
                    mfg_mm_yyyy_applicable, expiry_mm_yyyy_applicable, principal_for_statutory_reporting,
                    created_by, updated_by, created_on, updated_at
                ) 
                VALUES (
                    @ItemCode, @RevNo, @ItemTypeId, @SubType, @GsInd, @GoodsType, @ItemName, 
                    @ShortName, @PharmacopoeiaName, @UnitOfMeasure, @IssuingUnit, @UomIssConvFactor, 
                    @UomUqcConvFactor, @DrawingRef, @StdAssayStrength, @ShelfLifeMonths, 
                    @ShelfLifeDays, @StdRate, @LeadTimeDays, @StdLossOnDry, @SafetyStock, 
                    @BoughtOut, @JobWork, @Imported, @CurrentBuyer, @EconomicOrderQty, 
                    @DesiredPackSize, @TaxCreditApplicable, @FreightOn, @Manufactured, 
                    @AllowedAllergenPercent, @StdMfgFeesPerUnit, @MainProdCentre, @Sold, 
                    @KeyProduct, @Exported, @ProductType, @SalesDivision, @ProductGroup, 
                    @ConversionFactor, @VendorPartNo, @BatchNotApplicable, @QcRequired, 
                    @Allergen, @MfgDateApplicable, @ExpiryDateApplicable, @TrackSerialNos, 
                    @PackingFreightInsuranceServices, @ActiveIngredient, @MfgLocNameRequired, 
                    @MfgMmYyyyApplicable, @ExpiryMmYyyyApplicable, @PrincipalForStatutoryReporting,
                    @CreatedBy, @UpdatedBy, @CreatedOn, @UpdatedAt
                )
                RETURNING id;";

            using var connection = _dbContext.GetConnection();
            
            // Insert into item_master
            return await connection.ExecuteScalarAsync<int>(query, item);
        }

        public async Task<bool> UpdateAsync(ItemMaster item)
        {
            const string query = @"
                UPDATE item_master 
                SET 
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
                    updated_by = @UpdatedBy,
                    updated_at = @UpdatedAt
                WHERE id = @Id";

            using var connection = _dbContext.GetConnection();
            
            // Update item_master
            var rowsAffected = await connection.ExecuteAsync(query, new
            {
                item.Id,
                item.RevNo,
                item.ItemTypeId,
                item.SubType,
                item.GsInd,
                item.GoodsType,
                item.ItemName,
                item.ShortName,
                item.PharmacopoeiaName,
                item.UnitOfMeasure,
                item.IssuingUnit,
                item.UomIssConvFactor,
                item.UomUqcConvFactor,
                item.DrawingRef,
                item.StdAssayStrength,
                item.ShelfLifeMonths,
                item.ShelfLifeDays,
                item.StdRate,
                item.LeadTimeDays,
                item.StdLossOnDry,
                item.SafetyStock,
                item.BoughtOut,
                item.JobWork,
                item.Imported,
                item.CurrentBuyer,
                item.EconomicOrderQty,
                item.DesiredPackSize,
                item.TaxCreditApplicable,
                item.FreightOn,
                item.Manufactured,
                item.AllowedAllergenPercent,
                item.StdMfgFeesPerUnit,
                item.MainProdCentre,
                item.Sold,
                item.KeyProduct,
                item.Exported,
                item.ProductType,
                item.SalesDivision,
                item.ProductGroup,
                item.ConversionFactor,
                item.VendorPartNo,
                item.BatchNotApplicable,
                item.QcRequired,
                item.Allergen,
                item.MfgDateApplicable,
                item.ExpiryDateApplicable,
                item.TrackSerialNos,
                item.PackingFreightInsuranceServices,
                item.ActiveIngredient,
                item.MfgLocNameRequired,
                item.MfgMmYyyyApplicable,
                item.ExpiryMmYyyyApplicable,
                item.PrincipalForStatutoryReporting,
                item.UpdatedBy,
                item.UpdatedAt
            });

            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            // Note: The specification will be deleted automatically due to CASCADE delete
            var query = $"DELETE FROM {TableName} WHERE id = @Id";
            
            using var connection = _dbContext.GetConnection();
            var rowsAffected = await connection.ExecuteAsync(query, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<bool> ItemCodeExistsAsync(string itemCode, int? excludeId = null)
        {
            var query = $"SELECT COUNT(*) FROM {TableName} WHERE item_code = @ItemCode";
            if (excludeId.HasValue)
            {
                query += " AND id != @ExcludeId";
            }
            
            using var connection = _dbContext.GetConnection();
            var count = await connection.ExecuteScalarAsync<int>(
                query, 
                new { ItemCode = itemCode, ExcludeId = excludeId });
                
            return count > 0;
        }
    }
}
