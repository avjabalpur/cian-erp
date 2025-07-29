using AutoMapper;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.ConfigList;

namespace Xcianify.Core.Mappers
{
    public class ConfigListValueMapper : Profile
    {
        public ConfigListValueMapper()
        {
            CreateMap<ConfigListValue, ConfigListValueDto>();
            CreateMap<CreateConfigListValueDto, ConfigListValue>();
            CreateMap<UpdateConfigListValueDto, ConfigListValue>();
        }
    }
} 