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
                .ForMember(dest => dest.File, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore());

            CreateMap<UpdateItemMediaDto, ItemMedia>()
                .ForMember(dest => dest.File, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore());
        }
    }
} 