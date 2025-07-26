using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xcianify.Core.Model
{
    public class HsnMaster : BaseModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string HsnType { get; set; }
        public string Uqc { get; set; }
        public decimal IgstRate { get; set; } = 0.00m;
        public decimal CgstRate { get; set; } = 0.00m;
        public decimal SgstRate { get; set; } = 0.00m;
        public decimal CessRate { get; set; } = 0.00m;
        public bool IsReverseCharges { get; set; } = false;
    }
}
