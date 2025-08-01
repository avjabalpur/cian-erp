using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xcianify.Core.Model
{
    [Table("item_master")]
    public class ItemMaster : BaseModel
    {
        [Key]
        public int Id { get; set; }

        [Column("item_code")]
        public string ItemCode { get; set; }

        [Column("rev_no")]
        public string RevNo { get; set; }

        [Column("item_type_id")]
        public int ItemTypeId { get; set; }

        [Column("sub_type")]
        public int? SubType { get; set; }

        [Column("gs_ind")]
        public string GsInd { get; set; }

        [Column("goods_type")]
        public string GoodsType { get; set; }

        [Column("item_name")]
        public string ItemName { get; set; }

        [Column("short_name")]
        public string ShortName { get; set; }

        [Column("pharmacopoeia_name")]
        public string PharmacopoeiaName { get; set; }

        [Column("unit_of_measure")]
        public string UnitOfMeasure { get; set; }

        [Column("issuing_unit")]
        public string IssuingUnit { get; set; }

        [Column("uom_iss_conv_factor")]
        public decimal? UomIssConvFactor { get; set; }

        [Column("uom_uqc_conv_factor")]
        public decimal? UomUqcConvFactor { get; set; }

        [Column("drawing_ref")]
        public string DrawingRef { get; set; }

        [Column("std_assay_strength")]
        public decimal? StdAssayStrength { get; set; }

        [Column("shelf_life_months")]
        public int? ShelfLifeMonths { get; set; }

        [Column("shelf_life_days")]
        public int? ShelfLifeDays { get; set; }

        [Column("std_rate")]
        public decimal? StdRate { get; set; }

        [Column("lead_time_days")]
        public int? LeadTimeDays { get; set; }

        [Column("std_loss_on_dry")]
        public decimal? StdLossOnDry { get; set; }

        [Column("safety_stock")]
        public int? SafetyStock { get; set; }

        [Column("bought_out")]
        public bool BoughtOut { get; set; }

        [Column("job_work")]
        public bool JobWork { get; set; }

        [Column("imported")]
        public bool Imported { get; set; }

        [Column("current_buyer")]
        public string CurrentBuyer { get; set; }

        [Column("economic_order_qty")]
        public int? EconomicOrderQty { get; set; }

        [Column("desired_pack_size")]
        public int? DesiredPackSize { get; set; }

        [Column("tax_credit_applicable")]
        public bool TaxCreditApplicable { get; set; }

        [Column("freight_on")]
        public string FreightOn { get; set; }

        [Column("manufactured")]
        public bool Manufactured { get; set; }

        [Column("allowed_allergen_percent")]
        public decimal? AllowedAllergenPercent { get; set; }

        [Column("std_mfg_fees_per_unit")]
        public decimal? StdMfgFeesPerUnit { get; set; }

        [Column("main_prod_centre")]
        public string MainProdCentre { get; set; }

        [Column("sold")]
        public bool Sold { get; set; }

        [Column("key_product")]
        public bool KeyProduct { get; set; }

        [Column("exported")]
        public bool Exported { get; set; }

        [Column("product_type")]
        public string ProductType { get; set; }

        [Column("sales_division")]
        public string SalesDivision { get; set; }

        [Column("product_group")]
        public string ProductGroup { get; set; }

        [Column("conversion_factor")]
        public decimal? ConversionFactor { get; set; }

        [Column("vendor_part_no")]
        public string VendorPartNo { get; set; }

        [Column("batch_not_applicable")]
        public bool BatchNotApplicable { get; set; }

        [Column("qc_required")]
        public bool QcRequired { get; set; }

        [Column("allergen")]
        public bool Allergen { get; set; }

        [Column("mfg_date_applicable")]
        public bool MfgDateApplicable { get; set; }

        [Column("expiry_date_applicable")]
        public bool ExpiryDateApplicable { get; set; }

        [Column("track_serial_nos")]
        public bool TrackSerialNos { get; set; }

        [Column("packing_freight_insurance_services")]
        public bool PackingFreightInsuranceServices { get; set; }

        [Column("active_ingredient")]
        public bool ActiveIngredient { get; set; }

        [Column("mfg_loc_name_required")]
        public bool MfgLocNameRequired { get; set; }

        [Column("mfg_mm_yyyy_applicable")]
        public bool MfgMmYyyyApplicable { get; set; }

        [Column("expiry_mm_yyyy_applicable")]
        public bool ExpiryMmYyyyApplicable { get; set; }

        [Column("principal_for_statutory_reporting")]
        public bool PrincipalForStatutoryReporting { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("created_by")]
        public int? CreatedBy { get; set; }

        [Column("updated_by")]
        public int? UpdatedBy { get; set; }

        [Column("is_deleted")]
        public bool IsDeleted { get; set; }
    }
}
