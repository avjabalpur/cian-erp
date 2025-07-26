using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xcianify.Core.Model
{
    public class UnitOfMeasure : BaseModel
    {
        public int Id { get; set; }

        public string UomCode { get; set; }

        public string UomName { get; set; }

        public decimal ConversionFactor { get; set; } = 1.0m;
    }
}
