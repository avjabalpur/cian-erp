using AutoMapper;
using Xcianify.Core.DTOs;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class RoleMapper : Profile
    {
        public RoleMapper()
        {
            CreateMap<Role, RoleDto>().ReverseMap();
        }
    }
} 