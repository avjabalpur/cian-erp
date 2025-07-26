namespace Xcianify.Core.DTOs
{
    public class CustomerFilterDto : BaseFilterDto
    {

        public string? CustName { get; set; }
        public string? ShortName { get; set; }
        public string? CustTypeCode { get; set; }
        public string? Country { get; set; }
        public string? Continent { get; set; }
        public string? City { get; set; }
    }
}
