using Xcianify.Core.DTOs.CustomerBusinessTerms;

namespace Xcianify.Core.Domain.Services
{
    public interface ICustomerBusinessTermsService
    {
        Task<List<CustomerBusinessTermsDto>> GetByCustomerIdAsync(int customerId);
        Task<CustomerBusinessTermsDto?> GetByIdAsync(int id);
        Task<CustomerBusinessTermsDto> CreateAsync(CreateCustomerBusinessTermsDto createDto, int currentUserId);
        Task<CustomerBusinessTermsDto> UpdateAsync(int id, UpdateCustomerBusinessTermsDto updateDto, int currentUserId);
        Task<bool> DeleteAsync(int id);
    }
} 