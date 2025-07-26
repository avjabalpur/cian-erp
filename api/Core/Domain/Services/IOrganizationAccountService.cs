using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.Organization;

namespace Xcianify.Core.Domain.Services
{
    public interface IOrganizationAccountService
    {
        Task<IEnumerable<OrganizationAccountDto>> GetOrganizationAccountsAsync(int organizationId);
        Task<OrganizationAccountDto> GetOrganizationAccountByIdAsync(int id);
        Task<OrganizationAccountDto> CreateOrganizationAccountAsync(CreateOrganizationAccountDto dto);
        Task UpdateOrganizationAccountAsync(UpdateOrganizationAccountDto dto);
        Task DeleteOrganizationAccountAsync(int id);
    }
}
