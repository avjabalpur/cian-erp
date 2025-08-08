using AutoMapper;
using Xcianify.Core.DTOs.ItemMedia;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ItemMediaMapper : Profile
    {
        public ItemMediaMapper()
        {
            CreateMap<ItemMedia, ItemMediaDto>();

            CreateMap<CreateItemMediaDto, ItemMedia>()
                .ForMember(dest => dest.File, opt => opt.Ignore());

            CreateMap<UpdateItemMediaDto, ItemMedia>()
                .ForMember(dest => dest.File, opt => opt.Ignore());
        }
    }
} 