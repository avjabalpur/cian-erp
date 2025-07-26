using System;

namespace Xcianify.Core.Model
{
    public class Role : BaseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}