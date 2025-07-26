using System;
using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class ItemMasterDto
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string ItemId { get; set; }
        
        [StringLength(10)]
        public string RevNo { get; set; }
        
        [Required]
        public int ItemTypeId { get; set; }
        
        [StringLength(50)]
        public string SubType { get; set; }
        
        [StringLength(10)]
        public string GsInd { get; set; }
        
        [StringLength(50)]
        public string GoodsType { get; set; }
        
        [Required]
        [StringLength(100)]
        public string ItemName { get; set; }
        
        [StringLength(50)]
        public string ShortName { get; set; }
        
        [StringLength(100)]
        public string PharmacopoeiaName { get; set; }
        
        [StringLength(20)]
        public string UnitOfMeasure { get; set; }
        
        [StringLength(20)]
        public string IssuingUnit { get; set; }
        
        public decimal? UomIssConvFactor { get; set; }
        public decimal? UomUqcConvFactor { get; set; }
        
        [StringLength(50)]
        public string DrawingRef { get; set; }
        
        [StringLength(100)]
        public string StdAssayStrength { get; set; }
        
        public int? ShelfLifeMonths { get; set; }
        public int? ShelfLifeDays { get; set; }
        public decimal? StdRate { get; set; }
        public int? LeadTimeDays { get; set; }
        public decimal? StdLossOnDry { get; set; }
        public decimal? SafetyStock { get; set; }
        public bool BoughtOut { get; set; }
        public bool JobWork { get; set; }
        public bool Imported { get; set; }
        
        [StringLength(100)]
        public string CurrentBuyer { get; set; }
        
        public decimal? EconomicOrderQty { get; set; }
        public decimal? DesiredPackSize { get; set; }
        public bool TaxCreditApplicable { get; set; }
        
        [StringLength(10)]
        public string FreightOn { get; set; }
        
        public bool Manufactured { get; set; }
        public decimal? AllowedAllergenPercent { get; set; }
        public decimal? StdMfgFeesPerUnit { get; set; }
        
        [StringLength(10)]
        public string MainProdCentre { get; set; }
        
        public bool Sold { get; set; }
        public bool KeyProduct { get; set; }
        public bool Exported { get; set; }
        
        [StringLength(50)]
        public string ProductType { get; set; }
        
        [StringLength(50)]
        public string SalesDivision { get; set; }
        
        [StringLength(50)]
        public string ProductGroup { get; set; }
        
        public decimal? ConversionFactor { get; set; }
        
        [StringLength(100)]
        public string VendorPartNo { get; set; }
        
        public bool BatchNotApplicable { get; set; }
        public bool QcRequired { get; set; }
        
        [StringLength(100)]
        public string Allergen { get; set; }
        
        public bool MfgDateApplicable { get; set; }
        public bool ExpiryDateApplicable { get; set; }
        public bool TrackSerialNos { get; set; }
        
        [StringLength(10)]
        public string PackingFreightInsuranceServices { get; set; }
        
        [StringLength(100)]
        public string ActiveIngredient { get; set; }
        
        public bool MfgLocNameRequired { get; set; }
        public bool MfgMmYyyyApplicable { get; set; }
        public bool ExpiryMmYyyyApplicable { get; set; }
        public bool PrincipalForStatutoryReporting { get; set; }
        
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        
        public virtual ItemSpecificationDto Specification { get; set; }
    }
}
