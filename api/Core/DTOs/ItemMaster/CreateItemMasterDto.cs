using System;
using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class CreateItemMasterDto
    {
        [Required(ErrorMessage = "Item code is required")]
        [StringLength(50, ErrorMessage = "Item code cannot be longer than 50 characters")]
        public string ItemCode { get; set; }

        [StringLength(10, ErrorMessage = "Revision number cannot be longer than 10 characters")]
        public string RevNo { get; set; }

        [Required(ErrorMessage = "Item type ID is required")]
        public int ItemTypeId { get; set; }

        public int? SubType { get; set; }

        [StringLength(10, ErrorMessage = "GS indicator cannot be longer than 10 characters")]
        public string GsInd { get; set; }

        //[StringLength(50, ErrorMessage = "Goods type cannot be longer than 50 characters")]
        //public string GoodsType { get; set; }

        [Required(ErrorMessage = "Item name is required")]
        [StringLength(100, ErrorMessage = "Item name cannot be longer than 100 characters")]
        public string ItemName { get; set; }

        [StringLength(50, ErrorMessage = "Short name cannot be longer than 50 characters")]
        public string ShortName { get; set; }

        [StringLength(100, ErrorMessage = "Pharmacopoeia name cannot be longer than 100 characters")]
        public string PharmacopoeiaName { get; set; }

        [StringLength(20, ErrorMessage = "Unit of measure cannot be longer than 20 characters")]
        public string UnitOfMeasure { get; set; }

        [StringLength(20, ErrorMessage = "Issuing unit cannot be longer than 20 characters")]
        public string IssuingUnit { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "UOM ISS conversion factor must be a positive number")]
        public decimal? UomIssConvFactor { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "UOM UQC conversion factor must be a positive number")]
        public decimal? UomUqcConvFactor { get; set; }

        [StringLength(50, ErrorMessage = "Drawing reference cannot be longer than 50 characters")]
        public string DrawingRef { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Standard assay strength must be a positive number")]
        public decimal? StdAssayStrength { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Shelf life months must be a positive number")]
        public int? ShelfLifeMonths { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Shelf life days must be a positive number")]
        public int? ShelfLifeDays { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Standard rate must be a positive number")]
        public decimal? StdRate { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Lead time days must be a positive number")]
        public int? LeadTimeDays { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Standard loss on dry must be a positive number")]
        public decimal? StdLossOnDry { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Safety stock must be a positive number")]
        public int? SafetyStock { get; set; }

        public bool BoughtOut { get; set; }
        public bool JobWork { get; set; }
        public bool Imported { get; set; }

        [StringLength(100, ErrorMessage = "Current buyer cannot be longer than 100 characters")]
        public string CurrentBuyer { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Economic order quantity must be a positive number")]
        public int? EconomicOrderQty { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Desired pack size must be a positive number")]
        public int? DesiredPackSize { get; set; }

        public bool TaxCreditApplicable { get; set; }

        [StringLength(10, ErrorMessage = "Freight on cannot be longer than 10 characters")]
        public string FreightOn { get; set; }

        public bool Manufactured { get; set; }

        [Range(0, 100, ErrorMessage = "Allowed allergen percent must be between 0 and 100")]
        public decimal? AllowedAllergenPercent { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Standard manufacturing fees per unit must be a positive number")]
        public decimal? StdMfgFeesPerUnit { get; set; }

        [StringLength(10, ErrorMessage = "Main production center cannot be longer than 10 characters")]
        public string MainProdCentre { get; set; }

        public bool Sold { get; set; }
        public bool KeyProduct { get; set; }
        public bool Exported { get; set; }

        [StringLength(50, ErrorMessage = "Product type cannot be longer than 50 characters")]
        public string ProductType { get; set; }

        [StringLength(50, ErrorMessage = "Sales division cannot be longer than 50 characters")]
        public string SalesDivision { get; set; }

        [StringLength(50, ErrorMessage = "Product group cannot be longer than 50 characters")]
        public string ProductGroup { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Conversion factor must be a positive number")]
        public decimal? ConversionFactor { get; set; }

        [StringLength(100, ErrorMessage = "Vendor part number cannot be longer than 100 characters")]
        public string VendorPartNo { get; set; }

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

        public CreateItemSpecificationDto? Specification { get; set; }
    }
}
