using AutoMapper;
using Xcianify.Core.DTOs;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class PermissionMapper : Profile
    {
        public PermissionMapper()
        {
            // Permission mappings
            CreateMap<Permission, PermissionDto>().ReverseMap();
            CreateMap<Permission, CreatePermissionDto>().ReverseMap();
            CreateMap<Permission, UpdatePermissionDto>().ReverseMap();

            // RolePermission mappings
            CreateMap<RolePermission, RolePermissionDto>().ReverseMap();
        }
    }
}
