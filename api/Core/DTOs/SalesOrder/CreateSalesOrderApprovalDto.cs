using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class CreateSalesOrderApprovalDto
    {
        [Required]
        public string SoStatus { get; set; }
        
        [Required]
        public string DosageName { get; set; }
    }
} 