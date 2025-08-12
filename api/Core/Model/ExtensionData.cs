using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xcianify.Core.Model
{
    public class ExtensionData
    {
        public int Id { get; set; }
        public string EntityType { get; set; } // 'item', 'customer', 'supplier', etc.
        public int EntityTypeId { get; set; }  // Foreign key to actual entity
        public string PropertyKey { get; set; }
        public string PropertyLabel { get; set; }
        public string PropertyDescription { get; set; }
        public string PropertyValue { get; set; } // Store as string for flexibility
        public string DataType { get; set; } = "text"; // Default value
        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        public int? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
