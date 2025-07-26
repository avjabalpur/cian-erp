using System.ComponentModel.DataAnnotations;

namespace Xcianify.Core.DTOs.User
{
    public class UserLoginDto
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}
