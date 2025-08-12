using AutoMapper;
using Xcianify.Core.DTOs.ExtensionData;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ExtensionDataMapper : Profile
    {
        public ExtensionDataMapper()
        {
            CreateMap<ExtensionData, ExtensionDataDto>();
            CreateMap<CreateExtensionDataDto, ExtensionData>();
            CreateMap<UpdateExtensionDataDto, ExtensionData>();
        }
    }
}
