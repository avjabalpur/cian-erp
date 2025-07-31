using System;

namespace Xcianify.Core.Model
{
    public class LocationType : BaseModel
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}
