using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IExtensionDataRepository
    {
        Task<ExtensionData> GetByIdAsync(int id);
        Task<IEnumerable<ExtensionData>> GetAllAsync();
        Task<IEnumerable<ExtensionData>> GetByEntityTypeAsync(string entityType);
        Task<IEnumerable<ExtensionData>> GetByEntityTypeAndIdAsync(string entityType, int entityTypeId);
        Task<IEnumerable<ExtensionData>> GetActiveAsync();
        Task<int> CreateAsync(ExtensionData entity);
        Task<bool> UpdateAsync(ExtensionData entity);
        Task<bool> DeleteAsync(int id);
    }
}
