using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class UploadSalesOrderDocumentDto
    {
        [Required]
        public int SalesOrderId { get; set; }
        
        [Required]
        public string Tag { get; set; }
        
        [Required]
        public IFormFile File { get; set; }
    }
}
