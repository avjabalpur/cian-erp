namespace Xcianify.Core.DTOs.Department
{
    public class DepartmentDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string UomForMis { get; set; }
        public bool IsActive { get; set; }
    }
}
