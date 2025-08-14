using Xcianify.Core.DTOs.CustomerType;

namespace Xcianify.Core.Domain.Services
{
    public interface ICustomerTypeService
    {
        Task<(List<CustomerTypeDto> items, int totalCount)> GetAllCustomerTypesAsync(CustomerTypeFilterDto filter);
        Task<CustomerTypeDto?> GetCustomerTypeByIdAsync(int id);
        Task<CustomerTypeDto?> GetCustomerTypeByCodeAsync(string code);
        Task<CustomerTypeDto> CreateCustomerTypeAsync(CreateCustomerTypeDto createDto, int currentUserId);
        Task<CustomerTypeDto> UpdateCustomerTypeAsync(int id, UpdateCustomerTypeDto updateDto, int currentUserId);
        Task<bool> DeleteCustomerTypeAsync(int id);
    }
} 