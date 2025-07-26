using System;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class ItemMasterFilterDto
    {
        // Search and filter fields
        public string SearchTerm { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string ShortName { get; set; }
        public string RevNo { get; set; }
        public int? ItemTypeId { get; set; }
        public string SubType { get; set; }
        public string GsInd { get; set; }
        public string GoodsType { get; set; }
        public string PharmacopoeiaName { get; set; }
        public string UnitOfMeasure { get; set; }
        public string IssuingUnit { get; set; }
        public string DrawingRef { get; set; }
        public string StdAssayStrength { get; set; }
        public string ProductType { get; set; }
        public string SalesDivision { get; set; }
        public string ProductGroup { get; set; }
        public string VendorPartNo { get; set; }
        public string Allergen { get; set; }
        public string ActiveIngredient { get; set; }
        public string PackingFreightInsuranceServices { get; set; }
        
        // Boolean filters
        public bool? BoughtOut { get; set; }
        public bool? JobWork { get; set; }
        public bool? Imported { get; set; }
        public bool? TaxCreditApplicable { get; set; }
        public bool? Manufactured { get; set; }
        public bool? Sold { get; set; }
        public bool? KeyProduct { get; set; }
        public bool? Exported { get; set; }
        public bool? BatchNotApplicable { get; set; }
        public bool? QcRequired { get; set; }
        public bool? MfgDateApplicable { get; set; }
        public bool? ExpiryDateApplicable { get; set; }
        public bool? TrackSerialNos { get; set; }
        public bool? MfgLocNameRequired { get; set; }
        public bool? MfgMmYyyyApplicable { get; set; }
        public bool? ExpiryMmYyyyApplicable { get; set; }
        public bool? PrincipalForStatutoryReporting { get; set; }
        
        // Range filters
        public decimal? MinUomIssConvFactor { get; set; }
        public decimal? MaxUomIssConvFactor { get; set; }
        public decimal? MinUomUqcConvFactor { get; set; }
        public decimal? MaxUomUqcConvFactor { get; set; }
        public int? MinShelfLifeMonths { get; set; }
        public int? MaxShelfLifeMonths { get; set; }
        public int? MinShelfLifeDays { get; set; }
        public int? MaxShelfLifeDays { get; set; }
        public decimal? MinStdRate { get; set; }
        public decimal? MaxStdRate { get; set; }
        public int? MinLeadTimeDays { get; set; }
        public int? MaxLeadTimeDays { get; set; }
        public decimal? MinStdLossOnDry { get; set; }
        public decimal? MaxStdLossOnDry { get; set; }
        public decimal? MinSafetyStock { get; set; }
        public decimal? MaxSafetyStock { get; set; }
        public decimal? MinEconomicOrderQty { get; set; }
        public decimal? MaxEconomicOrderQty { get; set; }
        public decimal? MinDesiredPackSize { get; set; }
        public decimal? MaxDesiredPackSize { get; set; }
        public decimal? MinAllowedAllergenPercent { get; set; }
        public decimal? MaxAllowedAllergenPercent { get; set; }
        public decimal? MinStdMfgFeesPerUnit { get; set; }
        public decimal? MaxStdMfgFeesPerUnit { get; set; }
        public decimal? MinConversionFactor { get; set; }
        public decimal? MaxConversionFactor { get; set; }
        
        // Date range filters
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public DateTime? UpdatedFrom { get; set; }
        public DateTime? UpdatedTo { get; set; }
        
        // Pagination and sorting
        public string SortBy { get; set; } = "ItemName";
        public bool SortDescending { get; set; } = false;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        
        // Related entity filters
        public string CurrentBuyer { get; set; }
        public string MainProdCentre { get; set; }
        public string FreightOn { get; set; }
    }
}
