using System;
using System.ComponentModel.DataAnnotations;
using Xcianify.Core.DTOs.ItemExportDetails;
using Xcianify.Core.DTOs.ItemOtherDetails;
using Xcianify.Core.DTOs.ItemMedia;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class CreateItemMasterDto
    {
        [Required(ErrorMessage = "Item code is required")]
        [StringLength(50, ErrorMessage = "Item code cannot be longer than 50 characters")]
        public string ItemCode { get; set; }

        public string? RevNo { get; set; }

        public int ItemTypeId { get; set; }

        public int? SubType { get; set; }

        public string? GsInd { get; set; }

        //[StringLength(50, ErrorMessage = "Goods type cannot be longer than 50 characters")]
        //public string GoodsType { get; set; }

        [Required(ErrorMessage = "Item name is required")]
        [StringLength(100, ErrorMessage = "Item name cannot be longer than 100 characters")]
        public string ItemName { get; set; }

        public string? ShortName { get; set; }

        public string? PharmacopoeiaName { get; set; }

        public string? UnitOfMeasure { get; set; }

        public string? IssuingUnit { get; set; }

        public decimal? UomIssConvFactor { get; set; }

        public decimal? UomUqcConvFactor { get; set; }

        public string? DrawingRef { get; set; }

        public decimal? StdAssayStrength { get; set; }

        public int? ShelfLifeMonths { get; set; }
        public int? ShelfLifeDays { get; set; }

        public decimal? StdRate { get; set; }

        public int? LeadTimeDays { get; set; }

        public decimal? StdLossOnDry { get; set; }

        public int? SafetyStock { get; set; }

        public bool BoughtOut { get; set; }
        public bool JobWork { get; set; }
        public bool Imported { get; set; }

        public string? CurrentBuyer { get; set; }

        public int? EconomicOrderQty { get; set; }

        public int? DesiredPackSize { get; set; }

        public bool TaxCreditApplicable { get; set; }

        public string? FreightOn { get; set; }

        public bool Manufactured { get; set; }

        public decimal? AllowedAllergenPercent { get; set; }

        public decimal? StdMfgFeesPerUnit { get; set; }

        public string? MainProdCentre { get; set; }

        public bool Sold { get; set; }
        public bool KeyProduct { get; set; }
        public bool Exported { get; set; }

        public string? ProductType { get; set; }

        public string? SalesDivision { get; set; }

        public string? ProductGroup { get; set; }

        public decimal? ConversionFactor { get; set; }

        public string? VendorPartNo { get; set; }

        public bool BatchNotApplicable { get; set; }
        public bool QcRequired { get; set; }

        public bool Allergen { get; set; }

        public bool MfgDateApplicable { get; set; }
        public bool ExpiryDateApplicable { get; set; }
        public bool TrackSerialNos { get; set; }

        public bool PackingFreightInsuranceServices { get; set; }

        public bool ActiveIngredient { get; set; }

        public bool MfgLocNameRequired { get; set; }
        public bool MfgMmYyyyApplicable { get; set; }
        public bool ExpiryMmYyyyApplicable { get; set; }
        public bool PrincipalForStatutoryReporting { get; set; }

        // Related data properties
        public CreateItemSpecificationDto? Specification { get; set; }
        public CreateItemSalesDetailDto? SalesDetail { get; set; }
        public CreateItemExportDetailsDto? ExportDetails { get; set; }
        public CreateItemStockAnalysisDto? StockAnalysis { get; set; }
        public CreateItemBoughtOutDetailsDto? BoughtOutDetails { get; set; }
        public CreateItemOtherDetailsDto? OtherDetails { get; set; }
        public CreateItemMediaDto? Media { get; set; }
    }
}
