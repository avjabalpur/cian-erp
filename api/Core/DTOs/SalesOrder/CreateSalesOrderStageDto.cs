using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class CreateSalesOrderStageDto
    {
        [Required]
        public int SalesOrderId { get; set; }
        
        [Required]
        public string StageName { get; set; }
        
        public bool IsApproved { get; set; } = false;
    }
} 