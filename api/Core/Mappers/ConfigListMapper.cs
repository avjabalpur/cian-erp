using AutoMapper;
using Xcianify.Core.Model;
using Xcianify.Core.DTOs.ConfigList;

namespace Xcianify.Core.Mappers
{
    public class ConfigListMapper : Profile
    {
        public ConfigListMapper()
        {
            CreateMap<ConfigList, ConfigListDto>();
            CreateMap<CreateConfigListDto, ConfigList>();
            CreateMap<UpdateConfigListDto, ConfigList>();
        }
    }
} 