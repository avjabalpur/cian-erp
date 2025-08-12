using System;
using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.ItemOtherDetails
{
    public class CreateItemOtherDetailsDto
    {
        [Required]
        public int ItemId { get; set; }
        public string PackShort { get; set; }
        public string ProductCast { get; set; }
        public string PvcColor { get; set; }
        public string Color { get; set; }
        public string Flavour { get; set; }
        public string Fragrance { get; set; }
        public string Form { get; set; }
        public string PackagingStyle { get; set; }
        public string ChangePart { get; set; }
        public string Size { get; set; }
        public bool? WithLeaflet { get; set; }
        public bool? WithApplicator { get; set; }
        public bool? WithWad { get; set; }
        public bool? WithSilica { get; set; }
        public bool? WithCotton { get; set; }
        public bool? WithMeasuringCap { get; set; }
        public bool? WithSpoon { get; set; }
        public string PackingNp { get; set; }
        public int? PackingNpQty { get; set; }
        public string PackingStylePtd { get; set; }
        public int? PackingStylePtdQty { get; set; }
        public string NotePerStrip { get; set; }
        public string PackShortPtdSpec { get; set; }
        public string PackShortPtdSize { get; set; }
        public int? PackShortPtdQty { get; set; }
        public string PackingStyleNpSize { get; set; }
        public int? PackingStyleNpQty { get; set; }
        public string NoteForCtn { get; set; }
        public string OuterSize { get; set; }
        public int? OuterQty { get; set; }
        public string Shrink { get; set; }
        public string ShrinkPacking { get; set; }
        public string ShipperSize { get; set; }
        public int? QtyPerShipper { get; set; }
        public string ShipperNote { get; set; }
    }
}
