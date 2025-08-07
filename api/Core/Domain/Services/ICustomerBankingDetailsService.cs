using Xcianify.Core.DTOs.CustomerBankingDetails;

namespace Xcianify.Core.Domain.Services
{
    public interface ICustomerBankingDetailsService
    {
        Task<List<CustomerBankingDetailsDto>> GetByCustomerIdAsync(int customerId);
        Task<CustomerBankingDetailsDto?> GetByIdAsync(int id);
        Task<CustomerBankingDetailsDto> CreateAsync(CreateCustomerBankingDetailsDto createDto, int currentUserId);
        Task<CustomerBankingDetailsDto> UpdateAsync(int id, UpdateCustomerBankingDetailsDto updateDto, int currentUserId);
        Task<bool> DeleteAsync(int id);
    }
} 