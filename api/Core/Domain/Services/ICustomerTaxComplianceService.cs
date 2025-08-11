using Xcianify.Core.DTOs.CustomerTaxCompliance;

namespace Xcianify.Core.Domain.Services
{
    public interface ICustomerTaxComplianceService
    {
        Task<List<CustomerTaxComplianceDto>> GetByCustomerIdAsync(int customerId);
        Task<CustomerTaxComplianceDto?> GetByIdAsync(int id);
        Task<CustomerTaxComplianceDto> CreateAsync(CreateCustomerTaxComplianceDto createDto, int currentUserId);
        Task<CustomerTaxComplianceDto> UpdateAsync(int id, UpdateCustomerTaxComplianceDto updateDto, int currentUserId);
        Task<bool> DeleteAsync(int id);
    }
} 