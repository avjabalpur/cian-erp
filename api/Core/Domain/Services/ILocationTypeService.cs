using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.Organization;

namespace Xcianify.Core.Domain.Services
{
    public interface ILocationTypeService
    {
        Task<IEnumerable<LocationTypeDto>> GetAllLocationTypesAsync();
        Task<LocationTypeDto> GetLocationTypeByIdAsync(int id);
        Task<LocationTypeDto> CreateLocationTypeAsync(CreateLocationTypeDto dto);
        Task UpdateLocationTypeAsync(UpdateLocationTypeDto dto);
        Task DeleteLocationTypeAsync(int id);
    }
}
