using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.Organization;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IOrganizationRepository
    {
        Task<Organization> GetByIdAsync(int id);
        Task<Organization> GetByCodeAsync(string code);
        Task<IEnumerable<Organization>> GetAllAsync(OrganizationFilterDto filter);
        Task<int> GetCountAsync(OrganizationFilterDto filter);
        Task<Organization> CreateAsync(Organization organization);
        Task UpdateAsync(Organization organization);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(string code, int? excludeId = null);
    }
}
