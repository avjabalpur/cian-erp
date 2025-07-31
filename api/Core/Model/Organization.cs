using System.ComponentModel.DataAnnotations;

namespace Core.Model;

public class Organization
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(10)]
    public string Code { get; set; } = string.Empty;
    
    [Required]
    public int LocationTypeId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? ContactPerson { get; set; }
    
    [MaxLength(100)]
    public string? Address1 { get; set; }
    
    [MaxLength(100)]
    public string? Address2 { get; set; }
    
    [MaxLength(50)]
    public string? City { get; set; }
    
    [MaxLength(50)]
    public string? State { get; set; }
    
    [MaxLength(50)]
    public string? Country { get; set; }
    
    [MaxLength(10)]
    public string? Zip { get; set; }
    
    [MaxLength(15)]
    public string? Phone { get; set; }
    
    [MaxLength(100)]
    public string? Email { get; set; }
    
    [MaxLength(100)]
    public string? Website { get; set; }
    
    [MaxLength(50)]
    public string? GstinNumber { get; set; }
    
    [MaxLength(50)]
    public string? TdsCycle { get; set; }
    
    [MaxLength(50)]
    public string? EmploymentStatusCode { get; set; }
    
    [MaxLength(50)]
    public string? EsiOfficeCode { get; set; }
    
    [MaxLength(50)]
    public string? ExcReginCode { get; set; }
    
    [MaxLength(50)]
    public string? StRegnCode { get; set; }
    
    [MaxLength(50)]
    public string? CinNumber { get; set; }
    
    [MaxLength(50)]
    public string? InterfaceCode { get; set; }
    
    [MaxLength(50)]
    public string? LicenseNumber { get; set; }
    
    [MaxLength(50)]
    public string? EccNumber { get; set; }
    
    [MaxLength(50)]
    public string? Range { get; set; }
    
    [MaxLength(50)]
    public string? Division { get; set; }
    
    [MaxLength(50)]
    public string? Collectorate { get; set; }
    
    [MaxLength(50)]
    public string? DrugLicenseNumber1 { get; set; }
    
    [MaxLength(50)]
    public string? DrugLicenseNumber2 { get; set; }
    
    [MaxLength(50)]
    public string? FoodLicenseNumber { get; set; }
    
    [MaxLength(50)]
    public string? CstRegnNumber { get; set; }
    
    [MaxLength(50)]
    public string? VatTinNumber { get; set; }
    
    [MaxLength(10)]
    public string? PanNumber { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public int? CreatedBy { get; set; }
    
    public int? UpdatedBy { get; set; }
}
