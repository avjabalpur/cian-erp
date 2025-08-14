using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xcianify.Core.DTOs.ExtensionData
{
    public class UpdateExtensionDataDto
    {
        public int Id { get; set; }
        public string PropertyKey { get; set; }
        public string PropertyLabel { get; set; }
        public string? PropertyDescription { get; set; }
        public string? PropertyValue { get; set; }
        public string? DataType { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
    }
}
