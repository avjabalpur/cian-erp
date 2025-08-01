using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.Dosage
{
    public class CreateDosageDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(255, ErrorMessage = "Name cannot exceed 255 characters")]
        public string Name { get; set; }

        [StringLength(255, ErrorMessage = "Register date cannot exceed 255 characters")]
        public string RegisterDate { get; set; }

        public bool IsActive { get; set; } = true;
    }
} 