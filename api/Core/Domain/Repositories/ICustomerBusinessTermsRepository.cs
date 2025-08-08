using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerBusinessTerms;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ICustomerBusinessTermsRepository
    {
        Task<List<CustomerBusinessTerms>> GetByCustomerIdAsync(int customerId);
        Task<CustomerBusinessTerms?> GetByIdAsync(int id);
        Task<CustomerBusinessTerms> CreateAsync(CustomerBusinessTerms customerBusinessTerms);
        Task<CustomerBusinessTerms> UpdateAsync(CustomerBusinessTerms customerBusinessTerms);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
} 