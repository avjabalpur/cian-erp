using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xcianify.Core.Model
{
    public class ItemStockAnalysis : BaseModel
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string? AbcConsumptionValue { get; set; } // character(1)
        public string? XyzStockValue { get; set; }       // character(1)
        public string? FsnMovement { get; set; }         // character(1)
        public string? VedAnalysis { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
    }

}

