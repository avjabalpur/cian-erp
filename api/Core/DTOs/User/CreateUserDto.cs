using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.User
{
    public class CreateUserDto
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; }

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        public string LastName { get; set; }

        public string? EmployeeId { get; set; }

        [Phone]
        [StringLength(15)]
        public string? Phone { get; set; }

        [DataType(DataType.Date)]
        public DateTime? Dob { get; set; }

        [StringLength(1)]
        public string? Gender { get; set; }

        [StringLength(50)]
        public string? Department { get; set; }
            
        [StringLength(50)]
        public string? Designation { get; set; }

        public int? ReportingManagerId { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsEmailVerified { get; set; } = false;
        public bool IsPhoneVerified { get; set; } = false;
    }
}
