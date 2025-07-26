using AutoMapper;
using Xcianify.Core.DTOs;
using Xcianify.Core.DTOs.User;
using Xcianify.Core.Model;

namespace Xcianify.Core.Mappers
{
    public class UserMapper : Profile
    {
        public UserMapper()
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, CreateUserDto>().ReverseMap();
            CreateMap<User, UpdateUserDto>().ReverseMap();

            CreateMap<UserRole, UserRoleDto>().ReverseMap();

        }
    }
} 