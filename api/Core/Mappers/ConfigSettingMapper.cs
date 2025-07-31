using AutoMapper;
using Xcianify.Core.DTOs.ConfigSetting;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ConfigSettingMapper : Profile
    {
        public ConfigSettingMapper()
        {
            CreateMap<ConfigSetting, ConfigSettingDto>();
            CreateMap<CreateConfigSettingDto, ConfigSetting>();
            CreateMap<UpdateConfigSettingDto, ConfigSetting>();
        }
    }
} 