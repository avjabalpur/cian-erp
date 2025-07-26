using System;

namespace Xcianify.Core.Model
{
    public class Permission : BaseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ModuleName { get; set; }
        public string ActionType { get; set; }
    }
}
