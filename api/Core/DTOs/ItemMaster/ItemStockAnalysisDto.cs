using System;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class ItemStockAnalysisDto
    {
        public int Id { get; set; }
               // character(1)
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
    }

    public class CreateItemStockAnalysisDto
    {
        public int ItemId { get; set; }
        public string? AbcConsumptionValue { get; set; } // character(1)
        public string? XyzStockValue { get; set; }       // character(1)
        public string? FsnMovement { get; set; }         // character(1)
        public string? VedAnalysis { get; set; }
        public bool IsActive { get; set; } = true;



    }

    public class UpdateItemStockAnalysisDto
    {
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
    }// character(1)

}

