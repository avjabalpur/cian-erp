using AutoMapper;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ItemTypeMapper : Profile
    {
        public ItemTypeMapper()
        {
            CreateMap<CreateItemTypeDto, ItemType>();
            CreateMap<UpdateItemTypeDto, ItemType>();
            CreateMap<ItemType, ItemTypeDto>();

            // For updates, we need to handle the ID mapping explicitly
            CreateMap<ItemType, ItemType>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
        }
    }
} 