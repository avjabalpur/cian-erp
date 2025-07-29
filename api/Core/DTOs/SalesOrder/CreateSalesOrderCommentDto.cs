using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class CreateSalesOrderCommentDto
    {
        [Required]
        public int SalesOrderId { get; set; }
        
        [Required]
        [MinLength(1, ErrorMessage = "Comment cannot be empty")]
        public string Comments { get; set; }
        
        public string? Status { get; set; }
        public string? Type { get; set; }
    }
} 