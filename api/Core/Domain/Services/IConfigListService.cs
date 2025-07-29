using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xcianify.Core.DTOs.ConfigList;
using Xcianify.Core.DTOs;

namespace Xcianify.Core.Domain.Services
{
    public interface IConfigListService
    {
        Task<PaginatedResult<ConfigListDto>> GetAllAsync(ConfigListFilterDto filter);
        Task<ConfigListDto?> GetByIdAsync(int id);
        Task<ConfigListDto?> GetByCodeAsync(string listCode);
        Task<ConfigListDto> CreateAsync(CreateConfigListDto createDto);
        Task<ConfigListDto> UpdateAsync(int id, UpdateConfigListDto updateDto);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsByCodeAsync(string listCode, int? excludeId = null);
    }
}
