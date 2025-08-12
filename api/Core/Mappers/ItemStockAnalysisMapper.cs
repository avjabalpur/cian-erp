using AutoMapper;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ItemStockAnalysisMapper : Profile
    {
        public ItemStockAnalysisMapper()
        {
            // Map from DTO to Model
            CreateMap<CreateItemStockAnalysisDto, ItemStockAnalysis>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive));

            // Map from Model to DTO
            CreateMap<ItemStockAnalysis, ItemStockAnalysisDto>();

            // Map for updates
            CreateMap<UpdateItemStockAnalysisDto, ItemStockAnalysis>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.ItemId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive ));
        }
    }
}