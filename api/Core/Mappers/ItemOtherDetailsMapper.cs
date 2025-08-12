using AutoMapper;
using Xcianify.Core.DTOs.ItemOtherDetails;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ItemOtherDetailsMapper : Profile
    {
        public ItemOtherDetailsMapper()
        {
            CreateMap<ItemOtherDetails, ItemOtherDetailsDto>();

            CreateMap<CreateItemOtherDetailsDto, ItemOtherDetails>();

            CreateMap<UpdateItemOtherDetailsDto, ItemOtherDetails>();
        }
    }
} 