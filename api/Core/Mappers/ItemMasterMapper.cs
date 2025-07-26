using AutoMapper;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ItemMasterMapper : Profile
    {
        public ItemMasterMapper()
        {
            CreateMap<CreateItemMasterDto, ItemMaster>();
            CreateMap<UpdateItemMasterDto, ItemMaster>();
            CreateMap<ItemMaster, ItemMasterDto>();

            CreateMap<ItemSpecificationDto, ItemSpecification>();
            CreateMap<ItemSpecification, ItemSpecificationDto>();

            // For updates, we need to handle the ID mapping explicitly
            CreateMap<ItemMaster, ItemMaster>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedOn, opt => opt.Ignore());

            CreateMap<ItemSpecification, ItemSpecification>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.ItemCode, opt => opt.Ignore());
        }
    }
}
