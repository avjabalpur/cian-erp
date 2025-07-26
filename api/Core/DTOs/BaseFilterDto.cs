namespace Xcianify.Core.DTOs
{
    public class BaseFilterDto : PaginationDto
    {
        public string? Search { get; set; }
        public string? Status { get; set; }
    }
}
