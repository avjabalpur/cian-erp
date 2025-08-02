using AutoMapper;
using Xcianify.Core.DTOs.ItemMedia;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ItemMediaMapper : Profile
    {
        public ItemMediaMapper()
        {
            CreateMap<ItemMedia, ItemMediaDto>()
                .ForMember(dest => dest.ItemId, opt => opt.MapFrom(src => src.Id));

            CreateMap<CreateItemMediaDto, ItemMedia>()
                .ForMember(dest => dest.ItemCode, opt => opt.MapFrom(src => src.ItemId.ToString()));

            CreateMap<UpdateItemMediaDto, ItemMedia>()
                .ForMember(dest => dest.ItemCode, opt => opt.MapFrom(src => src.ItemId.ToString()));
        }
    }
} 