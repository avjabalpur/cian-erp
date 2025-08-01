using AutoMapper;
using Xcianify.Core.DTOs.Dosage;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class DosageMapper : Profile
    {
        public DosageMapper()
        {
            CreateMap<Dosage, DosageDto>();
            CreateMap<CreateDosageDto, Dosage>();
            CreateMap<UpdateDosageDto, Dosage>();
        }
    }
} 