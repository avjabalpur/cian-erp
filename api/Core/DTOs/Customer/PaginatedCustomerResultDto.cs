using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.Customer;

namespace Xcianify.Core.DTOs
{
    public class PaginatedCustomerResultDto : PaginatedResult<CustomerDto>
    {
        public Dictionary<string, int> CustomerTypeCounts { get; set; }
        public Dictionary<string, int> RegionCounts { get; set; }
        public int TotalCustomerTypes { get; set; }
        public int TotalRegions { get; set; }
    }
}
