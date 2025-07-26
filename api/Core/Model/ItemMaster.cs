using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xcianify.Core.Model
{
    public class ItemMaster : BaseModel
    {
        public int Id { get; set; }

        public string ItemCode { get; set; }

        public string RevNo { get; set; }

        public int? ItemTypeId { get; set; }

        public string SubType { get; set; }

        public string GsInd { get; set; }

        public string GoodsType { get; set; }

        public string ItemName { get; set; }

        public string ShortName { get; set; }
        public string PharmacopoeiaName { get; set; }

        public string UnitOfMeasure { get; set; }

        public string IssuingUnit { get; set; }

        public decimal? UomIssConvFactor { get; set; }

        public decimal? UomUqcConvFactor { get; set; }

        public string DrawingRef { get; set; }

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

        public string CurrentBuyer { get; set; }

        public decimal? EconomicOrderQty { get; set; }

        public decimal? DesiredPackSize { get; set; }

        public bool TaxCreditApplicable { get; set; }

        public bool FreightOn { get; set; }

        public bool Manufactured { get; set; }

        public decimal? AllowedAllergenPercent { get; set; }

        public decimal? StdMfgFeesPerUnit { get; set; }

        public string MainProdCentre { get; set; }

        public bool Sold { get; set; }

        public bool KeyProduct { get; set; }

        public bool Exported { get; set; }

        public string ProductType { get; set; }

        public string SalesDivision { get; set; }

        public string ProductGroup { get; set; }

        public decimal? ConversionFactor { get; set; }

        public string VendorPartNo { get; set; }

        public bool BatchNotApplicable { get; set; }

        public bool QcRequired { get; set; }

        public string Allergen { get; set; }

        public bool MfgDateApplicable { get; set; }

        public bool ExpiryDateApplicable { get; set; }

        public bool TrackSerialNos { get; set; }

        public string PackingFreightInsuranceServices { get; set; }

        public string ActiveIngredient { get; set; }

        public bool MfgLocNameRequired { get; set; }

        public bool MfgMmYyyyApplicable { get; set; }

        public bool ExpiryMmYyyyApplicable { get; set; }

        public bool PrincipalForStatutoryReporting { get; set; }

        public DateTime CreatedOn { get; set; }

    }
}
