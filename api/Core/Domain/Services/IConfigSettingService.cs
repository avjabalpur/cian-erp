using System.Threading.Tasks;
using Xcianify.Core.DTOs.ConfigSetting;

namespace Xcianify.Core.Domain.Services
{
    public interface IConfigSettingService
    {
        Task<PaginatedConfigSettingResultDto> GetConfigSettingsAsync(ConfigSettingFilterDto filter);
        Task<ConfigSettingDto> GetConfigSettingByIdAsync(int id);
        Task<ConfigSettingDto> GetConfigSettingByKeyAsync(string settingKey);
        Task<ConfigSettingDto> CreateConfigSettingAsync(CreateConfigSettingDto dto);
        Task UpdateConfigSettingAsync(UpdateConfigSettingDto dto);
        Task DeleteConfigSettingAsync(int id);
    }
} 