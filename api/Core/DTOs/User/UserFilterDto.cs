
namespace Xcianify.Core.DTOs.User
{
    public class UserFilterDto : BaseFilterDto
    {
        public string? Department { get; set; }
        public string? Designation { get; set; }
        public bool? IsActive { get; set; }
        public string? Gender { get; set; }
    }
}
