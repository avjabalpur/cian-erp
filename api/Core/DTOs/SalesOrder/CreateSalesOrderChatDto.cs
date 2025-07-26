using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class CreateSalesOrderChatDto
    {
        [Required]
        public int SalesOrderId { get; set; }
        
        [Required]
        [MinLength(1, ErrorMessage = "Comment cannot be empty")]
        public string Comment { get; set; }
    }
} 