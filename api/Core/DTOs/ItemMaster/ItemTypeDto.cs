using System;

namespace Xcianify.Core.DTOs.ItemMaster
{
    public class ItemTypeDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ParentTypeId { get; set; }
        public string ParentTypeName { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
    }

    public class CreateItemTypeDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ParentTypeId { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateItemTypeDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ParentTypeId { get; set; }
        public bool? IsActive { get; set; }
    }

    public class ItemTypeFilterDto : BaseFilterDto
    {
        public string SearchTerm { get; set; }
        public bool? IsActive { get; set; }
    }
}
