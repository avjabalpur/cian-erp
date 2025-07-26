using System.Threading.Tasks;
using Xcianify.Core.DTOs.Organization;

namespace Xcianify.Core.Domain.Services
{
    public interface IOrganizationService
    {
        Task<PaginatedOrganizationResultDto> GetOrganizationsAsync(OrganizationFilterDto filter);
        Task<OrganizationDto> GetOrganizationByIdAsync(int id);
        Task<OrganizationDto> GetOrganizationByCodeAsync(string code);
        Task<OrganizationDto> CreateOrganizationAsync(CreateOrganizationDto dto);
        Task UpdateOrganizationAsync(UpdateOrganizationDto dto);
        Task DeleteOrganizationAsync(int id);
    }
}
