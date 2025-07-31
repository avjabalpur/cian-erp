using System;

namespace Xcianify.Core.DTOs.Organization
{
    public class LocationTypeDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateLocationTypeDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateLocationTypeDto
    {
        public int? Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }
}
