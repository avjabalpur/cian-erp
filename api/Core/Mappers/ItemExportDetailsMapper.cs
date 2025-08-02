using AutoMapper;
using Xcianify.Core.DTOs.ItemExportDetails;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ItemExportDetailsMapper : Profile
    {
        public ItemExportDetailsMapper()
        {
            CreateMap<ItemExportDetails, ItemExportDetailsDto>()
                .ForMember(dest => dest.ItemId, opt => opt.MapFrom(src => src.Id));

            CreateMap<CreateItemExportDetailsDto, ItemExportDetails>()
                .ForMember(dest => dest.ItemCode, opt => opt.MapFrom(src => src.ItemId.ToString()));

            CreateMap<UpdateItemExportDetailsDto, ItemExportDetails>()
                .ForMember(dest => dest.ItemCode, opt => opt.MapFrom(src => src.ItemId.ToString()));
        }
    }
} 