using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.SalesOrder
{
    public class CreateSalesOrderDocumentDto
    {
        [Required]
        public int SalesOrderId { get; set; }
        
        public string Tag { get; set; }
        
        [Required]
        public string FileName { get; set; }
        
        [Required]
        public string FilePath { get; set; }
        
        public string FileType { get; set; }
        
        public string Metadata { get; set; }
    }
} 