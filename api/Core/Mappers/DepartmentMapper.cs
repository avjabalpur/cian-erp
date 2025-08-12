using AutoMapper;
using Xcianify.Core.DTOs.Department;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class DepartmentMapper : Profile
    {
        public DepartmentMapper()
        {
            CreateMap<Department, DepartmentDto>().ReverseMap();
            CreateMap<Department, CreateDepartmentDto>().ReverseMap();
            CreateMap<Department, UpdateDepartmentDto>().ReverseMap();
        }
    }
} 