using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.ExtensionData;

namespace Xcianify.Core.Domain.Services
{
    public interface IExtensionDataService
    {
        Task<ExtensionDataDto> GetByIdAsync(int id);
        Task<IEnumerable<ExtensionDataDto>> GetAllAsync();
        Task<IEnumerable<ExtensionDataDto>> GetByEntityTypeAsync(string entityType);
        Task<IEnumerable<ExtensionDataDto>> GetByEntityTypeAndIdAsync(string entityType, int entityTypeId);
        Task<IEnumerable<ExtensionDataDto>> GetActiveAsync();
        Task<ExtensionDataDto> CreateAsync(CreateExtensionDataDto createDto, int userId);
        Task<ExtensionDataDto> UpdateAsync(int id, UpdateExtensionDataDto updateDto, int userId);
        Task<bool> DeleteAsync(int id);
    }
}
