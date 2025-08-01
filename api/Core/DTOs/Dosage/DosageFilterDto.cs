using Xcianify.Core.DTOs;

namespace Xcianify.Core.DTOs.Dosage
{
    public class DosageFilterDto : BaseFilterDto
    {
        public string Name { get; set; }
        public bool? IsActive { get; set; }
    }
} 