using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerTaxCompliance;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ICustomerTaxComplianceRepository
    {
        Task<List<CustomerTaxCompliance>> GetByCustomerIdAsync(int customerId);
        Task<CustomerTaxCompliance?> GetByIdAsync(int id);
        Task<CustomerTaxCompliance> CreateAsync(CustomerTaxCompliance customerTaxCompliance);
        Task<CustomerTaxCompliance> UpdateAsync(CustomerTaxCompliance customerTaxCompliance);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
} 