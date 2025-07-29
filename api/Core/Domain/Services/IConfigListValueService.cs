using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.ConfigList;
using Xcianify.Core.DTOs;

namespace Xcianify.Core.Domain.Services
{
    public interface IConfigListValueService
    {
        Task<PaginatedResult<ConfigListValueDto>> GetAllAsync(ConfigListValueFilterDto filter);
        Task<ConfigListValueDto?> GetByIdAsync(int id);
        Task<List<ConfigListValueDto>> GetByListIdAsync(int listId);
        Task<ConfigListValueDto> CreateAsync(CreateConfigListValueDto createDto);
        Task<ConfigListValueDto> UpdateAsync(int id, UpdateConfigListValueDto updateDto);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsByCodeAsync(int listId, string valueCode, int? excludeId = null);
    }
}
