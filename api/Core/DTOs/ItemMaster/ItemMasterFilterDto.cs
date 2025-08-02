using System;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class ItemMasterFilterDto : BaseFilterDto
    {
        public string? ItemCode { get; set; }
        public string? ItemName { get; set; }
        public int? ItemTypeId { get; set; }
        
        // Pagination and sorting
        public string? SortBy { get; set; } = "ItemName";
        public bool? SortDescending { get; set; } = false;
    }
}
