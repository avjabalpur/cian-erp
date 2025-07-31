using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.Organization;
using Core.Model;
using Core.DTOs.Organization;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IOrganizationRepository
    {
        Task<(List<Organization> Items, int TotalCount)> GetAllAsync(OrganizationFilterDto filterDto);
        Task<Organization> GetByIdAsync(int id);
        Task<Organization> GetByCodeAsync(string code);
        Task<Organization> CreateAsync(Organization organization);
        Task UpdateAsync(Organization organization);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(string code, int? excludeId = null);
    }
}
