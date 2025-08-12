using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xcianify.Core.DTOs.ExtensionData
{
    public class CreateExtensionDataDto
    {
        public string EntityType { get; set; }
        public int EntityTypeId { get; set; }
        public string PropertyKey { get; set; }
        public string PropertyLabel { get; set; }
        public string PropertyDescription { get; set; }
        public string PropertyValue { get; set; }
        public string DataType { get; set; } = "text";
        public int DisplayOrder { get; set; } = 0;
    }
}
