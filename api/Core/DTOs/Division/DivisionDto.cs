namespace Xcianify.Core.DTOs.Division
{
    public class DivisionDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public int? DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Unit { get; set; }
        public decimal ConversionFactor { get; set; }
        public bool IsActive { get; set; }
    }
}
