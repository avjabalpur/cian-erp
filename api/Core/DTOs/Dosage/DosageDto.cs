using System;

namespace Xcianify.Core.DTOs.Dosage
{
    public class DosageDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string RegisterDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
    }
} 