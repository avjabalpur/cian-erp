using System;
using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class CreateSalesOrderDto
    {
        public string SoNumber { get; set; }
        
        public DateTime? SoDate { get; set; }
        
        public string SoStatus { get; set; }
        
        public int? OrganizationId { get; set; }
        
        public int? CustomerId { get; set; }
        
        public string PaymentTerm { get; set; }
        public DateTime? QuotationDate { get; set; }
        public string QuotationNo { get; set; }
        public string HsnCode { get; set; }
        public int? ItemId { get; set; }
        public string DosageName { get; set; }
        public int? DivisionId { get; set; }
        public string DesignUnder { get; set; }
        public string PackingStyleDescription { get; set; }
        public string Composition { get; set; }
        public string PackShort { get; set; }
        public string TabletType { get; set; }
        public string TabletSize { get; set; }
        public string ChangePart { get; set; }
        public string CapsuleSize { get; set; }
        public string ShipperSize { get; set; }
        public string QtyPerShipper { get; set; }
        public string NoOfShipper { get; set; }
        public string Flavour { get; set; }
        public string Fragrance { get; set; }
        public string Quantity { get; set; }
        public string FocQty { get; set; }
        public string Mrp { get; set; }
        public string BillingRate { get; set; }
        public string Costing { get; set; }
        public string InventoryCharges { get; set; }
        public string CylinderCharge { get; set; }
        public string PlateCharges { get; set; }
        public string Domino { get; set; }
        public string Stereo { get; set; }
        public string ShipperDrawingRefCode { get; set; }
        public string CtnOuterDrawingRefNo { get; set; }
        public string CtnInnerDrawingRefNo { get; set; }
        public string FoilDrawingRefNo { get; set; }
        public string LeafletDrawingRefNo { get; set; }
        public string TubeDrawingRefNo { get; set; }
        public string LabelDrawingRefNo { get; set; }
        public string PmOuterCtnStock { get; set; }
        public string PmInnerCtnStock { get; set; }
        public string PmFoilStock { get; set; }
        public string PmLeafletStock { get; set; }
        public string PmTubeStock { get; set; }
        public string PmLabelStock { get; set; }
        public string DrugApprovalUnder { get; set; }
        public string CurrentStatus { get; set; }
        public string Comments { get; set; }
        public bool IsSubmitted { get; set; }
        public int? AssignedDesigner { get; set; }
        public bool? PlantEmailSent { get; set; }
        
        // Additional fields for product info form
        public string ShelfLife { get; set; }
        public string Colour { get; set; }
    }
} 