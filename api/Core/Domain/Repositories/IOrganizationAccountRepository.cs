using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IOrganizationAccountRepository
    {
        Task<OrganizationAccount> GetByIdAsync(int id);
        Task<IEnumerable<OrganizationAccount>> GetByOrganizationIdAsync(int organizationId);
        Task<OrganizationAccount> CreateAsync(OrganizationAccount account);
        Task UpdateAsync(OrganizationAccount account);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int organizationId, string accountNumber, int? excludeId = null);
    }
}
