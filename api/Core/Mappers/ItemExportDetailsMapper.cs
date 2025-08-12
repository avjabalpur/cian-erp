using AutoMapper;
using Xcianify.Core.DTOs.ItemExportDetails;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class ItemExportDetailsMapper : Profile
    {
        public ItemExportDetailsMapper()
        {
            CreateMap<ItemExportDetails, ItemExportDetailsDto>().ReverseMap();

            CreateMap<CreateItemExportDetailsDto, ItemExportDetails>();
              
            CreateMap<UpdateItemExportDetailsDto, ItemExportDetails>();
        }
    }
} 