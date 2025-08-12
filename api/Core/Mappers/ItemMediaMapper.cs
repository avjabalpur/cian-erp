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
               .ForSourceMember(src => src.File, opt => opt.DoNotValidate());

            CreateMap<UpdateItemMediaDto, ItemMedia>()
               .ForSourceMember(src => src.File, opt => opt.DoNotValidate());
        }
    }
} 