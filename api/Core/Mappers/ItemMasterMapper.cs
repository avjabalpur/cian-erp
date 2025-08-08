using AutoMapper;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;
using static Xcianify.Core.DTOs.ItemMaster.CreateItemSalesDetailDto;

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

            CreateMap<CreateItemSpecificationDto, ItemSpecification>();
            CreateMap<UpdateItemSpecificationDto, ItemSpecification>();


            // stock analysis  mappings here

            CreateMap<ItemStockAnalysis, ItemStockAnalysisDto>();
            CreateMap<CreateItemStockAnalysisDto, ItemStockAnalysis>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())          // primary key
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())   // set manually
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())   // set manually
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore());
            
            CreateMap<UpdateItemStockAnalysisDto, ItemStockAnalysis>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())          // primary key
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())   // preserve original
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())   // preserve original
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())   // set manually
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore());  // set manually

            CreateMap<CreateItemSalesDetailDto, ItemSalesDetail>();
            CreateMap<ItemSalesDetail, ItemSalesDetailDto>();
            CreateMap<UpdateItemSalesDetailDto, ItemSalesDetail>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())          // preserve existing ID
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())   // preserve original
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())   // preserve original
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())   // set manually
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore());  // set manually

            //CreateMap<ItemMaster, ItemMaster>()
            //    .ForMember(dest => dest.Id, opt => opt.Ignore());

            //CreateMap<ItemSpecification, ItemSpecification>()
            //    .ForMember(dest => dest.Id, opt => opt.Ignore())
            //    .ForMember(dest => dest.ItemCode, opt => opt.Ignore());
        }
    }
}
