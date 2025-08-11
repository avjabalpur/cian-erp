using Xcianify.Core.Model;
using Xcianify.Core.DTOs.CustomerBankingDetails;

namespace Xcianify.Core.Domain.Repositories
{
    public interface ICustomerBankingDetailsRepository
    {
        Task<List<CustomerBankingDetails>> GetByCustomerIdAsync(int customerId);
        Task<CustomerBankingDetails?> GetByIdAsync(int id);
        Task<CustomerBankingDetails> CreateAsync(CustomerBankingDetails customerBankingDetails);
        Task<CustomerBankingDetails> UpdateAsync(CustomerBankingDetails customerBankingDetails);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
} 