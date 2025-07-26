using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class CreateSalesOrderSaveTransactionDto
    {
        [Required]
        public int SalesOrderId { get; set; }
        
        public string Diff { get; set; }
    }
} 