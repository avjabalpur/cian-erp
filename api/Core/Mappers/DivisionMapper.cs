using AutoMapper;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.Division;
using Xcianify.Core.DTOs.User;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class DivisionMapper : Profile
    {
        public DivisionMapper()
        {
            CreateMap<Division, DivisionDto>().ReverseMap();
            CreateMap<Division, CreateDivisionDto>().ReverseMap();
            CreateMap<Division, UpdateDivisionDto>().ReverseMap();
        }
    }
} 