using AutoMapper;
using Xcianify.Core.DTOs.ItemOtherDetails;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ItemOtherDetailsMapper : Profile
    {
        public ItemOtherDetailsMapper()
        {
            CreateMap<ItemOtherDetails, ItemOtherDetailsDto>()
                .ForMember(dest => dest.ItemId, opt => opt.MapFrom(src => src.Id));

            CreateMap<CreateItemOtherDetailsDto, ItemOtherDetails>()
                .ForMember(dest => dest.ItemCode, opt => opt.MapFrom(src => src.ItemId.ToString()));

            CreateMap<UpdateItemOtherDetailsDto, ItemOtherDetails>()
                .ForMember(dest => dest.ItemCode, opt => opt.MapFrom(src => src.ItemId.ToString()));
        }
    }
} 