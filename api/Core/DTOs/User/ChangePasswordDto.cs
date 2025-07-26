using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.User
{
    public class ChangePasswordDto
    {
        public int UserId { get; set; }

        [StringLength(100, MinimumLength = 8)]
        public string CurrentPassword { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string NewPassword { get; set; }

        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmNewPassword { get; set; }
    }
}
