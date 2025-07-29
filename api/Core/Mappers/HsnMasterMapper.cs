using AutoMapper;
using Xcianify.Core.DTOs.ItemMaster;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class HsnMasterMapper : Profile
    {
        public HsnMasterMapper()
        {
            CreateMap<CreateHsnMasterDto, HsnMaster>();
            CreateMap<UpdateHsnMasterDto, HsnMaster>();
            CreateMap<HsnMaster, HsnMasterDto>();

            // For updates, we need to handle the ID mapping explicitly
            CreateMap<HsnMaster, HsnMaster>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
        }
    }
} 