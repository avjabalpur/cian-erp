using System.Collections.Generic;
using System.Threading.Tasks;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.ConfigSetting;

namespace Xcianify.Core.Domain.Repositories
{
    public interface IConfigSettingRepository
    {
        Task<(List<ConfigSetting> Items, int TotalCount)> GetAllAsync(ConfigSettingFilterDto filterDto);
        Task<ConfigSetting> GetByIdAsync(int id);
        Task<ConfigSetting> GetByKeyAsync(string settingKey);
        Task<ConfigSetting> CreateAsync(ConfigSetting configSetting);
        Task UpdateAsync(ConfigSetting configSetting);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(string settingKey, int? excludeId = null);
    }
} 